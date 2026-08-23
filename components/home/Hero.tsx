'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  supportingText?: string | null;
}

const DEFAULT_SUPPORTING_TEXT =
  'From concept to final cut, I create visual stories that connect, communicate and leave an impact.';

export function Hero({ supportingText }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src="/images/About_Page.png"
          alt="Ashiish Dabhade — Filmmaker, Director, Writer and Editor"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </div>

      <div className="container-cinema relative z-10 pt-20">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow mb-6"
        >
          Filmmaker | Director | Writer | Editor
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-[13vw] font-semibold uppercase leading-[0.95] tracking-tight sm:text-[9vw] lg:text-[7vw]"
        >
          Ashiish
          <br />
          Dabhade
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 max-w-xl text-base text-muted sm:text-lg"
        >
          {supportingText || DEFAULT_SUPPORTING_TEXT}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button href="/portfolio" size="lg">View My Work</Button>
          <Button href="/about" variant="outline" size="lg">About Me</Button>
        </motion.div>
      </div>
    </section>
  );
}
