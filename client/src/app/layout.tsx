import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Portfolio | Full-Stack Developer',
  description: 'A modern developer portfolio showcasing projects, blog posts, and professional experience.',
  keywords: ['developer', 'portfolio', 'full-stack', 'web development', 'react', 'next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AppShell>{children}</AppShell>
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: 'border border-[var(--app-border)] bg-[var(--app-bg-elevated)] text-[var(--app-text)]',
            duration: 4000,
          }}
        />
      </body>
    </html>
  );
}
