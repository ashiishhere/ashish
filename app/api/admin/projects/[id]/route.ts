import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectSchema } from '@/lib/validations';
import { extractYouTubeVideoId } from '@/lib/youtube';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const project = await db.project.findUnique({
    where: { id: params.id },
    include: { category: true, videos: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(project);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { videos, categoryId, client, shortDescription, fullDescription, year, ...rest } = parsed.data;

  const resolvedVideos: {
    title: string;
    youtubeVideoId: string;
    videoType: 'LONG' | 'SHORT';
    description: string | null;
    role: 'DIRECTOR' | 'PRODUCER' | 'EDITOR' | 'VIDEOGRAPHER' | 'ASSISTANT_DIRECTOR' | 'OTHER';
    sortOrder: number;
  }[] = [];
  for (const v of videos) {
    const videoId = extractYouTubeVideoId(v.youtubeUrl);
    if (!videoId) {
      return NextResponse.json({ error: `Invalid YouTube URL for video "${v.title}"` }, { status: 400 });
    }
    resolvedVideos.push({
      title: v.title,
      youtubeVideoId: videoId,
      videoType: v.videoType,
      description: v.description || null,
      role: v.role,
      sortOrder: v.sortOrder,
    });
  }

  try {
    // Replace all videos atomically: delete existing, create the submitted set.
    const project = await db.$transaction(async (tx) => {
      await tx.projectVideo.deleteMany({ where: { projectId: params.id } });
      return tx.project.update({
        where: { id: params.id },
        data: {
          ...rest,
          client: client || null,
          shortDescription: shortDescription || null,
          fullDescription: fullDescription || null,
          year: year || null,
          categoryId: categoryId || null,
          videos: { create: resolvedVideos },
        },
      });
    });
    return NextResponse.json(project);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A project with this slug already exists.' }, { status: 409 });
    }
    console.error('Failed to update project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await db.project.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
