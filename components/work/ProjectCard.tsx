'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { VideoThumbnail } from '@/components/video/VideoThumbnail';
import { ROLE_LABELS, cn } from '@/lib/utils';
import type { ProjectWithRelations } from '@/types/project';

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const firstVideo = project.videos[0];
  const isShort = project.videoType === 'SHORT';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={cn(isShort && 'row-span-2')}
    >
      <Link href={`/portfolio/${project.slug}`} className="group block">
        <div className="relative overflow-hidden">
          {project.thumbnailUrl ? (
            <div className={cn('relative overflow-hidden bg-surface2', isShort ? 'aspect-[9/16]' : 'aspect-video')}>
              <Image
                src={project.thumbnailUrl}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ) : firstVideo ? (
            <VideoThumbnail videoId={firstVideo.youtubeVideoId} title={project.title} videoType={project.videoType} />
          ) : (
            <div className={cn('bg-surface2', isShort ? 'aspect-[9/16]' : 'aspect-video')} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="mt-4">
          <h3 className="font-display text-lg uppercase leading-snug transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-muted">
            {project.category?.name ?? 'Uncategorized'} {project.year ? `· ${project.year}` : ''}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted">{ROLE_LABELS[project.role]}</p>
      </Link>
    </motion.div>
  );
}
