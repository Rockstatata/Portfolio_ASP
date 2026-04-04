'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { FiChevronUp } from 'react-icons/fi';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest);
  });

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circumference = 2 * Math.PI * 18;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-50 w-12 h-12 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          style={{ backgroundColor: '#DC143C' }}
          aria-label="Scroll to top"
        >
          {/* Progress ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 44 44"
          >
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2.5"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-100"
            />
          </svg>
          <FiChevronUp className="w-5 h-5 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
