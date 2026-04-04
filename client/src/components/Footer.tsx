import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { getSocialLinks } from '@/lib/database';
import { getSocialIcon } from '@/lib/socialIcons';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default async function Footer() {
  noStore();
  const socialLinks = await getSocialLinks().catch(() => []);

  return (
    <footer className="app-footer-shell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="text-xl font-bold app-accent">
              Portfolio
            </Link>
            <p className="mt-2 text-sm app-muted">
              Content and links are managed directly from the admin panel.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold app-heading uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm app-link transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold app-heading uppercase tracking-wider">
              Connect
            </h3>
            <div className="mt-4 flex gap-4">
              {socialLinks.length === 0 && (
                <span className="text-sm app-muted">No social links configured.</span>
              )}
              {socialLinks.map((social) => {
                const Icon = getSocialIcon(social.icon_class);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-link transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'var(--app-border)' }}>
          <p className="text-sm app-muted">
            &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
