'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="text-center max-w-xl mx-auto">
        <motion.h1
          className="text-6xl sm:text-8xl font-bold app-accent"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        >
          404
        </motion.h1>
        <motion.h2
          className="mt-4 text-xl sm:text-2xl font-semibold app-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
        >
          Page Not Found
        </motion.h2>
        <motion.p
          className="mt-2 app-muted app-break-anywhere"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="app-btn-primary app-touch-target mt-8 inline-flex items-center gap-2 px-6 py-3 font-medium rounded-full transition-all hover:shadow-lg"
            >
              <FiHome className="w-4 h-4" />
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
