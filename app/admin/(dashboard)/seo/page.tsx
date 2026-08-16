'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { SEOSetting } from '@prisma/client';

const PAGES = ['global', 'home', 'about', 'work', 'experience', 'services', 'awards', 'contact'];

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SEOSetting[]>([]);
  const [page, setPage] = useState('global');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/seo');
    setSettings(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const existing = settings.find((s) => s.page === page);
    setTitle(existing?.title ?? '');
    setDescription(existing?.description ?? '');
    setKeywords(existing?.keywords ?? '');
    setOgImageUrl(existing?.ogImageUrl ?? '');
  }, [page, settings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/admin/seo', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, title, description, keywords, ogImageUrl }),
    });

    if (res.ok) {
      toast.success('SEO settings saved.');
      load();
    } else {
      toast.error('Failed to save.');
    }
    setSubmitting(false);
  }

  return (
    <>
      <AdminHeader title="SEO" />
      <div className="p-6 lg:p-10">
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
            <Select label="Page" value={page} onChange={(e) => setPage(e.target.value)}>
              {PAGES.map((p) => <option key={p} value={p}>{p === 'global' ? 'Global (Site-wide)' : p}</option>)}
            </Select>

            <Input label="SEO Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div>
              <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">SEO Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
            </div>
            <Input label="Keywords (comma-separated)" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            <Input label="OG Image URL" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} />

            <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save SEO Settings'}</Button>
          </form>
        )}
      </div>
    </>
  );
}
