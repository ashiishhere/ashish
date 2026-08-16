import type { ProjectWithRelations } from '@/types/project';

export function ProjectHero({ project }: { project: ProjectWithRelations }) {
  return (
    <section className="border-b border-border pt-40 pb-16 sm:pt-48 sm:pb-20">
      <div className="container-cinema">
        <p className="eyebrow mb-4">
          {project.category?.name ?? 'Project'} {project.year ? `· ${project.year}` : ''}
        </p>
        <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl">
          {project.title}
        </h1>
        {project.shortDescription && (
          <p className="mt-6 max-w-2xl text-muted">{project.shortDescription}</p>
        )}
      </div>
    </section>
  );
}
