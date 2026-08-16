import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { experienceSchema } from '@/lib/validations';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const experiences = await db.experience.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(experiences);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { startDate, endDate, location, description, ...rest } = parsed.data;

  const experience = await db.experience.create({
    data: {
      ...rest,
      location: location || null,
      description: description || null,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json(experience, { status: 201 });
}
