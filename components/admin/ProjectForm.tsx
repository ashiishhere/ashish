'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { slugify } from '@/lib/utils';
import { isValidYouTubeUrl } from '@/lib/youtube';
import type { Category, Project, ProjectVideo } from '@prisma/client';

type VideoRow = {
  title: string;
  youtubeUrl: string;
  videoType: 'LONG' | 'SHORT';
  description: string;
  role: 'DIRECTOR' | 'PRODUCER' | 'EDITOR' | 'VIDEOGRAPHER' | 'ASSISTANT_DIRECTOR' | 'OTHER';
  sortOrder: number;
};

interface ProjectFormProps {
  categories: Category[];
  initialProject?: Project & { videos: ProjectVideo[] };
}

const ROLES = ['DIRECTOR', 'PRODUCER', 'EDITOR', 'VIDEOGRAPHER', 'ASSISTANT_DIRECTOR', 'OTHER'] as const;

export function ProjectForm({ categories, initialProject }: ProjectFormProps) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = !!initialProject;

  const [title, setTitle] = useState(initialProject?.title ?? '');
  const [slug, setSlug] = useState(initialProject?.slug ?? '');
  const [client, setClient] = useState(initialProject?.client ?? '');
  const [year, setYear] = useState(initialProject?.year?.toString() ?? '');
  const [categoryId, setCategoryId] = useState(initialProject?.categoryId ?? '');
  const [videoType, setVideoType] = useState<'LONG' | 'SHORT'>(initialProject?.videoType ?? 'LONG');
  const [role, setRole] = useState(initialProject?.role ?? 'EDITOR');
  const [shortDescription, setShortDescription] = useState(initialProject?.shortDescription ?? '');
  const [fullDescription, setFullDescription] = useState(initialProject?.fullDescription ?? '');
  const [featured, setFeatured] = useState(initialProject?.featured ?? false);
  const [published, setPublished] = useState(initialProject?.published ?? false);
  const [videos, setVideos] = useState<VideoRow[]>(
    initialProject?.videos.map((v) => ({
      title: v.title,
      youtubeUrl: v.youtubeVideoId,
      videoType: v.videoType,
      description: v.description ?? '',
      role: v.role,
      sortOrder: v.sortOrder,
    })) ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function addVideo() {
    setVideos([...videos, { title: '', youtubeUrl: '', videoType: 'LONG', description: '', role: 'EDITOR', sortOrder: videos.length }]);
  }

  function updateVideo(index: number, patch: Partial<VideoRow>) {
    setVideos(videos.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function removeVideo(index: number) {
    setVideos(videos.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    for (const v of videos) {
      if (!isValidYouTubeUrl(v.youtubeUrl)) {
        toast.error(`"${v.title || 'Untitled video'}" has an invalid YouTube URL.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        client,
        year: year ? Number(year) : undefined,
        categoryId,
        videoType,
        role,
        shortDescription,
        fullDescription,
        featured,
        published,
        sortOrder: initialProject?.sortOrder ?? 0,
        videos,
      };

      const res = await fetch(isEdit ? `/api/admin/projects/${initialProject!.id}` : '/api/admin/projects', {
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
        toast.error(data.error || 'Failed to save project.');
        return;
      }

      toast.success(isEdit ? 'Project updated.' : 'Project created.');
      router.push('/admin/projects');
      router.refresh();
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-10" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!isEdit) setSlug(slugify(e.target.value));
          }}
          error={errors.title}
          required
        />
        <Input label="Slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} error={errors.slug} required />
        <Input label="Client" value={client} onChange={(e) => setClient(e.target.value)} error={errors.client} />
        <Input label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} error={errors.year} />

        <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>

        <Select label="Primary Role" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
          {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Short Description</label>
        <textarea
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Full Description</label>
        <textarea
          rows={6}
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none"
        />
      </div>

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

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm uppercase tracking-widest2 text-muted">YouTube Videos</h2>
          <button type="button" onClick={addVideo} className="text-xs uppercase tracking-widest2 text-accent hover:underline">
            + Add Video
          </button>
        </div>

        <div className="space-y-6">
          {videos.map((video, i) => (
            <div key={i} className="space-y-4 border border-border p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest2 text-muted">Video {i + 1}</p>
                <button type="button" onClick={() => removeVideo(i)} className="text-xs text-accent hover:underline">
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Video Title" value={video.title} onChange={(e) => updateVideo(i, { title: e.target.value })} />
                <Input
                  label="YouTube URL"
                  placeholder="youtube.com/watch?v=... or /shorts/..."
                  value={video.youtubeUrl}
                  onChange={(e) => updateVideo(i, { youtubeUrl: e.target.value })}
                />
                <Select label="Video Type" value={video.videoType} onChange={(e) => updateVideo(i, { videoType: e.target.value as 'LONG' | 'SHORT' })}>
                  <option value="LONG">Long</option>
                  <option value="SHORT">Short</option>
                </Select>
                <Select label="Role" value={video.role} onChange={(e) => updateVideo(i, { role: e.target.value as VideoRow['role'] })}>
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </Select>
              </div>
              <Input label="Description" value={video.description} onChange={(e) => updateVideo(i, { description: e.target.value })} />
            </div>
          ))}
          {videos.length === 0 && <p className="text-sm text-muted">No videos added yet.</p>}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
      </Button>
    </form>
  );
}
