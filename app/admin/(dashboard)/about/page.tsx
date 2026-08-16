'use client';

import { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import type { SiteSetting } from '@prisma/client';

function toCsv(arr?: string[] | null): string {
  return arr?.join(', ') ?? '';
}
function fromCsv(value: string): string[] {
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Home page content
  const [heroSupportingText, setHeroSupportingText] = useState('');
  const [introHeading, setIntroHeading] = useState('');
  const [introText1, setIntroText1] = useState('');
  const [introText2, setIntroText2] = useState('');
  const [contactHeading, setContactHeading] = useState('');
  const [contactText, setContactText] = useState('');

  // About page content
  const [headline, setHeadline] = useState('');
  const [shortBio, setShortBio] = useState('');
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [professionalAffiliation, setProfessionalAffiliation] = useState('');
  const [languages, setLanguages] = useState('');
  const [softwareTools, setSoftwareTools] = useState('');
  const [aiTools, setAiTools] = useState('');
  const [skillsEditing, setSkillsEditing] = useState('');
  const [skillsProduction, setSkillsProduction] = useState('');
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/admin/settings', { cache: 'no-store' });
      const data: SiteSetting | null = await res.json();
      if (data) {
        setHeroSupportingText(data.heroSupportingText ?? '');
        setIntroHeading(data.introHeading ?? '');
        setIntroText1(data.introText1 ?? '');
        setIntroText2(data.introText2 ?? '');
        setContactHeading(data.contactHeading ?? '');
        setContactText(data.contactText ?? '');
        setHeadline(data.headline ?? '');
        setShortBio(data.shortBio ?? '');
        setProfessionalSummary(data.professionalSummary ?? '');
        setProfessionalAffiliation(data.professionalAffiliation ?? '');
        setLanguages(toCsv(data.languages));
        setSoftwareTools(toCsv(data.softwareTools));
        setAiTools(toCsv(data.aiTools));
        setSkillsEditing(toCsv(data.skillsEditing));
        setSkillsProduction(toCsv(data.skillsProduction));
      }
      setLoading(false);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        heroSupportingText,
        introHeading,
        introText1,
        introText2,
        contactHeading,
        contactText,
        headline,
        shortBio,
        professionalSummary,
        professionalAffiliation,
        languages: fromCsv(languages),
        softwareTools: fromCsv(softwareTools),
        aiTools: fromCsv(aiTools),
        skillsEditing: fromCsv(skillsEditing),
        skillsProduction: fromCsv(skillsProduction),
      }),
    });

    if (res.ok) toast.success('Content updated.');
    else toast.error('Failed to save.');
    setSubmitting(false);
  }

  if (loading) return (<><AdminHeader title="About" /><div className="p-10 text-muted">Loading…</div></>);

  return (
    <>
      <AdminHeader title="About" />
      <div className="p-6 lg:p-10">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
          <div>
            <h2 className="mb-6 text-sm uppercase tracking-widest2 text-accent">Home Page Content</h2>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Hero Supporting Text</label>
                <textarea rows={2} value={heroSupportingText} onChange={(e) => setHeroSupportingText(e.target.value)} placeholder="From concept to final cut, I create visual stories..." className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
              </div>
              <Input label="Intro Heading" value={introHeading} onChange={(e) => setIntroHeading(e.target.value)} placeholder="I create stories, not just videos." />
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Intro Paragraph 1</label>
                <textarea rows={3} value={introText1} onChange={(e) => setIntroText1(e.target.value)} className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Intro Paragraph 2</label>
                <textarea rows={3} value={introText2} onChange={(e) => setIntroText2(e.target.value)} className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
              </div>
              <Input label="Contact Section Heading" value={contactHeading} onChange={(e) => setContactHeading(e.target.value)} placeholder="Let's Create Something." />
              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Contact Section Text</label>
                <textarea rows={2} value={contactText} onChange={(e) => setContactText(e.target.value)} className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h2 className="mb-6 text-sm uppercase tracking-widest2 text-accent">About Page Content</h2>
            <div className="space-y-6">
              <Input label="Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Short Bio</label>
                <textarea rows={2} value={shortBio} onChange={(e) => setShortBio(e.target.value)} className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest2 text-muted">Professional Summary</label>
                <textarea rows={5} value={professionalSummary} onChange={(e) => setProfessionalSummary(e.target.value)} className="w-full border-b border-border bg-transparent py-3 focus:border-accent focus:outline-none" />
              </div>

              <Input label="Professional Affiliation" value={professionalAffiliation} onChange={(e) => setProfessionalAffiliation(e.target.value)} />
              <Input label="Languages (comma-separated)" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              <Input label="Software Tools (comma-separated)" value={softwareTools} onChange={(e) => setSoftwareTools(e.target.value)} />
              <Input label="Generative AI Tools (comma-separated)" value={aiTools} onChange={(e) => setAiTools(e.target.value)} />
              <Input label="Editing Skills (comma-separated)" value={skillsEditing} onChange={(e) => setSkillsEditing(e.target.value)} />
              <Input label="Production Skills (comma-separated)" value={skillsProduction} onChange={(e) => setSkillsProduction(e.target.value)} />
            </div>
          </div>

          <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save Changes'}</Button>
        </form>
      </div>
    </>
  );
}
