import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Sarwad Hasan Siddiqui | CSE Engineer',
  description: 'A modern developer portfolio showcasing projects, blog posts, and professional experience.',
  keywords: ['developer', 'portfolio', 'full-stack', 'fastapi', 'react-native', 'next.js', 'python', 'cse', 'engineer', 'sarwad', 'hasan', 'siddiqui'],
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
