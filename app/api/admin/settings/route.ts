export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function GET() {
  const settings = await db.siteSetting.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const existing = await db.siteSetting.findFirst();

  const data = {
    headline: body.headline || null,
    bio: body.bio || null,
    shortBio: body.shortBio || null,
    professionalSummary: body.professionalSummary || null,
    phone: body.phone || null,
    email: body.email || null,
    professionalAffiliation: body.professionalAffiliation || null,
    languages: body.languages ?? [],
    softwareTools: body.softwareTools ?? [],
    aiTools: body.aiTools ?? [],
    skillsEditing: body.skillsEditing ?? [],
    skillsProduction: body.skillsProduction ?? [],
    heroSupportingText: body.heroSupportingText || null,
    introHeading: body.introHeading || null,
    introText1: body.introText1 || null,
    introText2: body.introText2 || null,
    contactHeading: body.contactHeading || null,
    contactText: body.contactText || null,
  };

  const settings = existing
    ? await db.siteSetting.update({ where: { id: existing.id }, data })
    : await db.siteSetting.create({ data });

  return NextResponse.json(settings);
}
