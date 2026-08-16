import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { slugify } from '@/lib/utils';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const categories = await db.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const category = await db.category.create({ data: { name, slug: slugify(name) } });
    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'A category with this name already exists.' }, { status: 409 });
  }
}
