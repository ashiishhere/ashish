'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import type { Project, Category } from '@prisma/client';

type ProjectRow = Project & { category: Category | null };

/**
 * DataTable is a Client Component, so its column definitions (which contain
 * functions) must be built inside a Client Component too — a Server
 * Component can only pass serializable data across that boundary, never
 * functions. This wrapper receives plain project data from the Server
 * Component page and builds the function-containing column config itself.
 */
export function ProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });

    if (res.ok) {
      toast.success('Project deleted.');
      router.refresh();
    } else {
      toast.error('Failed to delete project.');
    }
    setDeletingId(null);
  }

  return (
    <DataTable
      rows={projects}
      getRowKey={(p) => p.id}
      emptyLabel="No projects available yet."
      columns={[
        { header: 'Title', accessor: (p) => <Link href={`/admin/projects/${p.id}/edit`} className="hover:text-accent">{p.title}</Link> },
        { header: 'Category', accessor: (p) => p.category?.name ?? '—' },
        { header: 'Type', accessor: (p) => p.videoType },
        { header: 'Year', accessor: (p) => p.year ?? '—' },
        { header: 'Featured', accessor: (p) => p.featured ? <Badge variant="accent">Featured</Badge> : '—' },
        { header: 'Status', accessor: (p) => p.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge> },
        {
          header: '',
          accessor: (p) => (
            <button
              onClick={() => handleDelete(p.id, p.title)}
              disabled={deletingId === p.id}
              className="text-xs text-accent hover:underline disabled:opacity-50"
            >
              {deletingId === p.id ? 'Deleting…' : 'Delete'}
            </button>
          ),
        },
      ]}
    />
  );
}
