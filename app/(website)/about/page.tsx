export const revalidate = 0;

import type { Metadata } from 'next';
import Image from 'next/image';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Ashish Dabhade is an award-winning filmmaker, creative producer and senior video editor with 5+ years of experience.',
};

async function getSettings() {
  try {
    return await db.siteSetting.findFirst();
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const settings = await getSettings();

  const skillsEditing = settings?.skillsEditing?.length
    ? settings.skillsEditing
    : [
        'Long-form Editing', 'Short-form Editing', 'Documentary Editing', 'Multi-camera Editing',
        'Color Grading', 'Sound Design', 'Audio Mixing', 'AI-Assisted Editing', 'AI-Based Audio Enhancement',
      ];

  const skillsProduction = settings?.skillsProduction?.length
    ? settings.skillsProduction
    : [
        'Film Direction', 'Screenwriting', 'Storytelling', 'Videography',
        'Camera Operation', 'Production Planning', 'Creative Leadership', 'On-set Production',
      ];

  const software = settings?.softwareTools?.length
    ? settings.softwareTools
    : ['Adobe Premiere Pro', 'DaVinci Resolve', 'Adobe After Effects', 'Adobe Audition', 'Audacity'];

  const aiTools = settings?.aiTools?.length
    ? settings.aiTools
    : ['ChatGPT', 'Runway', 'Adobe Firefly', 'ElevenLabs'];

  const languages = settings?.languages?.length ? settings.languages : ['Hindi', 'English', 'Marathi'];

  return (
    <>
      <section className="border-b border-border pt-40 pb-16 sm:pt-48 sm:pb-24">
        <div className="container-cinema grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-4">About</p>
            <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl">
              About Ashish
            </h1>
            <p className="mt-4 text-lg text-muted">Filmmaker. Producer. Editor. Storyteller.</p>

            <div className="mt-8 space-y-4 text-muted">
              <p>
                I am an award-winning filmmaker, creative producer and senior video editor with 5+
                years of experience working across digital content, documentaries, branded films and
                independent cinema.
              </p>
              <p>
                My approach brings together storytelling, production and post-production — allowing me
                to take an idea from its initial concept through scripting, direction, filming,
                editing, sound and final delivery.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/About_Page.png"
              alt="Ashish Dabhade"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="container-cinema grid gap-12 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-6">Video Editing &amp; Post-Production</p>
            <ul className="space-y-2 text-muted">
              {skillsEditing.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-6">Creative Production</p>
            <ul className="space-y-2 text-muted">
              {skillsProduction.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="container-cinema grid gap-12 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-6">Software</p>
            <div className="flex flex-wrap gap-3">
              {software.map((tool) => (
                <span key={tool} className="border border-border px-4 py-2 text-sm text-muted">{tool}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow mb-6">Generative AI</p>
            <div className="flex flex-wrap gap-3">
              {aiTools.map((tool) => (
                <span key={tool} className="border border-border px-4 py-2 text-sm text-muted">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-cinema grid gap-12 sm:grid-cols-3">
          <div>
            <p className="eyebrow mb-4">Education</p>
            <p className="text-sm text-foreground">Master of Business Administration (Media Management)</p>
            <p className="text-sm text-muted">Educational Multimedia Research Centre, DAVV — Indore</p>
            <p className="mt-3 text-sm text-foreground">Bachelor of Commerce (Computer Applications)</p>
            <p className="text-sm text-muted">Sarvepalli Radhakrishnan College, DAVV — Khandwa</p>
          </div>
          <div>
            <p className="eyebrow mb-4">Languages</p>
            <p className="text-sm text-muted">{languages.join(', ')}</p>
          </div>
          <div>
            <p className="eyebrow mb-4">Professional Affiliation</p>
            <p className="text-sm text-muted">
              {settings?.professionalAffiliation || 'Fellow Member, Screen Writers Association (SWA)'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
