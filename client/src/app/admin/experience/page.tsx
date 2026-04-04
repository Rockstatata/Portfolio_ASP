'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaBriefcase, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import type { Experience } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  isMissingColumnError,
  updateAdminResource,
} from '@/lib/adminResourceClient';
import { truncateText } from '@/utils/helpers';

type ExperienceForm = {
  company: string;
  position: string;
  duration: string;
  description: string;
  responsibilities: string;
  status: string;
  display_order: number;
};

const defaultForm: ExperienceForm = {
  company: '',
  position: '',
  duration: '',
  description: '',
  responsibilities: '',
  status: 'Current',
  display_order: 0,
};

const experienceStatusOptions = [
  'Current',
  'Previous',
  'Contract',
  'Internship',
  'Freelance',
];

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceForm>(defaultForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const formTitle = useMemo(
    () => (editingId ? 'Edit Experience' : 'Add New Experience'),
    [editingId],
  );

  const loadExperiences = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminResource<Experience>('experiences');
      setExperiences(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Failed to load experiences.',
      );
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadExperiences();
  }, [loadExperiences]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const startEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setFormData({
      company: experience.company,
      position: experience.position,
      duration: experience.duration,
      description: experience.description,
      responsibilities: experience.responsibilities,
      status: experience.status ?? 'Current',
      display_order: experience.display_order,
    });
  };

  const handleSave = async () => {
    if (!formData.company.trim() || !formData.position.trim()) {
      setError('Company and position are required.');
      return;
    }

    setError('');
    setNotice('');

    const payload = {
      company: formData.company.trim(),
      position: formData.position.trim(),
      duration: formData.duration.trim(),
      description: formData.description.trim(),
      responsibilities: formData.responsibilities.trim(),
      status: formData.status,
      display_order: formData.display_order,
    };

    try {
      if (editingId) {
        await updateAdminResource<Experience>('experiences', editingId, payload);
      } else {
        await createAdminResource<Experience>('experiences', payload);
      }

      resetForm();
      await loadExperiences();
    } catch (saveError) {
      if (isMissingColumnError(saveError, 'status')) {
        const { status: statusToDrop, ...fallbackPayload } = payload;
        void statusToDrop;

        try {
          if (editingId) {
            await updateAdminResource<Experience>('experiences', editingId, fallbackPayload);
          } else {
            await createAdminResource<Experience>('experiences', fallbackPayload);
          }

          resetForm();
          await loadExperiences();
          setNotice('Saved successfully. Experience status requires schema update to persist.');
          return;
        } catch (retryError) {
          setError(
            retryError instanceof Error ? retryError.message : 'Failed to save experience.',
          );
          return;
        }
      }

      setError(
        saveError instanceof Error ? saveError.message : 'Failed to save experience.',
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      await deleteAdminResource('experiences', id);
      if (editingId === id) {
        resetForm();
      }
      await loadExperiences();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Failed to delete experience.',
      );
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">{formTitle}</h1>
            <p className="admin-card-subtitle">
              Create and manage your work experiences.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaSave />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Company *</label>
            <input
              className="admin-form-input"
              value={formData.company}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  company: event.target.value,
                }))
              }
              placeholder="Enter company name"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Position *</label>
            <input
              className="admin-form-input"
              value={formData.position}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  position: event.target.value,
                }))
              }
              placeholder="Enter position title"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Duration</label>
            <input
              className="admin-form-input"
              value={formData.duration}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  duration: event.target.value,
                }))
              }
              placeholder="e.g., Jan 2022 - Present"
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
              value={formData.status}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  status: event.target.value,
                }))
              }
            >
              {experienceStatusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Description</label>
            <textarea
              className="admin-form-textarea"
              rows={4}
              value={formData.description}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  description: event.target.value,
                }))
              }
              placeholder="Describe your role and impact"
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Responsibilities</label>
            <textarea
              className="admin-form-textarea"
              rows={5}
              value={formData.responsibilities}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  responsibilities: event.target.value,
                }))
              }
              placeholder="List key responsibilities and achievements"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave}>
            <FaSave />
            {editingId ? 'Save Experience' : 'Create Experience'}
          </button>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={resetForm}>
            Cancel
          </button>
          {editingId && (
            <button
              className="admin-btn admin-btn-danger"
              type="button"
              onClick={() => handleDelete(editingId)}
            >
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
            <h2 className="admin-card-title">Work Experience</h2>
            <p className="admin-card-subtitle">
              Manage your professional experience records.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaBriefcase />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Description</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No experience entries found.
                  </td>
                </tr>
              )}
              {experiences.map((experience) => (
                <tr key={experience.id}>
                  <td>{experience.company}</td>
                  <td>{experience.position}</td>
                  <td>{experience.duration || '—'}</td>
                  <td>
                    <span className={`admin-status-chip ${(experience.status ?? 'Current') === 'Previous' ? 'warning' : 'success'}`}>
                      {experience.status ?? 'Current'}
                    </span>
                  </td>
                  <td>{truncateText(experience.description || '', 90)}</td>
                  <td>{experience.display_order}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startEdit(experience)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => handleDelete(experience.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {notice && <p className="success-message">{notice}</p>}
      </section>
    </>
  );
}
