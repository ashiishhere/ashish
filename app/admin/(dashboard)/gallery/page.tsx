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

  async function handleOrderChange(id: string, sortOrder: number) {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, sortOrder } : img)));
  }

  async function handleOrderSave(id: string, sortOrder: number) {
    const res = await fetch(`/api/admin/gallery/${id}/order`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sortOrder }),
    });
    if (res.ok) {
      toast.success('Order updated.');
      load();
    } else {
      toast.error('Failed to update order.');
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

        <p className="mb-4 text-sm text-muted">
          Lower number shows first. Home page shows the first 6 images in this order.
        </p>

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
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-black/70 p-1.5">
                  <input
                    type="number"
                    value={img.sortOrder}
                    onChange={(e) => handleOrderChange(img.id, Number(e.target.value))}
                    className="w-12 border border-white/30 bg-transparent px-1 py-0.5 text-xs text-white"
                  />
                  <button
                    onClick={() => handleOrderSave(img.id, img.sortOrder)}
                    className="text-xs text-white hover:text-accent"
                  >
                    Save
                  </button>
                </div>
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
