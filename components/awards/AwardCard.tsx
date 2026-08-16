'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { AwardWithImages } from '@/types/award';

export function AwardCard({ award, onOpen }: { award: AwardWithImages; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className="group block w-full text-left"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-surface2">
        {award.mainImageUrl && (
          <Image
            src={award.mainImageUrl}
            alt={award.mainImageAlt || award.projectName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <p className="font-display text-lg uppercase text-white">{award.projectName}</p>
          <p className="mt-1 text-sm text-white/80">{award.awardTitle}</p>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-accent">
            {award.festivalName}{award.year ? ` — ${award.year}` : ''}
          </p>
        </div>
      </div>
    </motion.button>
  );
}
