'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiMail } from 'react-icons/fi';

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
      <div
        className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: 'var(--app-accent)' }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: 'var(--app-accent)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm sm:text-base font-medium tracking-wide uppercase mb-4 app-accent">
            Welcome to my portfolio
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold app-heading leading-tight"
        >
          Hi, I&apos;m{' '}
          <span className="app-accent">
            John Doe
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-lg sm:text-xl app-muted max-w-2xl mx-auto"
        >
          A passionate full-stack developer crafting beautiful, performant web experiences
          with modern technologies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/projects"
            className="app-btn-primary inline-flex items-center gap-2 px-8 py-3 font-medium rounded-full transition-all hover:shadow-lg hover:scale-105"
          >
            View Projects
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="app-btn-secondary inline-flex items-center gap-2 px-8 py-3 border-2 font-medium rounded-full transition-all hover:shadow-lg hover:scale-105 hover:border-(--app-accent)"
          >
            <FiMail className="w-4 h-4" />
            Contact Me
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-6 h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: 'var(--app-border)' }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1.5 h-3 mt-2 rounded-full"
              style={{ backgroundColor: 'var(--app-accent)' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
