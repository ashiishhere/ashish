'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { Service } from '@prisma/client';

interface ServiceFormProps {
  initialService?: Service;
  onSaved: () => void;
  onCancel: () => void;
}

export function ServiceForm({ initialService, onSaved, onCancel }: ServiceFormProps) {
  const isEdit = !!initialService;
  const toast = useToast();

  const [title, setTitle] = useState(initialService?.title ?? '');
  const [description, setDescription] = useState(initialService?.description ?? '');
  const [published, setPublished] = useState(initialService?.published ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = { title, description, sortOrder: initialService?.sortOrder ?? 0, published };

    try {
      const res = await fetch(isEdit ? `/api/admin/services/${initialService!.id}` : '/api/admin/services', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to save.');
        return;
      }

      toast.success(isEdit ? 'Service updated.' : 'Service added.');
      onSaved();
    } catch {
      toast.error('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none"
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <div className="flex gap-4">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : isEdit ? 'Update' : 'Add'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
