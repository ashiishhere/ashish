export const revalidate = 0;

import type { Metadata } from 'next';
import Image from 'next/image';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Behind the frame — a gallery of moments from Ashish Dabhade\'s work.',
};

async function getGalleryImages() {
  try {
    return await db.galleryImage.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <>
      <section className="border-b border-border pt-40 pb-16 sm:pt-48 sm:pb-24">
        <div className="container-cinema">
          <p className="eyebrow mb-3">Gallery</p>
          <h1 className="font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl">
            Behind the Frame
          </h1>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-cinema">
          {images.length === 0 ? (
            <p className="text-muted">No gallery images published yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative aspect-square overflow-hidden bg-surface2">
                  <Image
                    src={img.url}
                    alt={img.altText || 'Gallery image'}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="text-xs text-white">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
