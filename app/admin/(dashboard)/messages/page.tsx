'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DataTable } from '@/components/admin/DataTable';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/hooks/useToast';
import type { ContactMessage } from '@prisma/client';

const STATUS_VARIANT: Record<string, 'default' | 'accent' | 'outline'> = {
  NEW: 'accent',
  READ: 'default',
  REPLIED: 'default',
  ARCHIVED: 'outline',
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/messages');
    setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function openMessage(message: ContactMessage) {
    setSelected(message);
    if (message.status === 'NEW') {
      await fetch(`/api/admin/messages/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READ' }),
      });
      load();
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success('Status updated.');
      load();
      setSelected(null);
    }
  }

  return (
    <>
      <AdminHeader title="Messages" />
      <div className="p-6 lg:p-10">
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <DataTable
            rows={messages}
            getRowKey={(m) => m.id}
            emptyLabel="No messages yet."
            onRowClick={openMessage}
            columns={[
              { header: 'Name', accessor: (m) => m.name },
              { header: 'Email', accessor: (m) => m.email },
              { header: 'Company', accessor: (m) => m.company ?? '—' },
              { header: 'Project Type', accessor: (m) => m.projectType ?? '—' },
              { header: 'Date', accessor: (m) => new Date(m.createdAt).toLocaleDateString() },
              { header: 'Status', accessor: (m) => <Badge variant={STATUS_VARIANT[m.status]}>{m.status}</Badge> },
            ]}
          />
        )}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-muted">{selected.email}{selected.company ? ` · ${selected.company}` : ''}</p>
            {selected.projectType && <p className="text-xs uppercase tracking-widest2 text-accent">{selected.projectType}</p>}
            <p className="whitespace-pre-wrap text-sm">{selected.message}</p>

            <div className="flex flex-wrap gap-2 pt-4">
              {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(selected.id, status)}
                  className="border border-border px-3 py-1.5 text-xs uppercase tracking-widest2 hover:border-accent hover:text-accent"
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
