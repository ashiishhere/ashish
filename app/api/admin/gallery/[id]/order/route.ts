export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sortOrder } = await req.json();
  if (typeof sortOrder !== 'number') {
    return NextResponse.json({ error: 'sortOrder must be a number' }, { status: 400 });
  }

  const image = await db.galleryImage.update({
    where: { id: params.id },
    data: { sortOrder },
  });

  return NextResponse.json(image);
}
