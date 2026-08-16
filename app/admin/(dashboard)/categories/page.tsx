'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { Category } from '@prisma/client';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function loadCategories() {
    setLoading(true);
    const res = await fetch('/api/admin/categories');
    setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);

    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || 'Failed to add category.');
    } else {
      toast.success('Category added.');
      setName('');
      loadCategories();
    }
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Category removed.');
      loadCategories();
    } else {
      toast.error('Failed to remove category.');
    }
  }

  return (
    <>
      <AdminHeader title="Categories" />
      <div className="p-6 lg:p-10">
        <form onSubmit={handleAdd} className="mb-10 flex max-w-md items-end gap-4">
          <Input label="New Category" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" disabled={submitting}>Add</Button>
        </form>

        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : categories.length > 0 ? (
          <div className="divide-y divide-border border-t border-b border-border">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-3">
                <span>{cat.name}</span>
                <button onClick={() => handleDelete(cat.id)} className="text-xs text-accent hover:underline">
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-border py-16 text-center text-muted">No categories yet.</p>
        )}
      </div>
    </>
  );
}
