import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

async function requireAuth() {
  return getServerSession(authOptions);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { status } = await req.json();
  if (!['NEW', 'READ', 'REPLIED', 'ARCHIVED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const message = await db.contactMessage.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(message);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await db.contactMessage.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
