'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { SiteSetting, SocialLink } from '@prisma/client';

export default function AdminSettingsPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const toast = useToast();

  async function loadAll() {
    setLoading(true);
    const [settingsRes, linksRes] = await Promise.all([
      fetch('/api/admin/settings'),
      fetch('/api/admin/social-links'),
    ]);
    const settings: SiteSetting | null = await settingsRes.json();
    if (settings) {
      setPhone(settings.phone ?? '');
      setEmail(settings.email ?? '');
    }
    setLinks(await linksRes.json());
    setLoading(false);
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSaveContact(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, email }),
    });
    if (res.ok) toast.success('Contact info updated.');
    else toast.error('Failed to save.');
    setSubmitting(false);
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) return;

    const res = await fetch('/api/admin/social-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, url }),
    });

    if (res.ok) {
      toast.success('Social link added.');
      setPlatform('');
      setUrl('');
      loadAll();
    } else {
      toast.error('Failed to add link.');
    }
  }

  async function handleDeleteLink(id: string) {
    const res = await fetch(`/api/admin/social-links/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Link removed.');
      loadAll();
    }
  }

  if (loading) return (<><AdminHeader title="Settings" /><div className="p-10 text-muted">Loading…</div></>);

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="p-6 lg:p-10 space-y-16">
        <div>
          <h2 className="mb-6 text-sm uppercase tracking-widest2 text-muted">Contact Information</h2>
          <form onSubmit={handleSaveContact} className="max-w-md space-y-6">
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
          </form>
        </div>

        <div>
          <h2 className="mb-6 text-sm uppercase tracking-widest2 text-muted">Social Links</h2>
          <form onSubmit={handleAddLink} className="mb-8 flex max-w-lg items-end gap-4">
            <Input label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="Instagram" />
            <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            <Button type="submit">Add</Button>
          </form>

          {links.length > 0 ? (
            <div className="max-w-lg divide-y divide-border border-t border-b border-border">
              {links.map((link) => (
                <div key={link.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm">{link.platform}</p>
                    <p className="text-xs text-muted">{link.url}</p>
                  </div>
                  <button onClick={() => handleDeleteLink(link.id)} className="text-xs text-accent hover:underline">Delete</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No social links yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
