'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  FaBlog,
  FaBriefcase,
  FaChartLine,
  FaClock,
  FaCog,
  FaCode,
  FaEnvelope,
  FaGlobe,
  FaHome,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import './admin.css';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/about', label: 'About', icon: FaUser },
  { href: '/admin/projects', label: 'Projects', icon: FaBriefcase },
  { href: '/admin/experience', label: 'Experience', icon: FaBriefcase },
  { href: '/admin/skills', label: 'Skills', icon: FaCode },
  { href: '/admin/timeline', label: 'Timeline', icon: FaClock },
  { href: '/admin/blogs', label: 'Blogs', icon: FaBlog },
  { href: '/admin/contacts', label: 'Contacts', icon: FaEnvelope },
  { href: '/admin/settings', label: 'Settings', icon: FaCog },
];

function isActivePath(currentPath: string, href: string) {
  if (href === '/admin') {
    return currentPath === '/admin' || currentPath === '/admin/dashboard';
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = useMemo(() => 'AD', []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldUseDark);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/session', { method: 'DELETE' });
    } catch {
      // noop
    } finally {
      setIsLoggingOut(false);
      router.push('/admin');
      router.refresh();
    }
  };

  if (pathname === '/admin' || pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-root">
      <div className="admin-navbar-container">
        <div className="admin-navbar-content">
          <div className="admin-navbar-flex">
            <div className="admin-navbar-brand">
              <Link
                href="/admin"
                className={`admin-brand-dashboard-link ${isActivePath(pathname, '/admin') ? 'nav-active' : ''}`}
              >
                <FaChartLine className="brand-icon" />
                <span className="brand-dashboard-text">Dashboard</span>
              </Link>
            </div>

            <div className="admin-desktop-nav">
              {adminLinks.slice(1).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`admin-nav-link ${isActivePath(pathname, link.href) ? 'nav-active' : ''}`}
                >
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            <div className="admin-nav-actions">
              <div className="admin-user-avatar">{initials}</div>
              <Link className="admin-root-btn" href="/" title="View Site" aria-label="View Site">
                <FaGlobe />
              </Link>
              <button
                type="button"
                className="admin-logout-btn"
                title="Logout"
                aria-label="Logout"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <FaSignOutAlt />
              </button>
              <button
                type="button"
                className="admin-mobile-menu-toggle"
                aria-label="Toggle admin navigation"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? <HiX /> : <HiMenu />}
              </button>
            </div>
          </div>
        </div>

        <div className={`admin-mobile-menu ${mobileMenuOpen ? '' : 'hidden'}`}>
          <div className="mobile-menu-content">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`mobile-nav-link ${isActivePath(pathname, link.href) ? 'nav-active' : ''}`}
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="admin-main-content">
        <div className="admin-container">{children}</div>
      </main>

      <footer className="admin-footer">
        <div className="admin-container">
          <div className="admin-footer-content">
            <div>
              <FaChartLine className="brand-icon" /> Portfolio Admin
            </div>
            <p>Consistent with the ASP.NET admin panel design.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
