import Image from 'next/image';
import { db } from '@/lib/db';

async function getFeaturedAward() {
  try {
    return await db.award.findFirst({
      where: { published: true, featured: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch {
    return null;
  }
}

async function getOtherAwards(excludeId?: string) {
  try {
    return await db.award.findMany({
      where: { published: true, ...(excludeId ? { id: { not: excludeId } } : {}) },
      orderBy: { sortOrder: 'asc' },
      take: 4,
    });
  } catch {
    return [];
  }
}

export async function AwardHighlight() {
  const award = await getFeaturedAward();
  const others = await getOtherAwards(award?.id);

  if (!award) {
    return (
      <section className="border-t border-border bg-surface py-24 sm:py-32">
        <div className="container-cinema text-center">
          <p className="eyebrow mb-3">Recognition</p>
          <h2 className="font-display text-3xl uppercase sm:text-4xl">Award-Winning Cinema</h2>
          <p className="mt-6 text-muted">Awards and recognitions will be added soon.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border bg-surface py-24 sm:py-32">
      <div className="container-cinema grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow mb-3">Recognition</p>
          <h2 className="font-display text-3xl uppercase leading-tight sm:text-4xl lg:text-5xl">
            Award-Winning Cinema
          </h2>

          <div className="mt-10 border-l-2 border-accent pl-6">
            <p className="font-display text-2xl uppercase">{award.projectName}</p>
            <p className="mt-2 text-lg text-foreground">{award.awardTitle}</p>
            <p className="mt-1 text-sm text-muted">
              {award.festivalName}{award.location ? `, ${award.location}` : ''}
              {award.year ? ` — ${award.year}` : ''}
            </p>
          </div>

          {others.length > 0 && (
            <ul className="mt-8 space-y-4 text-sm text-muted">
              {others.map((o) => (
                <li key={o.id}>
                  <span className="text-foreground">{o.awardTitle}</span>
                  <br />
                  {o.festivalName}{o.location ? `, ${o.location}` : ''}{o.year ? ` — ${o.year}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>

        {award.mainImageUrl && (
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={award.mainImageUrl}
              alt={award.mainImageAlt || award.projectName}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
