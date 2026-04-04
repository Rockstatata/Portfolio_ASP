'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

type AnimationVariant = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: AnimationVariant;
}

const variantMap: Record<AnimationVariant, { initial: Record<string, number>; animate: Record<string, number> }> = {
  'fade-up': { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  'fade-down': { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
  'fade-left': { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
  'fade-right': { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
  scale: { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
};

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  variant = 'fade-up',
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { initial, animate } = variantMap[variant];

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
