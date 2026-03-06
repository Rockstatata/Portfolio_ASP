import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold" style={{ color: '#DC143C' }}>404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-full transition-all hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: '#DC143C' }}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
