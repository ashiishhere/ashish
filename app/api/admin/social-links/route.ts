import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const links = await db.socialLink.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(links);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { platform, url } = await req.json();
  if (!platform || !url) return NextResponse.json({ error: 'Platform and URL are required' }, { status: 400 });

  const link = await db.socialLink.create({ data: { platform, url } });
  return NextResponse.json(link, { status: 201 });
}
