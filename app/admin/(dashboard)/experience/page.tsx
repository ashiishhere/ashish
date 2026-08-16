'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ExperienceForm } from '@/components/admin/ExperienceForm';
import { useToast } from '@/hooks/useToast';
import { formatDateRange } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { Experience } from '@prisma/client';

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | undefined>(undefined);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/experience');
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(exp: Experience) {
    setEditing(exp);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/experience/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Experience removed.');
      load();
    } else {
      toast.error('Failed to remove.');
    }
  }

  return (
    <>
      <AdminHeader title="Experience" />
      <div className="p-6 lg:p-10">
        <div className="mb-6 flex justify-end">
          <button onClick={openNew} className="border border-accent bg-accent px-5 py-2.5 text-xs uppercase tracking-widest2 text-white">
            Add Experience
          </button>
        </div>

        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <DataTable
            rows={items}
            getRowKey={(e) => e.id}
            emptyLabel="No experience records yet."
            onRowClick={openEdit}
            columns={[
              { header: 'Role', accessor: (e) => e.jobTitle },
              { header: 'Company', accessor: (e) => e.company },
              { header: 'Dates', accessor: (e) => formatDateRange(e.startDate, e.endDate, e.currentPosition) },
              { header: 'Status', accessor: (e) => e.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge> },
              {
                header: '',
                accessor: (e) => (
                  <button onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id); }} className="text-xs text-accent hover:underline">
                    Delete
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm
          initialExperience={editing}
          onSaved={() => { setModalOpen(false); load(); }}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </>
  );
}
