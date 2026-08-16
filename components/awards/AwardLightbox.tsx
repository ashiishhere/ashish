'use client';

import Image from 'next/image';
import { Modal } from '@/components/ui/Modal';
import type { AwardWithImages } from '@/types/award';

export function AwardLightbox({ award, onClose }: { award: AwardWithImages | null; onClose: () => void }) {
  return (
    <Modal open={!!award} onClose={onClose} title={award?.projectName}>
      {award && (
        <div>
          <p className="text-sm text-foreground">{award.awardTitle}</p>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-muted">
            {award.festivalName}{award.location ? `, ${award.location}` : ''}{award.year ? ` — ${award.year}` : ''}
          </p>
          {award.description && <p className="mt-4 text-sm text-muted">{award.description}</p>}

          {award.galleryImages.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {award.galleryImages.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-surface2">
                  <Image src={img.url} alt={img.altText || award.projectName} fill sizes="200px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
