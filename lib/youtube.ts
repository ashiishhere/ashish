/**
 * YouTube utility functions.
 * Only the video ID is ever persisted to the database — never full URLs,
 * so nothing breaks if YouTube changes its URL formats later.
 */

/**
 * Extracts an 11-character YouTube video ID from any common URL shape:
 * - https://www.youtube.com/watch?v=ABC123
 * - https://youtu.be/ABC123
 * - https://www.youtube.com/shorts/ABC123
 * - https://www.youtube.com/embed/ABC123
 * Returns null if no valid ID can be found.
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  // Fallback: a bare 11-character ID was pasted directly.
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  return null;
}

/** Returns the highest-quality static thumbnail URL for a given video ID. */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq'
): string {
  const map = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };
  return `https://i.ytimg.com/vi/${videoId}/${map[quality]}.jpg`;
}

/** Returns a privacy-friendlier embeddable URL for a given video ID. */
export function getYouTubeEmbedUrl(
  videoId: string,
  options?: { autoplay?: boolean; controls?: boolean; muted?: boolean }
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    autoplay: options?.autoplay ? '1' : '0',
    controls: options?.controls === false ? '0' : '1',
    mute: options?.muted ? '1' : '0',
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}
