'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  FaBlog,
  FaBriefcase,
  FaCog,
  FaCode,
  FaClock,
  FaEnvelope,
  FaHome,
  FaPlus,
  FaSave,
  FaTrash,
  FaUser,
} from 'react-icons/fa';
import type { HomeSection } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  updateAdminResource,
} from '@/lib/adminResourceClient';

const quickActions = [
  { href: '/admin/projects', label: 'Add New Project', icon: FaBriefcase },
  { href: '/admin/experience', label: 'Update Experience', icon: FaBriefcase },
  { href: '/admin/skills', label: 'Manage Skills', icon: FaCode },
  { href: '/admin/blogs', label: 'Write Blog Post', icon: FaBlog },
  { href: '/admin/contacts', label: 'View Messages', icon: FaEnvelope },
  { href: '/admin/about', label: 'Update About', icon: FaUser },
  { href: '/admin/timeline', label: 'Update Timeline', icon: FaClock },
  { href: '/admin/settings', label: 'Admin Settings', icon: FaCog },
];

type DashboardStats = {
  projects: number;
  experiences: number;
  skills: number;
  messages: number;
  blogs: number;
  about: number;
  timeline: number;
  home: number;
};

const emptyStats: DashboardStats = {
  projects: 0,
  experiences: 0,
  skills: 0,
  messages: 0,
  blogs: 0,
  about: 0,
  timeline: 0,
  home: 0,
};

const defaultForm = {
  section_name: '',
  content: '',
  image_path: '',
  display_order: 0,
  is_active: true,
};

type HomeSectionForm = typeof defaultForm;

