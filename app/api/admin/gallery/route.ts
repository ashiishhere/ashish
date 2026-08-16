export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const images = await db.galleryImage.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(images);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { url, publicId, altText, caption } = await req.json();
  if (!url) return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });

  const count = await db.galleryImage.count();
  const image = await db.galleryImage.create({
    data: { url, publicId: publicId || null, altText: altText || null, caption: caption || null, sortOrder: count },
  });

  return NextResponse.json(image, { status: 201 });
}
