'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaStar, FaTrash, FaUserCircle } from 'react-icons/fa';
import type { AboutSection } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  updateAdminResource,
} from '@/lib/adminResourceClient';
import { truncateText } from '@/utils/helpers';

type StrengthItem = {
  id: string;
  category: string;
  name: string;
  description: string;
  display_order: number;
};

const STRENGTH_PREFIX = 'strength:';

const sectionTypes = [
  'Main',
  'Education',
  'Skills',
  'Research',
  'Goals',
  'Learning',
];

const strengthCategories = [
  'Strengths',
  'Research Interests',
  'Future Goals',
  'Current Focus',
];

function slugifyCategory(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function toStrengthSectionType(category: string) {
  return `${STRENGTH_PREFIX}${slugifyCategory(category)}`;
}

function fromStrengthSectionType(sectionType: string) {
  const normalized = sectionType.toLowerCase();
  if (!normalized.startsWith(STRENGTH_PREFIX)) {
    return null;
  }

  const key = normalized.slice(STRENGTH_PREFIX.length);
  const matched = strengthCategories.find(
    (item) => slugifyCategory(item) === key,
  );

  if (matched) {
    return matched;
  }

  const fallback = key.replace(/_/g, ' ').trim();
  return fallback
    ? fallback.replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Strengths';
}

type SectionForm = {
  section_type: string;
  title: string;
  subtitle: string;
  content: string;
  display_order: number;
};

type StrengthForm = {
  category: string;
  name: string;
  description: string;
  display_order: number;
};

const defaultSectionForm: SectionForm = {
  section_type: 'Main',
  title: '',
  subtitle: '',
  content: '',
  display_order: 0,
};

const defaultStrengthForm: StrengthForm = {
  category: 'Strengths',
  name: '',
  description: '',
  display_order: 0,
};

export default function AdminAboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [strengths, setStrengths] = useState<StrengthItem[]>([]);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingStrengthId, setEditingStrengthId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState<SectionForm>(defaultSectionForm);
  const [strengthForm, setStrengthForm] = useState<StrengthForm>(defaultStrengthForm);
  const [error, setError] = useState('');

  const sectionFormTitle = useMemo(
    () => (editingSectionId ? 'Edit About Section' : 'Add New About Section'),
    [editingSectionId],
  );

  const sectionTypeOptions = useMemo(() => {
    const known = new Set(sectionTypes.map((type) => type.toLowerCase()));
    const existingCustomTypes = sections
      .map((section) => section.section_type)
      .filter((type) => !known.has(type.toLowerCase()));

    return [...sectionTypes, ...existingCustomTypes];
  }, [sections]);

  const strengthFormTitle = useMemo(
    () => (editingStrengthId ? 'Edit Strength/Interest' : 'Add New Strength/Interest'),
    [editingStrengthId],
  );

  const loadAboutData = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminResource<AboutSection>('about');
      const sectionRows: AboutSection[] = [];
      const strengthRows: StrengthItem[] = [];

      data.forEach((row) => {
        const category = fromStrengthSectionType(row.section_type);
        if (category) {
          strengthRows.push({
            id: row.id,
            category,
            name: row.title,
            description: row.content,
            display_order: row.display_order,
          });
          return;
        }

        sectionRows.push(row);
      });

      setSections(sectionRows);
      setStrengths(strengthRows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load about data.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAboutData();
  }, [loadAboutData]);

  const resetSectionForm = () => {
    setSectionForm(defaultSectionForm);
    setEditingSectionId(null);
  };

  const resetStrengthForm = () => {
    setStrengthForm(defaultStrengthForm);
    setEditingStrengthId(null);
  };

  const saveSection = async () => {
    if (!sectionForm.section_type.trim() || !sectionForm.title.trim() || !sectionForm.content.trim()) {
      setError('Section type, title, and content are required.');
      return;
    }

    setError('');
    const payload = {
      section_type: sectionForm.section_type.trim(),
      title: sectionForm.title.trim(),
      subtitle: sectionForm.subtitle.trim() || null,
      content: sectionForm.content.trim(),
      display_order: sectionForm.display_order,
    };

    try {
      if (editingSectionId) {
        await updateAdminResource<AboutSection>('about', editingSectionId, payload);
      } else {
        await createAdminResource<AboutSection>('about', payload);
      }
      resetSectionForm();
      await loadAboutData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save about section.');
    }
  };

  const saveStrength = async () => {
    if (!strengthForm.category.trim() || !strengthForm.name.trim()) {
      setError('Category and name are required.');
      return;
    }

    setError('');
    const payload = {
      section_type: toStrengthSectionType(strengthForm.category),
      title: strengthForm.name.trim(),
      subtitle: null,
      content: strengthForm.description.trim(),
      display_order: strengthForm.display_order,
    };

    try {
      if (editingStrengthId) {
        await updateAdminResource<AboutSection>('about', editingStrengthId, payload);
      } else {
        await createAdminResource<AboutSection>('about', payload);
      }
      resetStrengthForm();
      await loadAboutData();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save strength/interest.',
      );
    }
  };

  const startSectionEdit = (section: AboutSection) => {
    setEditingSectionId(section.id);
    setSectionForm({
      section_type: section.section_type,
      title: section.title,
      subtitle: section.subtitle ?? '',
      content: section.content,
      display_order: section.display_order,
    });
  };

  const startStrengthEdit = (strength: StrengthItem) => {
    setEditingStrengthId(strength.id);
    setStrengthForm({
      category: strength.category,
      name: strength.name,
      description: strength.description,
      display_order: strength.display_order,
    });
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) {
      return;
    }

    try {
      await deleteAdminResource('about', id);
      if (editingSectionId === id) {
        resetSectionForm();
      }
      await loadAboutData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete section.');
    }
  };

  const deleteStrength = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await deleteAdminResource('about', id);
      if (editingStrengthId === id) {
        resetStrengthForm();
      }
      await loadAboutData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete item.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">{sectionFormTitle}</h1>
            <p className="admin-card-subtitle">Manage about page sections and content.</p>
          </div>
          <div className="admin-stat-icon">
            <FaUserCircle />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Section Type</label>
            <select
              className="admin-form-select"
              value={sectionForm.section_type}
              onChange={(event) =>
                setSectionForm((currentForm) => ({
                  ...currentForm,
                  section_type: event.target.value,
                }))
              }
            >
              {sectionTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Title</label>
            <input
              className="admin-form-input"
              value={sectionForm.title}
              onChange={(event) =>
                setSectionForm((currentForm) => ({
                  ...currentForm,
                  title: event.target.value,
                }))
              }
              placeholder="About Me, My Passion"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Subtitle</label>
            <input
              className="admin-form-input"
              value={sectionForm.subtitle}
              onChange={(event) =>
                setSectionForm((currentForm) => ({
                  ...currentForm,
                  subtitle: event.target.value,
                }))
              }
              placeholder="Optional subtitle"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Display Order</label>
            <input
              className="admin-form-input"
              type="number"
              value={sectionForm.display_order}
              onChange={(event) =>
                setSectionForm((currentForm) => ({
                  ...currentForm,
                  display_order: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Content</label>
            <textarea
              className="admin-form-textarea"
              rows={5}
              value={sectionForm.content}
              onChange={(event) =>
                setSectionForm((currentForm) => ({
                  ...currentForm,
                  content: event.target.value,
                }))
              }
              placeholder="Write section content"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={saveSection}>
            {editingSectionId ? 'Save Section' : 'Add Section'}
          </button>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={resetSectionForm}>
            Cancel
          </button>
          {editingSectionId && (
            <button
              className="admin-btn admin-btn-danger"
              type="button"
              onClick={() => deleteSection(editingSectionId)}
            >
              Delete
            </button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">About Sections</h2>
            <p className="admin-card-subtitle">Manage your about page sections.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Subtitle</th>
                <th>Content</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-state">
                    No about sections found.
                  </td>
                </tr>
              )}
              {sections.map((section) => (
                <tr key={section.id}>
                  <td>{section.section_type}</td>
                  <td>{section.title}</td>
                  <td>{section.subtitle || '—'}</td>
                  <td>{truncateText(section.content || '', 100)}</td>
                  <td>{section.display_order}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startSectionEdit(section)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => deleteSection(section.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">{strengthFormTitle}</h1>
            <p className="admin-card-subtitle">Manage strengths, interests, and goals.</p>
          </div>
          <div className="admin-stat-icon">
            <FaStar />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Category</label>
            <select
              className="admin-form-select"
              value={strengthForm.category}
              onChange={(event) =>
                setStrengthForm((currentForm) => ({
                  ...currentForm,
                  category: event.target.value,
                }))
              }
            >
              {strengthCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Name/Title</label>
            <input
              className="admin-form-input"
              value={strengthForm.name}
              onChange={(event) =>
                setStrengthForm((currentForm) => ({
                  ...currentForm,
                  name: event.target.value,
                }))
              }
              placeholder="Problem Solving, ML Systems"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Display Order</label>
            <input
              className="admin-form-input"
              type="number"
              value={strengthForm.display_order}
              onChange={(event) =>
                setStrengthForm((currentForm) => ({
                  ...currentForm,
                  display_order: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              rows={4}
              value={strengthForm.description}
              onChange={(event) =>
                setStrengthForm((currentForm) => ({
                  ...currentForm,
                  description: event.target.value,
                }))
              }
              placeholder="Describe this strength or interest"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={saveStrength}>
            {editingStrengthId ? 'Save Item' : 'Add Item'}
          </button>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={resetStrengthForm}>
            Cancel
          </button>
          {editingStrengthId && (
            <button
              className="admin-btn admin-btn-danger"
              type="button"
              onClick={() => deleteStrength(editingStrengthId)}
            >
              Delete
            </button>
          )}
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Strengths & Interests</h2>
            <p className="admin-card-subtitle">Manage professional strengths and interests.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Description</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {strengths.length === 0 && (
                <tr>
                  <td colSpan={5} className="admin-empty-state">
                    No strengths/interests found.
                  </td>
                </tr>
              )}
              {strengths.map((strength) => (
                <tr key={strength.id}>
                  <td>{strength.category}</td>
                  <td>{strength.name}</td>
                  <td>{truncateText(strength.description || '', 90)}</td>
                  <td>{strength.display_order}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startStrengthEdit(strength)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => deleteStrength(strength.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {error && <p className="error-message">{error}</p>}
    </>
  );
}
