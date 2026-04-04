'use client';

import Link from 'next/link';
import {
  FaBlog,
  FaBriefcase,
  FaClock,
  FaCode,
  FaCog,
  FaEnvelope,
  FaHome,
  FaUser,
} from 'react-icons/fa';

const settingGroups = [
  {
    title: 'Homepage Content',
    description: 'Manage hero/about/home section content and ordering.',
    href: '/admin/dashboard',
    icon: FaHome,
  },
  {
    title: 'About Settings',
    description: 'Update biography cards, section titles, and about metadata.',
    href: '/admin/about',
    icon: FaUser,
  },
  {
    title: 'Project Settings',
    description: 'Control project records, links, years, and display status.',
    href: '/admin/projects',
    icon: FaBriefcase,
  },
  {
    title: 'Experience Settings',
    description: 'Manage professional experience entries and responsibilities.',
    href: '/admin/experience',
    icon: FaBriefcase,
  },
  {
    title: 'Skills Settings',
    description: 'Manage skills, icons, proficiency, and section categories.',
    href: '/admin/skills',
    icon: FaCode,
  },
  {
    title: 'Timeline Settings',
    description: 'Update chronological milestones and timeline display order.',
    href: '/admin/timeline',
    icon: FaClock,
  },
  {
    title: 'Blog Settings',
    description: 'Manage blog posts, publish state, tags, and excerpts.',
    href: '/admin/blogs',
    icon: FaBlog,
  },
  {
    title: 'Contact Settings',
    description: 'Manage messages, response workflow, and social/contact links.',
    href: '/admin/contacts',
    icon: FaEnvelope,
  },
];

export default function AdminSettingsPage() {
  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">Settings</h1>
            <p className="admin-card-subtitle">
              Centralized configuration shortcuts for all portfolio admin modules.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaCog />
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {settingGroups.map((group) => (
            <Link key={group.href} href={group.href} className="admin-stat-card">
              <div className="admin-stat-icon">
                <group.icon />
              </div>
              <div className="admin-stat-label">{group.title}</div>
              <p className="app-muted" style={{ marginTop: '0.35rem', fontSize: '0.8rem' }}>
                {group.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Legacy Parity Notes</h2>
            <p className="admin-card-subtitle">
              This route restores a dedicated settings entry point similar to the ASP.NET admin panel.
            </p>
          </div>
        </div>

        <ul className="app-muted" style={{ marginLeft: '1rem', lineHeight: 1.8 }}>
          <li>Use Dashboard for global section ordering and activation.</li>
          <li>Use Contacts for message status management and reply workflow.</li>
          <li>Use Blogs for publishing workflow and content updates.</li>
        </ul>
      </section>
    </>
  );
}
