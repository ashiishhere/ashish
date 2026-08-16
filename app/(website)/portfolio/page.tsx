import type { Metadata } from 'next';
import { WorkHero } from '@/components/work/WorkHero';
import { ProjectGrid } from '@/components/work/ProjectGrid';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Films, documentaries, branded content and digital stories by Ashish Dabhade.',
};

export default function WorkPage() {
  return (
    <>
      <WorkHero />
      <ProjectGrid />
    </>
  );
}
