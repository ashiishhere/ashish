export const revalidate = 0;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { ProjectHero } from '@/components/project/ProjectHero';
import { ProjectMeta } from '@/components/project/ProjectMeta';
import { ProjectDescription } from '@/components/project/ProjectDescription';
import { ProjectVideos } from '@/components/project/ProjectVideos';
import { ProjectCredits } from '@/components/project/ProjectCredits';
import { RelatedProjects } from '@/components/project/RelatedProjects';

interface PageProps {
  params: { slug: string };
}

async function getProject(slug: string) {
  return db.project.findFirst({
    where: { slug, published: true },
    include: { category: true, videos: { orderBy: { sortOrder: 'asc' } } },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDescription || undefined,
    openGraph: project.ogImageUrl ? { images: [project.ogImageUrl] } : undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <ProjectHero project={project} />
      <ProjectMeta project={project} />
      <ProjectDescription description={project.fullDescription} />
      <ProjectVideos videos={project.videos} />
      <ProjectCredits project={project} />
      <RelatedProjects currentId={project.id} categoryId={project.categoryId} />
    </>
  );
}
