import { YouTubePlayer } from '@/components/video/YouTubePlayer';
import { ROLE_LABELS } from '@/lib/utils';
import type { ProjectVideo } from '@prisma/client';

export function ProjectVideos({ videos }: { videos: ProjectVideo[] }) {
  if (videos.length === 0) return null;

  return (
    <div className="container-cinema space-y-16 py-8">
      {videos.map((video) => (
        <div key={video.id} className={video.videoType === 'SHORT' ? 'max-w-sm' : ''}>
          <YouTubePlayer videoId={video.youtubeVideoId} title={video.title} videoType={video.videoType} />
          <div className="mt-4">
            <p className="font-display text-lg uppercase">{video.title}</p>
            <p className="mt-1 text-xs uppercase tracking-widest2 text-muted">
              {ROLE_LABELS[video.role]}
            </p>
            {video.description && <p className="mt-2 text-sm text-muted">{video.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
