import Image from 'next/image';
import { db } from '@/lib/db';

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

export async function GallerySection() {
  const images = await getGalleryImages();

  if (images.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="container-cinema">
        <p className="eyebrow mb-3">Gallery</p>
        <h2 className="mb-14 font-display text-3xl uppercase sm:text-4xl lg:text-5xl">Behind the Frame</h2>

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
      </div>
    </section>
  );
}
