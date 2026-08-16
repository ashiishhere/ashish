import { db } from '@/lib/db';
import { ProjectFilterGrid } from '@/components/work/ProjectFilterGrid';
import { Button } from '@/components/ui/Button';

async function getFeaturedProjects() {
  try {
    return await db.project.findMany({
      where: { published: true, featured: true },
      include: { category: true, videos: { take: 1, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
      take: 8,
    });
  } catch {
    return [];
  }
}

export async function SelectedWork() {
  const projects = await getFeaturedProjects();

  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="container-cinema">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Portfolio</p>
            <h2 className="font-display text-3xl uppercase sm:text-4xl lg:text-5xl">Selected Work</h2>
            <p className="mt-4 max-w-lg text-muted">
              A selection of films, stories, campaigns and digital content I&apos;ve directed, produced
              and edited.
            </p>
          </div>
          <Button href="/portfolio" variant="outline">View All Work</Button>
        </div>

        {projects.length > 0 ? (
          <ProjectFilterGrid projects={projects} showFilters={false} />
        ) : (
          <p className="border border-dashed border-border py-16 text-center text-muted">
            No projects available yet.
          </p>
        )}
      </div>
    </section>
  );
}
