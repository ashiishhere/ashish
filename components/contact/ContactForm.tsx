'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const PROJECT_TYPES = ['Documentary', 'Brand Film', 'Digital Content', 'Short Film', 'News/Editorial', 'Other'];

const initialState = { name: '', email: '', company: '', projectType: '', message: '' };

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
        toast.error(data.error || 'Something went wrong.');
        return;
      }

      toast.success('Message sent — I\u2019ll get back to you soon.');
      setForm(initialState);
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="grid gap-8 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          label="Company"
          name="company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          error={errors.company}
        />
        <Select
          label="Project Type"
          name="projectType"
          value={form.projectType}
          onChange={(e) => setForm({ ...form, projectType: e.target.value })}
        >
          <option value="">Select a project type</option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-widest2 text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none"
          required
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="mt-1 text-xs text-accent">{errors.message}</p>}
      </div>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Sending…' : 'Start a Conversation'}
      </Button>
    </form>
  );
}
