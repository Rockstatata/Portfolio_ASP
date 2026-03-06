'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiMail } from 'react-icons/fi';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50/30 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div
        className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: '#DC143C' }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: '#DC143C' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="text-sm sm:text-base font-medium tracking-wide uppercase mb-4" style={{ color: '#DC143C' }}>
            Welcome to my portfolio
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
        >
          Hi, I&apos;m{' '}
          <span style={{ color: '#DC143C' }}>
            John Doe
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
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
            className="inline-flex items-center gap-2 px-8 py-3 text-white font-medium rounded-full transition-all hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: '#DC143C' }}
          >
            View Projects
            <FiArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 font-medium rounded-full transition-all hover:shadow-lg hover:scale-105 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-[#DC143C] dark:hover:border-[#DC143C]"
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
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-1.5 h-3 mt-2 rounded-full"
              style={{ backgroundColor: '#DC143C' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
