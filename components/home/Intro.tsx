'use client';

import { motion } from 'framer-motion';

interface IntroProps {
  heading?: string | null;
  text1?: string | null;
  text2?: string | null;
}

const DEFAULT_HEADING = 'I create stories, not just videos.';
const DEFAULT_TEXT1 =
  'I am an award-winning filmmaker, creative producer and senior video editor with over 5 years of experience across digital content, documentaries, branded films and independent cinema.';
const DEFAULT_TEXT2 =
  'My work spans the complete production lifecycle — from concept development and scripting to direction, videography, editing, sound design and final delivery.';

export function Intro({ heading, text1, text2 }: IntroProps) {
  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="container-cinema grid gap-10 lg:grid-cols-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 font-display text-3xl uppercase leading-tight sm:text-4xl lg:text-5xl"
        >
          {heading || DEFAULT_HEADING}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-6 lg:col-start-7 space-y-5 text-muted"
        >
          <p>{text1 || DEFAULT_TEXT1}</p>
          <p>{text2 || DEFAULT_TEXT2}</p>
        </motion.div>
      </div>
    </section>
  );
}
