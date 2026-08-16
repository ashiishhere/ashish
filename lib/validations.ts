import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(120),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(120).optional().or(z.literal('')),
  projectType: z.string().max(120).optional().or(z.literal('')),
  message: z.string().min(10, 'Message should be at least 10 characters').max(4000),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const projectVideoSchema = z.object({
  title: z.string().min(1, 'Video title is required'),
  youtubeUrl: z.string().min(1, 'YouTube URL is required'),
  videoType: z.enum(['LONG', 'SHORT']),
  description: z.string().optional(),
  role: z.enum(['DIRECTOR', 'PRODUCER', 'EDITOR', 'VIDEOGRAPHER', 'ASSISTANT_DIRECTOR', 'OTHER']),
  sortOrder: z.number().int().default(0),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(160),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  client: z.string().max(160).optional().or(z.literal('')),
  year: z.number().int().min(1990).max(2100).optional(),
  categoryId: z.string().optional().or(z.literal('')),
  videoType: z.enum(['LONG', 'SHORT']),
  role: z.enum(['DIRECTOR', 'PRODUCER', 'EDITOR', 'VIDEOGRAPHER', 'ASSISTANT_DIRECTOR', 'OTHER']),
  shortDescription: z.string().max(300).optional().or(z.literal('')),
  fullDescription: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  videos: z.array(projectVideoSchema).default([]),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const awardSchema = z.object({
  projectName: z.string().min(1, 'Project name is required').max(200),
  awardTitle: z.string().min(1, 'Award title is required').max(200),
  festivalName: z.string().min(1, 'Festival/organization is required').max(200),
  location: z.string().max(160).optional().or(z.literal('')),
  year: z.number().int().min(1990).max(2100).optional(),
  description: z.string().optional().or(z.literal('')),
  mainImageAlt: z.string().max(200).optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});
export type AwardInput = z.infer<typeof awardSchema>;

export const experienceSchema = z.object({
  jobTitle: z.string().min(1).max(160),
  company: z.string().min(1).max(160),
  location: z.string().max(160).optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  currentPosition: z.boolean().default(false),
  description: z.string().optional().or(z.literal('')),
  responsibilities: z.array(z.string().min(1)).default([]),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});
export type ExperienceInput = z.infer<typeof experienceSchema>;

export const serviceSchema = z.object({
  title: z.string().min(1).max(160),
  description: z.string().min(1).max(1000),
  icon: z.string().optional().or(z.literal('')),
  sortOrder: z.number().int().default(0),
  published: z.boolean().default(true),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});
