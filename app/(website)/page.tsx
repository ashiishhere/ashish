export const revalidate = 0;
import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { Hero } from '@/components/home/Hero';
import { Intro } from '@/components/home/Intro';
import { SelectedWork } from '@/components/home/SelectedWork';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { AwardHighlight } from '@/components/home/AwardHighlight';
import { GallerySection } from '@/components/home/GallerySection';
import { ExperiencePreview } from '@/components/home/ExperiencePreview';
import { AboutPreview } from '@/components/home/AboutPreview';
import { ContactCTA } from '@/components/home/ContactCTA';

export const metadata: Metadata = {
  title: 'Ashish Dabhade — Award-Winning Filmmaker | Creative Producer | Senior Video Editor',
  description:
    'From concept to final cut, Ashish Dabhade creates visual stories that connect, communicate and leave an impact.',
};

async function getSettings() {
  try {
    return await db.siteSetting.findFirst();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Hero supportingText={settings?.heroSupportingText} />
      <Intro heading={settings?.introHeading} text1={settings?.introText1} text2={settings?.introText2} />
      <SelectedWork />
      <ServicesPreview />
      <AwardHighlight />
      <GallerySection />
      <ExperiencePreview />
      <AboutPreview />
      <ContactCTA heading={settings?.contactHeading} text={settings?.contactText} />
    </>
  );
}
