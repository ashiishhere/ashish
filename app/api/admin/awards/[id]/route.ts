import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { awardSchema } from '@/lib/validations';
import { deleteImage } from '@/lib/cloudinary';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const award = await db.award.findUnique({ where: { id: params.id }, include: { galleryImages: true } });
  if (!award) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(award);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = awardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { mainImageUrl, mainImagePublicId, galleryImages } = body as {
    mainImageUrl?: string;
    mainImagePublicId?: string;
    galleryImages?: { url: string; publicId: string }[];
  };

  // Replace gallery images atomically; delete removed ones from Cloudinary first.
  const existing = await db.award.findUnique({ where: { id: params.id }, include: { galleryImages: true } });
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const incomingPublicIds = new Set((galleryImages ?? []).map((g) => g.publicId));
  const removedImages = existing.galleryImages.filter((g) => g.publicId && !incomingPublicIds.has(g.publicId));
  for (const img of removedImages) {
    if (img.publicId) await deleteImage(img.publicId).catch(() => null);
  }

  if (existing.mainImagePublicId && mainImagePublicId && existing.mainImagePublicId !== mainImagePublicId) {
    await deleteImage(existing.mainImagePublicId).catch(() => null);
  }

  const award = await db.$transaction(async (tx) => {
    await tx.awardImage.deleteMany({ where: { awardId: params.id } });
    return tx.award.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        location: parsed.data.location || null,
        description: parsed.data.description || null,
        mainImageAlt: parsed.data.mainImageAlt || null,
        mainImageUrl: mainImageUrl ?? existing.mainImageUrl,
        mainImagePublicId: mainImagePublicId ?? existing.mainImagePublicId,
        galleryImages: galleryImages?.length
          ? { create: galleryImages.map((img, i) => ({ url: img.url, publicId: img.publicId, sortOrder: i })) }
          : undefined,
      },
    });
  });

  return NextResponse.json(award);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const award = await db.award.findUnique({ where: { id: params.id }, include: { galleryImages: true } });
  if (award) {
    if (award.mainImagePublicId) await deleteImage(award.mainImagePublicId).catch(() => null);
    for (const img of award.galleryImages) {
      if (img.publicId) await deleteImage(img.publicId).catch(() => null);
    }
  }

  await db.award.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
