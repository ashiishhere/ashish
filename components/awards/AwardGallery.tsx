'use client';

import { useState } from 'react';
import { AwardCard } from './AwardCard';
import { AwardLightbox } from './AwardLightbox';
import type { AwardWithImages } from '@/types/award';

export function AwardGallery({ awards }: { awards: AwardWithImages[] }) {
  const [selected, setSelected] = useState<AwardWithImages | null>(null);

  if (awards.length === 0) {
    return (
      <p className="border border-dashed border-border py-16 text-center text-muted">
        Awards and recognitions will be added soon.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <AwardCard key={award.id} award={award} onOpen={() => setSelected(award)} />
        ))}
      </div>
      <AwardLightbox award={selected} onClose={() => setSelected(null)} />
    </>
  );
}
