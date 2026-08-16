import type { Project, ProjectVideo, Category, VideoType, ProjectRole } from '@prisma/client';

export type ProjectWithRelations = Project & {
  category: Category | null;
  videos: ProjectVideo[];
};

export type { VideoType, ProjectRole };
