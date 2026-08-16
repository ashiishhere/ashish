import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function AboutPreview() {
  return (
    <section className="border-t border-border bg-surface py-24 sm:py-32">
      <div className="container-cinema grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/images/About_Page.png"
            alt="Ashish Dabhade"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow mb-3">About</p>
          <h2 className="font-display text-3xl uppercase leading-tight sm:text-4xl lg:text-5xl">
            Filmmaker. Producer. Editor. Storyteller.
          </h2>
          <p className="mt-6 text-muted">
            My approach brings together storytelling, production and post-production — allowing me to
            take an idea from its initial concept through scripting, direction, filming, editing, sound
            and final delivery.
          </p>
          <Button href="/about" variant="outline" className="mt-8">More About Me</Button>
        </div>
      </div>
    </section>
  );
}
