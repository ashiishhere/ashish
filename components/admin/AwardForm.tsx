'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader, type UploadedImage } from '@/components/admin/ImageUploader';
import { useToast } from '@/hooks/useToast';
import type { Award, AwardImage } from '@prisma/client';

interface AwardFormProps {
  initialAward?: Award & { galleryImages: AwardImage[] };
}

export function AwardForm({ initialAward }: AwardFormProps) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = !!initialAward;

  const [projectName, setProjectName] = useState(initialAward?.projectName ?? '');
  const [awardTitle, setAwardTitle] = useState(initialAward?.awardTitle ?? '');
  const [festivalName, setFestivalName] = useState(initialAward?.festivalName ?? '');
  const [location, setLocation] = useState(initialAward?.location ?? '');
  const [year, setYear] = useState(initialAward?.year?.toString() ?? '');
  const [description, setDescription] = useState(initialAward?.description ?? '');
  const [mainImageAlt, setMainImageAlt] = useState(initialAward?.mainImageAlt ?? '');
  const [featured, setFeatured] = useState(initialAward?.featured ?? false);
  const [published, setPublished] = useState(initialAward?.published ?? true);
  const [mainImage, setMainImage] = useState<UploadedImage[]>(
    initialAward?.mainImageUrl ? [{ url: initialAward.mainImageUrl, publicId: initialAward.mainImagePublicId ?? '' }] : []
  );
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>(
    initialAward?.galleryImages.map((g) => ({ url: g.url, publicId: g.publicId ?? '' })) ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const payload = {
        projectName,
        awardTitle,
        festivalName,
        location,
        year: year ? Number(year) : undefined,
        description,
        mainImageAlt,
        featured,
        published,
        sortOrder: initialAward?.sortOrder ?? 0,
        mainImageUrl: mainImage[0]?.url,
        mainImagePublicId: mainImage[0]?.publicId,
        galleryImages,
      };

      const res = await fetch(isEdit ? `/api/admin/awards/${initialAward!.id}` : '/api/admin/awards', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.issues as Record<string, string[]>)) {
            fieldErrors[key] = msgs[0];
          }
          setErrors(fieldErrors);
        }
        toast.error(data.error || 'Failed to save award.');
        return;
      }

      toast.success(isEdit ? 'Award updated.' : 'Award created.');
      router.push('/admin/awards');
      router.refresh();
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="Award / Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} error={errors.projectName} required />
        <Input label="Award Title" value={awardTitle} onChange={(e) => setAwardTitle(e.target.value)} error={errors.awardTitle} required />
        <Input label="Festival / Organization" value={festivalName} onChange={(e) => setFestivalName(e.target.value)} error={errors.festivalName} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} error={errors.location} />
        <Input label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} error={errors.year} />
        <Input label="Main Image Alt Text" value={mainImageAlt} onChange={(e) => setMainImageAlt(e.target.value)} />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none"
        />
      </div>

      <ImageUploader label="Main Award Image" folder="awards/main" value={mainImage} onChange={setMainImage} />
      <ImageUploader label="Additional Award Images" folder="awards/gallery" multiple value={galleryImages} onChange={setGalleryImages} />

      <div className="flex gap-8">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published
        </label>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Saving…' : isEdit ? 'Update Award' : 'Create Award'}
      </Button>
    </form>
  );
}
