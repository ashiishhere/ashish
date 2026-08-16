import { ROLE_LABELS } from '@/lib/utils';
import type { ProjectWithRelations } from '@/types/project';

export function ProjectMeta({ project }: { project: ProjectWithRelations }) {
  const items = [
    { label: 'Client', value: project.client },
    { label: 'Year', value: project.year },
    { label: 'Category', value: project.category?.name },
    { label: 'Role', value: ROLE_LABELS[project.role] },
  ].filter((i) => i.value);

  if (items.length === 0) return null;

  return (
    <div className="container-cinema grid grid-cols-2 gap-6 border-b border-border py-10 sm:grid-cols-5">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-xs uppercase tracking-widest2 text-muted">{item.label}</p>
          <p className="mt-2 text-sm">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
