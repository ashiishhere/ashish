'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import type { Service } from '@prisma/client';

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | undefined>(undefined);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/services');
    setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Service removed.');
      load();
    } else {
      toast.error('Failed to remove.');
    }
  }

  return (
    <>
      <AdminHeader title="Services" />
      <div className="p-6 lg:p-10">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => { setEditing(undefined); setModalOpen(true); }}
            className="border border-accent bg-accent px-5 py-2.5 text-xs uppercase tracking-widest2 text-white"
          >
            Add Service
          </button>
        </div>

        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <DataTable
            rows={items}
            getRowKey={(s) => s.id}
            emptyLabel="No services yet."
            onRowClick={(s) => { setEditing(s); setModalOpen(true); }}
            columns={[
              { header: 'Title', accessor: (s) => s.title },
              { header: 'Description', accessor: (s) => <span className="line-clamp-1 text-muted">{s.description}</span> },
              { header: 'Status', accessor: (s) => s.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge> },
              {
                header: '',
                accessor: (s) => (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }} className="text-xs text-accent hover:underline">
                    Delete
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Service' : 'Add Service'}>
        <ServiceForm initialService={editing} onSaved={() => { setModalOpen(false); load(); }} onCancel={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
