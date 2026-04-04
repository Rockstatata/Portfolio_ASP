import type { ReactNode } from 'react';
import Link from 'next/link';
import PortfolioThemeToggle from '@/components/detail/PortfolioThemeToggle';

type PortfolioDetailShellProps = {
  sectionLabel: string;
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  meta?: ReactNode;
  children: ReactNode;
};

const detailNavLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#experience', label: 'Experience' },
  { href: '/#blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export default function PortfolioDetailShell({
  sectionLabel,
  title,
  subtitle,
  backHref,
  backLabel,
  meta,
  children,
}: PortfolioDetailShellProps) {
  return (
    <>
      <style>
        {"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); @import url('/legacy/Content/styles.css');"}
      </style>

      <div id="vanta-background" className="vanta-bg detail-vanta-bg" aria-hidden="true" />

      <nav className="navbar-container" id="main-navbar" aria-label="Portfolio navigation">
        <div className="navbar-content">
          <div className="navbar-flex">
            <div className="navbar-brand">
              <Link href="/" className="brand-link">
                <span className="brand-text">Sarwad Hasan Siddiqui</span>
              </Link>
            </div>

            <div className="desktop-nav detail-nav-links">
              {detailNavLinks.map((link) => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                  <span className="nav-underline" />
                </Link>
              ))}
            </div>

            <div className="nav-actions detail-nav-actions">
              <Link href={backHref} className="btn detail-back-chip" aria-label={backLabel}>
                {backLabel}
              </Link>
              <PortfolioThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content detail-main-content">
        <section className="section detail-section">
          <div className="container detail-container">
            <header className="glass-card detail-hero-card">
              <div className="detail-hero-head">
                <span className="tag tag-red detail-eyebrow">{sectionLabel}</span>
                <Link href={backHref} className="btn detail-inline-back">
                  {backLabel}
                </Link>
              </div>

              <h1 className="section-title detail-title">{title}</h1>
              {subtitle ? <p className="section-subtitle detail-subtitle">{subtitle}</p> : null}
              {meta ? <div className="detail-meta">{meta}</div> : null}
            </header>

            <div className="detail-content">{children}</div>
          </div>
        </section>
      </main>

      <style>{`
        .detail-vanta-bg {
          background:
            radial-gradient(1200px 560px at 95% -15%, rgba(209, 77, 114, 0.36), transparent 62%),
            radial-gradient(900px 500px at 0% 0%, rgba(255, 171, 171, 0.35), transparent 58%),
            linear-gradient(160deg, rgba(255, 255, 255, 0.9), rgba(253, 248, 251, 0.88));
          opacity: 0.95;
        }

        body.dark .detail-vanta-bg {
          background:
            radial-gradient(1200px 560px at 95% -15%, rgba(209, 77, 114, 0.42), transparent 62%),
            radial-gradient(900px 500px at 0% 0%, rgba(255, 171, 171, 0.2), transparent 58%),
            linear-gradient(160deg, rgba(26, 22, 37, 0.94), rgba(30, 24, 41, 0.92));
          opacity: 1;
        }

        .detail-main-content {
          padding-top: 7rem;
        }

        .detail-section {
          min-height: auto;
          padding: 1.75rem 0 4.5rem;
        }

        .detail-container {
          max-width: 1120px;
        }

        .detail-hero-card {
          margin-bottom: 1.5rem;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 18px 35px rgba(18, 15, 24, 0.1);
        }

        body.dark .detail-hero-card {
          box-shadow: 0 22px 42px rgba(0, 0, 0, 0.32);
        }

        .detail-hero-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .detail-eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.66rem;
        }

        .detail-title {
          margin-bottom: 0.75rem;
          line-height: 1.08;
          letter-spacing: -0.02em;
        }

        .detail-subtitle {
          margin: 0;
          max-width: 72ch;
          line-height: 1.6;
        }

        .detail-meta {
          margin-top: 1.25rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .detail-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: var(--text-muted);
          border: 1px solid rgba(107, 101, 118, 0.24);
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.5);
        }

        body.dark .detail-meta-item {
          color: var(--text-muted-dark);
          border-color: rgba(203, 213, 225, 0.25);
          background: rgba(26, 22, 37, 0.45);
        }

        .detail-content {
          display: grid;
          gap: 1rem;
        }

        .detail-content .detail-surface {
          border-radius: 1rem;
          overflow: hidden;
        }

        .detail-rich-text {
          display: grid;
          gap: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.75;
        }

        body.dark .detail-rich-text {
          color: var(--text-secondary-dark);
        }

        .detail-rich-text h1,
        .detail-rich-text h2,
        .detail-rich-text h3,
        .detail-rich-text h4 {
          color: var(--text-primary);
          margin: 0.75rem 0 0.2rem;
          line-height: 1.25;
        }

        body.dark .detail-rich-text h1,
        body.dark .detail-rich-text h2,
        body.dark .detail-rich-text h3,
        body.dark .detail-rich-text h4 {
          color: var(--text-primary-dark);
        }

        .detail-rich-text a {
          color: var(--accent-primary);
          text-decoration: underline;
          text-underline-offset: 0.16em;
        }

        .detail-rich-text ul,
        .detail-rich-text ol {
          margin: 0;
          padding-left: 1.1rem;
          display: grid;
          gap: 0.45rem;
        }

        .detail-nav-actions {
          gap: 0.6rem;
        }

        .detail-back-chip {
          white-space: nowrap;
        }

        .detail-nav-links .nav-link {
          font-weight: 500;
        }

        .detail-inline-back {
          display: none;
        }

        @media (max-width: 767px) {
          .detail-back-chip {
            display: none;
          }

          .detail-inline-back {
            display: inline-flex;
          }

          .detail-main-content {
            padding-top: 6.1rem;
          }

          .detail-hero-card {
            padding: 1.15rem;
            margin-bottom: 1rem;
          }

          .detail-content {
            gap: 0.75rem;
          }

          .detail-meta {
            gap: 0.55rem;
          }

          .detail-meta-item {
            max-width: 100%;
            font-size: 0.78rem;
          }
        }

        @media (max-width: 420px) {
          .detail-title {
            font-size: 2rem;
          }

          .detail-subtitle {
            font-size: 0.95rem;
          }

          .detail-hero-head {
            align-items: flex-start;
          }

          .detail-meta-item {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
