import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold app-accent">404</h1>
        <h2 className="mt-4 text-2xl font-semibold app-heading">Page Not Found</h2>
        <p className="mt-2 app-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="app-btn-primary mt-8 inline-flex items-center gap-2 px-6 py-3 font-medium rounded-full transition-all hover:shadow-lg hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
