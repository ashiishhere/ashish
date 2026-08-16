export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function formatDateRange(start: Date, end: Date | null, current: boolean): string {
  const startYear = new Date(start).getFullYear();
  if (current) return `${startYear} — Present`;
  if (!end) return `${startYear}`;
  const endYear = new Date(end).getFullYear();
  return startYear === endYear ? `${startYear}` : `${startYear} — ${endYear}`;
}

export const CATEGORY_FILTERS = [
  'ALL',
  'FILMS',
  'SHORT FILM',
  'DOCUMENTARY',
  'DIGITAL',
  'MUSIC VIDEO',
  'BRAND PROMO',
] as const;

export const ROLE_LABELS: Record<string, string> = {
  DIRECTOR: 'Director',
  PRODUCER: 'Producer',
  EDITOR: 'Editor',
  VIDEOGRAPHER: 'Videographer',
  ASSISTANT_DIRECTOR: 'Assistant Director',
  OTHER: 'Other',
};
