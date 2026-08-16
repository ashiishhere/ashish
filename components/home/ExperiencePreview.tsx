import { db } from '@/lib/db';
import { formatDateRange } from '@/lib/utils';

async function getRecentExperience() {
  try {
    return await db.experience.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    });
  } catch {
    return [];
  }
}

export async function ExperiencePreview() {
  const experiences = await getRecentExperience();

  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="container-cinema">
        <h2 className="mb-14 font-display text-3xl uppercase sm:text-4xl lg:text-5xl">Experience</h2>

        {experiences.length > 0 ? (
          <div className="divide-y divide-border border-t border-b border-border">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid gap-2 py-6 sm:grid-cols-4 sm:items-center sm:gap-6">
                <p className="text-sm uppercase tracking-widest2 text-accent">
                  {formatDateRange(exp.startDate, exp.endDate, exp.currentPosition)}
                </p>
                <div className="sm:col-span-2">
                  <p className="font-display text-lg uppercase">{exp.jobTitle}</p>
                  <p className="text-sm text-muted">{exp.company}</p>
                </div>
                <p className="text-sm text-muted">{exp.location}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-border py-16 text-center text-muted">
            Experience will be added soon.
          </p>
        )}
      </div>
    </section>
  );
}
