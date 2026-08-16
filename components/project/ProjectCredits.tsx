import { ROLE_LABELS } from '@/lib/utils';
import type { ProjectWithRelations } from '@/types/project';

export function ProjectCredits({ project }: { project: ProjectWithRelations }) {
  const roles = Array.from(new Set([project.role, ...project.videos.map((v) => v.role)]));

  return (
    <div className="container-cinema border-t border-border py-12">
      <p className="eyebrow mb-6">Credits</p>
      <ul className="space-y-2 text-sm text-muted">
        {roles.map((role) => (
          <li key={role}>
            <span className="text-foreground">Ashish Dabhade</span> — {ROLE_LABELS[role]}
          </li>
        ))}
      </ul>
    </div>
  );
}
