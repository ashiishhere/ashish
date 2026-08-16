'use client';

import { motion } from 'framer-motion';

const SERVICES = [
  {
    number: '01',
    title: 'Creative Production',
    description: 'Concept development, scripting, production planning and complete creative execution.',
  },
  {
    number: '02',
    title: 'Direction',
    description: 'Visual storytelling, scene planning, direction and on-set execution.',
  },
  {
    number: '03',
    title: 'Video Editing',
    description: 'Long-form, short-form, documentary and digital content editing, including colour grading and sound design.',
  },
  {
    number: '04',
    title: 'Videography',
    description: 'Camera operation, visual composition, field production and cinematography.',
  },
];

export function ServicesPreview() {
  return (
    <section className="border-t border-border bg-background py-24 sm:py-32">
      <div className="container-cinema">
        <h2 className="mb-16 font-display text-3xl uppercase sm:text-4xl lg:text-5xl">
          From idea to final cut.
        </h2>

        <div className="grid gap-px overflow-hidden border border-border sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="border-border bg-background p-8 sm:border-r sm:last:border-r-0"
            >
              <span className="font-display text-3xl text-accent">{service.number}</span>
              <h3 className="mt-6 font-display text-xl uppercase">{service.title}</h3>
              <p className="mt-4 text-sm text-muted">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
