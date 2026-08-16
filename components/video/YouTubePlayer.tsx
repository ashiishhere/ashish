'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';
import { cn } from '@/lib/utils';

interface YouTubePlayerProps {
  videoId: string;
  title: string;
  videoType: 'LONG' | 'SHORT';
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  className?: string;
}

/**
 * Lazy-loaded YouTube player: shows a static thumbnail first, and only
 * mounts the iframe (and therefore only starts talking to YouTube) once
 * the visitor clicks play. Playback happens inside the site — visitors
 * are never redirected to youtube.com.
 *
 * Note: YouTube's own player UI/branding is controlled by YouTube and
 * cannot be fully removed.
 */
export function YouTubePlayer({
  videoId,
  title,
  videoType,
  autoplay = true,
  controls = true,
  muted = false,
  className,
}: YouTubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const aspect = videoType === 'SHORT' ? 'aspect-[9/16]' : 'aspect-video';

  return (
    <div className={cn('relative w-full overflow-hidden bg-surface2', aspect, className)}>
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block h-full w-full"
          aria-label={`Play ${title}`}
        >
          <Image
            src={getYouTubeThumbnail(videoId, 'hq')}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/90 transition-transform group-hover:scale-110">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={getYouTubeEmbedUrl(videoId, { autoplay, controls, muted })}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}
