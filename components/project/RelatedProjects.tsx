import { db } from '@/lib/db';
import { ProjectCard } from '@/components/work/ProjectCard';

export async function RelatedProjects({ currentId, categoryId }: { currentId: string; categoryId: string | null }) {
  let related: Awaited<ReturnType<typeof fetchRelated>> = [];
  try {
    related = await fetchRelated(currentId, categoryId);
  } catch {
    related = [];
  }

  if (related.length === 0) return null;

  return (
    <div className="border-t border-border bg-surface py-20">
      <div className="container-cinema">
        <p className="eyebrow mb-10">More Work</p>
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

function fetchRelated(currentId: string, categoryId: string | null) {
  return db.project.findMany({
    where: {
      published: true,
      id: { not: currentId },
      ...(categoryId ? { categoryId } : {}),
    },
    include: { category: true, videos: { take: 1, orderBy: { sortOrder: 'asc' } } },
    orderBy: { sortOrder: 'asc' },
    take: 3,
  });
}
