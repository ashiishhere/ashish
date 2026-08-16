import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { projectSchema } from '@/lib/validations';
import { extractYouTubeVideoId } from '@/lib/youtube';

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  return session;
}

export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projects = await db.project.findMany({
    include: { category: true, videos: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { videos, categoryId, client, shortDescription, fullDescription, year, ...rest } = parsed.data;

  // Resolve YouTube URLs to video IDs server-side; reject if any URL is invalid.
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
    const project = await db.project.create({
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
    return NextResponse.json(project, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'A project with this slug already exists.' }, { status: 409 });
    }
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
