'use client';

import Link from 'next/link';
import { DataTable } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/Badge';
import type { Award } from '@prisma/client';

export function AwardsTable({ awards }: { awards: Award[] }) {
  return (
    <DataTable
      rows={awards}
      getRowKey={(a) => a.id}
      emptyLabel="No awards yet."
      columns={[
        { header: 'Project', accessor: (a) => <Link href={`/admin/awards/${a.id}/edit`} className="hover:text-accent">{a.projectName}</Link> },
        { header: 'Award', accessor: (a) => a.awardTitle },
        { header: 'Festival', accessor: (a) => a.festivalName },
        { header: 'Year', accessor: (a) => a.year ?? '—' },
        { header: 'Featured', accessor: (a) => a.featured ? <Badge variant="accent">Featured</Badge> : '—' },
        { header: 'Status', accessor: (a) => a.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge> },
      ]}
    />
  );
}
