import Image from 'next/image';
import { getYouTubeThumbnail } from '@/lib/youtube';
import { cn } from '@/lib/utils';

export function VideoThumbnail({
  videoId,
  title,
  videoType,
  className,
}: {
  videoId: string;
  title: string;
  videoType: 'LONG' | 'SHORT';
  className?: string;
}) {
  const aspect = videoType === 'SHORT' ? 'aspect-[9/16]' : 'aspect-video';
  return (
    <div className={cn('relative overflow-hidden bg-surface2', aspect, className)}>
      <Image
        src={getYouTubeThumbnail(videoId, 'hq')}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}
