'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <div ref={ref} className="text-center mb-12">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="text-2xl sm:text-4xl font-bold app-heading"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="mt-3 text-base sm:text-lg app-muted max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="mt-4 mx-auto w-20 h-1 rounded-full app-accent-bg origin-center"
      />
    </div>
  );
}
