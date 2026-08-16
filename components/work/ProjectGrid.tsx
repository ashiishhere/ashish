import { db } from '@/lib/db';
import { ProjectFilterGrid } from './ProjectFilterGrid';

async function getPublishedProjects() {
  try {
    return await db.project.findMany({
      where: { published: true },
      include: { category: true, videos: { take: 1, orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {
    return [];
  }
}

export async function ProjectGrid() {
  const projects = await getPublishedProjects();
  return (
    <div className="container-cinema py-16 sm:py-20">
      <ProjectFilterGrid projects={projects} />
    </div>
  );
}
