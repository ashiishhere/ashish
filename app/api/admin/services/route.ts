import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { serviceSchema } from '@/lib/validations';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const services = await db.service.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const service = await db.service.create({ data: { ...parsed.data, icon: parsed.data.icon || null } });
  return NextResponse.json(service, { status: 201 });
}
