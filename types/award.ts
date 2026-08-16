import type { Award, AwardImage } from '@prisma/client';

export type AwardWithImages = Award & { galleryImages: AwardImage[] };
