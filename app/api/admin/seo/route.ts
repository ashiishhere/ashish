import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const settings = await db.sEOSetting.findMany({ orderBy: { page: 'asc' } });
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { page, title, description, keywords, ogImageUrl } = await req.json();
  if (!page) return NextResponse.json({ error: 'Page identifier is required' }, { status: 400 });

  const setting = await db.sEOSetting.upsert({
    where: { page },
    update: { title, description, keywords, ogImageUrl },
    create: { page, title, description, keywords, ogImageUrl },
  });

  return NextResponse.json(setting);
}