const statCards: Array<{
  key: keyof DashboardStats;
  label: string;
  icon: typeof FaBriefcase;
}> = [
  { key: 'projects', label: 'Projects', icon: FaBriefcase },
  { key: 'experiences', label: 'Experiences', icon: FaBriefcase },
  { key: 'skills', label: 'Skills', icon: FaCode },
  { key: 'messages', label: 'Messages', icon: FaEnvelope },
  { key: 'blogs', label: 'Blogs', icon: FaBlog },
  { key: 'about', label: 'About Sections', icon: FaUser },
  { key: 'timeline', label: 'Timeline', icon: FaClock },
  { key: 'home', label: 'Home Sections', icon: FaHome },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HomeSectionForm>(defaultForm);
  const [error, setError] = useState('');

  const sectionFormTitle = useMemo(
    () => (editingId ? 'Edit Home Section' : 'Add Home Section'),
    [editingId],
  );

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [
        projects,
        experiences,
        skills,
        messages,
        blogs,
        about,
        timeline,
        home,
      ] = await Promise.all([
        fetchAdminResource<Record<string, unknown>>('projects'),
        fetchAdminResource<Record<string, unknown>>('experiences'),
        fetchAdminResource<Record<string, unknown>>('skills'),
        fetchAdminResource<Record<string, unknown>>('messages'),
        fetchAdminResource<Record<string, unknown>>('blogs'),
        fetchAdminResource<Record<string, unknown>>('about'),
        fetchAdminResource<Record<string, unknown>>('timeline'),
        fetchAdminResource<HomeSection>('home'),
      ]);

      setStats({
        projects: projects.length,
        experiences: experiences.length,
        skills: skills.length,
        messages: messages.length,
        blogs: blogs.length,
        about: about.length,
        timeline: timeline.length,
        home: home.length,
      });

      setHomeSections(home);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const startEdit = (section: HomeSection) => {
    setEditingId(section.id);
    setFormData({
      section_name: section.section_name,
      content: section.content,
      image_path: section.image_path ?? '',
      display_order: section.display_order,
      is_active: section.is_active,
    });
  };

  const handleSave = async () => {
    if (!formData.section_name.trim() || !formData.content.trim()) {
      setError('Section name and content are required.');
      return;
    }

    setError('');
    try {
      if (editingId) {
        const updated = await updateAdminResource<HomeSection>('home', editingId, {
          section_name: formData.section_name.trim(),
          content: formData.content.trim(),
          image_path: formData.image_path.trim() || null,
          display_order: formData.display_order,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        });

        setHomeSections((currentSections) =>
          currentSections.map((section) =>
            section.id === updated.id ? updated : section,
          ),
        );
      } else {
        const created = await createAdminResource<HomeSection>('home', {
          section_name: formData.section_name.trim(),
          content: formData.content.trim(),
          image_path: formData.image_path.trim() || null,
          display_order: formData.display_order,
          is_active: formData.is_active,
        });

        setHomeSections((currentSections) => [...currentSections, created]);
      }

      resetForm();
      await loadDashboardData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save section.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this home section?')) {
      return;
    }

    try {
      await deleteAdminResource('home', id);
      setHomeSections((currentSections) =>
        currentSections.filter((section) => section.id !== id),
      );
      if (editingId === id) {
        resetForm();
      }
      await loadDashboardData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete section.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">Welcome back, Administrator!</h1>
            <p className="admin-card-subtitle">
              Live counts from the same data source used by your client portfolio.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaHome />
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {statCards.map((card) => (
            <article key={card.key} className="admin-stat-card">
              <div className="admin-stat-icon">
                <card.icon />
              </div>
              <div className="admin-stat-value">{stats[card.key]}</div>
              <div className="admin-stat-label">{card.label}</div>
            </article>
          ))}
        </div>

        {isLoading && (
          <p className="mt-4 text-sm app-muted">Loading dashboard...</p>
        )}
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Quick Actions</h2>
            <p className="admin-card-subtitle">Navigate directly to each managed resource.</p>
          </div>
        </div>

        <div className="admin-dashboard-grid">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="admin-stat-card">
              <div className="admin-stat-icon">
                <action.icon />
              </div>
              <div className="admin-stat-label">{action.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">{sectionFormTitle}</h2>
            <p className="admin-card-subtitle">Manage hero/about/contact and any custom home sections.</p>
          </div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={resetForm}
          >
            <FaPlus />
            New
          </button>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Section Name *</label>
            <input
              className="admin-form-input"
              value={formData.section_name}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, section_name: event.target.value }))
              }
              placeholder="Hero, About, Skills, Projects..."
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Image Path</label>
            <input
              className="admin-form-input"
              value={formData.image_path}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, image_path: event.target.value }))
              }
              placeholder="/images/hero.jpg"
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Content *</label>
            <textarea
              className="admin-form-textarea"
              rows={4}
              value={formData.content}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, content: event.target.value }))
              }
              placeholder="Section content"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Display Order</label>
            <input
              className="admin-form-input"
              type="number"
              value={formData.display_order}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  display_order: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select
              className="admin-form-select"
              value={formData.is_active ? 'active' : 'inactive'}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  is_active: event.target.value === 'active',
                }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave}>
            <FaSave />
            {editingId ? 'Save Changes' : 'Create Section'}
          </button>
          {editingId && (
            <button className="admin-btn admin-btn-danger" type="button" onClick={() => handleDelete(editingId)}>
              <FaTrash />
              Delete
            </button>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Home Sections</h2>
            <p className="admin-card-subtitle">These directly drive what is shown on `/` and contact info sections.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Content</th>
                <th>Image</th>
                <th>Order</th>
                <th>Active</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {homeSections.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">No home sections configured yet.</td>
                </tr>
              )}
              {[...homeSections]
                .sort((a, b) => a.display_order - b.display_order)
                .map((section) => (
                  <tr key={section.id}>
                    <td>{section.section_name}</td>
                    <td>{section.content}</td>
                    <td>{section.image_path || '—'}</td>
                    <td>{section.display_order}</td>
                    <td>
                      <span className={`admin-status-chip ${section.is_active ? 'success' : 'warning'}`}>
                        {section.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{section.updated_at ? new Date(section.updated_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <button
                        className="admin-btn admin-btn-secondary"
                        style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                        type="button"
                        onClick={() => startEdit(section)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        style={{ padding: '0.4rem 0.6rem' }}
                        type="button"
                        onClick={() => handleDelete(section.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
