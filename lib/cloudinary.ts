import { v2 as cloudinary } from 'cloudinary';

/**
 * Modular image storage layer.
 * Everything else in the app calls `uploadImage` / `deleteImage` from THIS file only —
 * so swapping Cloudinary for Vercel Blob (or S3, etc.) later only requires editing this module.
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export interface UploadResult {
  url: string;
  publicId: string;
}

export function validateImageFile(file: { type: string; size: number }): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please upload a JPEG, PNG, WEBP, or AVIF image.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'File is too large. Maximum size is 8MB.';
  }
  return null;
}

/** Uploads a base64 data URL (or remote URL) buffer to Cloudinary under a given folder. */
export async function uploadImage(dataUrl: string, folder: string): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: `ashish-portfolio/${folder}`,
    resource_type: 'image',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
