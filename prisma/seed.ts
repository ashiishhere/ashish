import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

/**
 * Seeds only information explicitly supplied by Ashiish Dabhade's resume and
 * project brief. No clients, projects, testimonials, or statistics are
 * invented. Portfolio projects are intentionally left empty — the admin
 * adds them through the CMS as real work becomes available.
 */
async function main() {
  // --- Admin account -------------------------------------------------
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in your environment before seeding.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await db.user.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: { passwordHash },
    create: { email: adminEmail.toLowerCase().trim(), passwordHash, name: 'Ashiish Dabhade' },
  });
  console.log('✓ Admin account seeded');

  // --- Categories ------------------------------------------------------
  const categoryNames = ['Long Form', 'Short Form', 'Film', 'Documentary', 'Brand', 'Digital', 'News', 'Other'];
  for (const name of categoryNames) {
    await db.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
    });
  }
  console.log('✓ Categories seeded');

  // --- Services --------------------------------------------------------
  const services = [
    { title: 'Creative Production', description: 'Concept development, scripting, production planning and complete creative execution.', sortOrder: 0 },
    { title: 'Direction', description: 'Visual storytelling, scene planning, direction and on-set execution.', sortOrder: 1 },
    { title: 'Video Editing', description: 'Long-form, short-form, documentary and digital content editing, including colour grading and sound design.', sortOrder: 2 },
    { title: 'Videography', description: 'Camera operation, visual composition, field production and cinematography.', sortOrder: 3 },
  ];
  for (const service of services) {
    const existing = await db.service.findFirst({ where: { title: service.title } });
    if (!existing) await db.service.create({ data: service });
  }
  console.log('✓ Services seeded');

  // --- Experience (from resume) -----------------------------------------
  const experiences = [
    {
      jobTitle: 'Associate Senior Video Editor',
      company: 'The Lallantop (India Today Group)',
      location: 'Noida',
      startDate: new Date('2026-07-01'),
      endDate: null,
      currentPosition: true,
      responsibilities: [
        'Edit daily and weekly news content for YouTube and social media platforms in a fast-paced newsroom environment.',
        'Collaborate with editorial and production teams during studio and field shoots to ensure seamless execution.',
        'Support production planning, on-set coordination, and post-production workflows.',
      ],
      sortOrder: 0,
    },
    {
      jobTitle: 'Senior Video Editor cum Videographer',
      company: 'Indira Securities (Stockk)',
      location: 'Indore',
      startDate: new Date('2022-08-01'),
      endDate: new Date('2026-07-01'),
      currentPosition: false,
      responsibilities: [
        'Produced and edited long-form and short-form content for YouTube and multiple social media platforms.',
        'Led complete video production workflows including planning, directing, editing, sound design, and final delivery.',
        'Collaborated with marketing and creative teams to produce educational and brand-focused content.',
        'Managed multiple projects simultaneously while maintaining consistent quality and delivery timelines.',
      ],
      sortOrder: 1,
    },
    {
      jobTitle: 'Director & Editor (Independent Projects)',
      company: 'Freelance',
      location: 'India',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2025-12-31'),
      currentPosition: false,
      responsibilities: [
        'Wrote, directed, and edited the award-winning short film "Don\'t Remember Him Like This," recognized at national and international film festivals.',
        'Directed and edited the YouTube series "Antarkatha," overseeing scripting, production planning, videography, editing, sound design, color grading, and post-production.',
        'Directed, shot, and edited government-commissioned films under the Pradhan Mantri Awaas Yojana campaign, including an award-winning project.',
      ],
      sortOrder: 2,
    },
    {
      jobTitle: 'Assistant Director',
      company: 'Freelance Film Projects',
      location: 'Mumbai',
      startDate: new Date('2019-01-01'),
      endDate: new Date('2020-12-31'),
      currentPosition: false,
      responsibilities: [
        'Assisted directors during film production, ensuring smooth coordination across departments.',
        'Managed script supervision, continuity, TCR sheets, and clapperboard operations.',
        'Supported scene planning, actor briefings, and production logistics throughout filming.',
      ],
      sortOrder: 3,
    },
  ];

  for (const exp of experiences) {
    const existing = await db.experience.findFirst({ where: { jobTitle: exp.jobTitle, company: exp.company } });
    if (!existing) await db.experience.create({ data: exp });
  }
  console.log('✓ Experience seeded');

  // --- Awards (from resume) ---------------------------------------------
  const awards = [
    {
      projectName: "Don't Remember Him Like This",
      awardTitle: 'Best International Horror Film',
      festivalName: 'Sparrowland Film Festival',
      location: 'Australia',
      year: 2025,
      featured: true,
      sortOrder: 0,
    },
    {
      projectName: "Don't Remember Him Like This",
      awardTitle: 'Special Festival Mention & Official Screening',
      festivalName: '15th Dadasaheb Phalke Film Festival',
      location: 'New Delhi',
      year: 2025,
      featured: false,
      sortOrder: 1,
    },
    {
      projectName: "Don't Remember Him Like This",
      awardTitle: 'Official Selection & Screening',
      festivalName: 'MUMBA International Film Festival',
      location: null,
      year: 2024,
      featured: false,
      sortOrder: 2,
    },
  ];

  for (const award of awards) {
    const existing = await db.award.findFirst({ where: { projectName: award.projectName, awardTitle: award.awardTitle } });
    if (!existing) await db.award.create({ data: award });
  }
  console.log('✓ Awards seeded');

  // --- Site settings (from resume) ---------------------------------------
  const existingSettings = await db.siteSetting.findFirst();
  const settingsData = {
    siteName: 'Ashiish Dabhade',
    headline: 'Award-Winning Filmmaker | Creative Producer | Senior Video Editor',
    professionalSummary:
      "Award-winning filmmaker, creative producer, and senior video editor with 5+ years managing the complete production lifecycle — from concept development and scripting to direction, videography, editing, sound design, and final delivery — across digital content, documentaries, branded films, and independent cinema.",
    phone: '+91 89593 37707',
    email: 'ashishdabhade07@gmail.com',
    languages: ['Hindi', 'English', 'Marathi'],
    professionalAffiliation: 'Fellow Member, Screen Writers Association (SWA)',
    softwareTools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Adobe After Effects', 'Adobe Audition', 'Audacity'],
    aiTools: ['ChatGPT', 'Runway', 'Adobe Firefly', 'ElevenLabs'],
    skillsEditing: [
      'Long-form Editing', 'Short-form Editing', 'Documentary Editing', 'Multi-camera Editing',
      'Color Grading', 'Sound Design', 'Audio Mixing', 'AI-Assisted Editing', 'AI-Based Audio Enhancement',
    ],
    skillsProduction: [
      'Film Direction', 'Screenwriting', 'Storytelling', 'Videography',
      'Camera Operation', 'Production Planning', 'Creative Leadership', 'On-set Production',
    ],
    education: [
      { degree: 'Master of Business Administration (Media Management)', institution: 'Educational Multimedia Research Centre, DAVV — Indore' },
      { degree: 'Bachelor of Commerce (Computer Applications)', institution: 'Sarvepalli Radhakrishnan College, DAVV — Khandwa' },
    ],
  };

  if (existingSettings) {
    await db.siteSetting.update({ where: { id: existingSettings.id }, data: settingsData });
  } else {
    await db.siteSetting.create({ data: settingsData });
  }
  console.log('✓ Site settings seeded');

  // --- Social links (from resume) -----------------------------------------
  const socialLinks = [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ashish-dabhade', sortOrder: 0 },
    { platform: 'Linktree', url: 'https://linktr.ee/ashishdab', sortOrder: 1 },
  ];
  for (const link of socialLinks) {
    const existing = await db.socialLink.findFirst({ where: { platform: link.platform } });
    if (!existing) await db.socialLink.create({ data: link });
  }
  console.log('✓ Social links seeded');

  // --- SEO defaults ---------------------------------------------------
  await db.sEOSetting.upsert({
    where: { page: 'global' },
    update: {},
    create: {
      page: 'global',
      title: 'Ashiish Dabhade — Award-Winning Filmmaker | Creative Producer | Senior Video Editor',
      description:
        'Ashiish Dabhade is an award-winning filmmaker, creative producer and senior video editor crafting visual stories across digital content, documentaries, branded films and independent cinema.',
    },
  });
  console.log('✓ SEO defaults seeded');

  console.log('\nNo portfolio projects were seeded — add real projects from /admin/projects/new.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
