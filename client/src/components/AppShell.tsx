'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SmoothScroll from '@/components/SmoothScroll';

type AppShellProps = {
  children: ReactNode;
};

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 1, 0.5, 1] as [number, number, number, number],
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const isLegacyHomeRoute = pathname === '/';
  const isDetailRoute = [
    /^\/projects\/[^/]+$/,
    /^\/blog\/[^/]+$/,
    /^\/blogs\/[^/]+$/,
    /^\/experience\/[^/]+$/,
    /^\/experiences\/[^/]+$/,
  ].some((pattern) => pattern.test(pathname));

  if (isAdminRoute || isLegacyHomeRoute || isDetailRoute) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <SmoothScroll />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          className="min-h-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
