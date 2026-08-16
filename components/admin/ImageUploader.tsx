'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/useToast';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  label: string;
  folder: string;
  multiple?: boolean;
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

/**
 * Client-side uploader that posts to /api/admin/upload, which stores the
 * image in Cloudinary (or whichever provider lib/cloudinary.ts wraps) and
 * returns a URL + publicId. Only the URL/publicId are ever persisted —
 * never binary data in Postgres.
 */
export function ImageUploader({ label, folder, multiple = false, value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploaded: UploadedImage[] = [];
      for (const file of Array.from(files)) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`${file.name}: unsupported file type.`);
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          toast.error(`${file.name}: file exceeds 8MB limit.`);
          continue;
        }

        const dataUrl = await fileToDataUrl(file);
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl, folder }),
        });

        if (!res.ok) {
          toast.error(`${file.name}: upload failed.`);
          continue;
        }

        const result = await res.json();
        uploaded.push({ url: result.url, publicId: result.publicId });
      }

      onChange(multiple ? [...value, ...uploaded] : uploaded);
      if (uploaded.length > 0) toast.success('Image uploaded.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDelete(publicId: string) {
    onChange(value.filter((img) => img.publicId !== publicId));
  }

  return (
    <div>
      <p className="mb-2 block text-xs uppercase tracking-widest2 text-muted">{label}</p>

      {value.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3">
          {value.map((img) => (
            <div key={img.publicId} className="relative h-24 w-24 overflow-hidden border border-border">
              <Image src={img.url} alt="" fill sizes="96px" className="object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(img.publicId)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black/70 text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-block cursor-pointer border border-dashed border-border px-5 py-3 text-xs uppercase tracking-widest2 text-muted hover:border-accent hover:text-accent">
        {uploading ? 'Uploading…' : value.length > 0 && !multiple ? 'Replace Image' : 'Upload Image'}
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          multiple={multiple}
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
