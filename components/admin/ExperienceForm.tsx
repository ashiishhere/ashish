'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { Experience } from '@prisma/client';

interface ExperienceFormProps {
  initialExperience?: Experience;
  onSaved: () => void;
  onCancel: () => void;
}

function toDateInput(date?: Date | null): string {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

export function ExperienceForm({ initialExperience, onSaved, onCancel }: ExperienceFormProps) {
  const isEdit = !!initialExperience;
  const toast = useToast();

  const [jobTitle, setJobTitle] = useState(initialExperience?.jobTitle ?? '');
  const [company, setCompany] = useState(initialExperience?.company ?? '');
  const [location, setLocation] = useState(initialExperience?.location ?? '');
  const [startDate, setStartDate] = useState(toDateInput(initialExperience?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(initialExperience?.endDate));
  const [currentPosition, setCurrentPosition] = useState(initialExperience?.currentPosition ?? false);
  const [description, setDescription] = useState(initialExperience?.description ?? '');
  const [responsibilities, setResponsibilities] = useState(
    initialExperience?.responsibilities.join('\n') ?? ''
  );
  const [published, setPublished] = useState(initialExperience?.published ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      jobTitle,
      company,
      location,
      startDate,
      endDate: currentPosition ? '' : endDate,
      currentPosition,
      description,
      responsibilities: responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
      sortOrder: initialExperience?.sortOrder ?? 0,
      published,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/experience/${initialExperience!.id}` : '/api/admin/experience', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Failed to save.');
        return;
      }

      toast.success(isEdit ? 'Experience updated.' : 'Experience added.');
      onSaved();
    } catch {
      toast.error('Network error.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
        <Input label="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        {!currentPosition && (
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={currentPosition} onChange={(e) => setCurrentPosition(e.target.checked)} />
        This is my current position
      </label>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Responsibilities (one per line)</label>
        <textarea
          rows={5}
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
          className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none"
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
