'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { WorkFilters } from './WorkFilters';
import { CATEGORY_FILTERS } from '@/lib/utils';
import type { ProjectWithRelations } from '@/types/project';

interface ProjectFilterGridProps {
  projects: ProjectWithRelations[];
  showFilters?: boolean;
}

export function ProjectFilterGrid({ projects, showFilters = true }: ProjectFilterGridProps) {
  const [active, setActive] = useState<(typeof CATEGORY_FILTERS)[number]>('ALL');

  const filtered = useMemo(() => {
    if (active === 'ALL') return projects;
    return projects.filter((p) => p.category?.name?.toUpperCase() === active);
  }, [projects, active]);

  return (
    <div>
      {showFilters && <WorkFilters active={active} onChange={setActive} />}

      {filtered.length > 0 ? (
        <div className="grid auto-rows-[1fr] grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-border py-16 text-center text-muted">
          No projects available yet.
        </p>
      )}
    </div>
  );
}
