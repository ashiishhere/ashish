export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { deleteImage } from '@/lib/cloudinary';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const image = await db.galleryImage.findUnique({ where: { id: params.id } });
  if (image?.publicId) {
    await deleteImage(image.publicId).catch(() => null);
  }

  await db.galleryImage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
