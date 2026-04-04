'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiMail } from 'react-icons/fi';

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const orb = (delay: number, x: string, y: string) => ({
  initial: { opacity: 0, scale: 0.6 },
  animate: {
    opacity: [0.15, 0.25, 0.15],
    scale: [1, 1.15, 1],
    x: [0, 20, -10, 0],
    y: [0, -15, 10, 0],
    transition: {
      opacity: { repeat: Infinity, duration: 6, delay },
      scale: { repeat: Infinity, duration: 6, delay },
      x: { repeat: Infinity, duration: 8, delay: delay + 0.5 },
      y: { repeat: Infinity, duration: 8, delay },
    },
  },
  style: { left: x, top: y },
});

const orb1 = orb(0, '-10%', '20%');
const orb2 = orb(2, '80%', '15%');
const orb3 = orb(4, '40%', '70%');

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, color-mix(in srgb, var(--app-bg-elevated) 95%, transparent), var(--app-bg) 50%, color-mix(in srgb, var(--app-accent-soft) 28%, var(--app-bg)))',
        }}
      />

      {/* Floating orbs */}
      {[orb1, orb2, orb3].map((o, i) => (
        <motion.div
          key={i}
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none"
          style={{ backgroundColor: 'var(--app-accent)', ...o.style }}
          initial={o.initial}
          animate={o.animate}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={stagger}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeUp}>
          <p className="text-sm sm:text-base font-medium tracking-wide uppercase mb-4 app-accent">
            Welcome to my portfolio
          </p>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold app-heading leading-tight"
        >
          Hi, I&apos;m{' '}
          <motion.span
            className="app-accent inline-block"
            animate={{
              backgroundSize: ['100% 0%', '100% 100%', '100% 100%'],
            }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 1, 0.5, 1] }}
          >
            John Doe
          </motion.span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-lg sm:text-xl app-muted max-w-2xl mx-auto"
        >
          A passionate full-stack developer crafting beautiful, performant web experiences
          with modern technologies.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/projects"
              className="app-btn-primary inline-flex items-center gap-2 px-8 py-3 font-medium rounded-full transition-all hover:shadow-lg"
            >
              View Projects
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <FiArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/contact"
              className="app-btn-secondary inline-flex items-center gap-2 px-8 py-3 border-2 font-medium rounded-full transition-all hover:shadow-lg hover:border-(--app-accent)"
            >
              <FiMail className="w-4 h-4" />
              Contact Me
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: 'var(--app-border)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1.5 h-3 mt-2 rounded-full"
              style={{ backgroundColor: 'var(--app-accent)' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
