'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FooterReveal({ children }: { children: ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}
