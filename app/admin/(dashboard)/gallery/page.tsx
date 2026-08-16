'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ImageUploader, type UploadedImage } from '@/components/admin/ImageUploader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { GalleryImage } from '@prisma/client';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<UploadedImage[]>([]);
  const [caption, setCaption] = useState('');
  const [altText, setAltText] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  async function load() {
    setLoading(true);
    const res = await fetch('/api/admin/gallery', { cache: 'no-store' });
    setImages(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd() {
    if (pending.length === 0) {
      toast.error('Upload an image first.');
      return;
    }
    setSaving(true);

    for (const img of pending) {
      await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: img.url, publicId: img.publicId, altText, caption }),
      });
    }

    toast.success('Image added to gallery.');
    setPending([]);
    setCaption('');
    setAltText('');
    load();
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Image removed.');
      load();
    } else {
      toast.error('Failed to remove image.');
    }
  }

  return (
    <>
      <AdminHeader title="Gallery" />
      <div className="p-6 lg:p-10">
        <div className="mb-12 max-w-xl space-y-6 border border-border p-6">
          <p className="text-sm uppercase tracking-widest2 text-accent">Add Gallery Image</p>
          <ImageUploader label="Photo" folder="gallery" value={pending} onChange={setPending} />
          <Input label="Alt Text" value={altText} onChange={(e) => setAltText(e.target.value)} />
          <Input label="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} />
          <Button onClick={handleAdd} disabled={saving}>{saving ? 'Adding…' : 'Add to Gallery'}</Button>
        </div>

        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {images.map((img) => (
              <div key={img.id} className="relative aspect-square overflow-hidden border border-border">
                <Image src={img.url} alt={img.altText || ''} fill sizes="200px" className="object-cover" />
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-black/70 text-xs text-white hover:bg-accent"
                  aria-label="Delete image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-border py-16 text-center text-muted">No gallery images yet.</p>
        )}
      </div>
    </>
  );
}
