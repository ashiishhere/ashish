import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { awardSchema } from '@/lib/validations';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const awards = await db.award.findMany({
    include: { galleryImages: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(awards);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = awardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { mainImageUrl, mainImagePublicId, galleryImages, ...rest } = body as typeof parsed.data & {
    mainImageUrl?: string;
    mainImagePublicId?: string;
    galleryImages?: { url: string; publicId: string }[];
  };

  const award = await db.award.create({
    data: {
      ...parsed.data,
      location: parsed.data.location || null,
      description: parsed.data.description || null,
      mainImageAlt: parsed.data.mainImageAlt || null,
      mainImageUrl: mainImageUrl || null,
      mainImagePublicId: mainImagePublicId || null,
      galleryImages: galleryImages?.length
        ? { create: galleryImages.map((img, i) => ({ url: img.url, publicId: img.publicId, sortOrder: i })) }
        : undefined,
    },
  });

  return NextResponse.json(award, { status: 201 });
}
