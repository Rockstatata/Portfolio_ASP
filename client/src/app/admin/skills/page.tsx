'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCode, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import type { Skill } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  isMissingColumnError,
  updateAdminResource,
} from '@/lib/adminResourceClient';

type SkillForm = {
  category: string;
  skill_name: string;
  skill_icon: string;
  proficiency: number;
  status: string;
  display_order: number;
};

const defaultForm: SkillForm = {
  category: '',
  skill_name: '',
  skill_icon: '',
  proficiency: 70,
  status: 'Active',
  display_order: 0,
};

const skillStatusOptions = [
  'Active',
  'Learning',
  'Expert',
  'Intermediate',
  'Beginner',
  'Inactive',
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillForm>(defaultForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const formTitle = useMemo(
    () => (editingId ? 'Edit Skill' : 'Add New Skill'),
    [editingId],
  );

  const loadSkills = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminResource<Skill>('skills');
      setSkills(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load skills.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSkills();
  }, [loadSkills]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      category: skill.category,
      skill_name: skill.skill_name,
      skill_icon: skill.skill_icon,
      proficiency: skill.proficiency,
      status: skill.status ?? 'Active',
      display_order: skill.display_order,
    });
  };

  const handleSave = async () => {
    if (!formData.category.trim() || !formData.skill_name.trim()) {
      setError('Category and skill name are required.');
      return;
    }

    setError('');
    setNotice('');

    const payload = {
      category: formData.category.trim(),
      skill_name: formData.skill_name.trim(),
      skill_icon: formData.skill_icon.trim(),
      proficiency: Math.min(100, Math.max(1, formData.proficiency || 1)),
      status: formData.status,
      display_order: formData.display_order,
    };

    try {
      if (editingId) {
        await updateAdminResource<Skill>('skills', editingId, payload);
      } else {
        await createAdminResource<Skill>('skills', payload);
      }

      resetForm();
      await loadSkills();
    } catch (saveError) {
      if (isMissingColumnError(saveError, 'status')) {
        const { status: statusToDrop, ...fallbackPayload } = payload;
        void statusToDrop;

        try {
          if (editingId) {
            await updateAdminResource<Skill>('skills', editingId, fallbackPayload);
          } else {
            await createAdminResource<Skill>('skills', fallbackPayload);
          }

          resetForm();
          await loadSkills();
          setNotice('Saved successfully. Skills status requires schema update to persist.');
          return;
        } catch (retryError) {
          setError(retryError instanceof Error ? retryError.message : 'Failed to save skill.');
          return;
        }
      }

      setError(saveError instanceof Error ? saveError.message : 'Failed to save skill.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await deleteAdminResource('skills', id);
      if (editingId === id) {
        resetForm();
      }
      await loadSkills();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete skill.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">{formTitle}</h1>
            <p className="admin-card-subtitle">
              Create and manage your technical skills.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaSave />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Category *</label>
            <input
              className="admin-form-input"
              value={formData.category}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  category: event.target.value,
                }))
              }
              placeholder="Programming Languages, Frameworks"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Skill Name *</label>
            <input
              className="admin-form-input"
              value={formData.skill_name}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  skill_name: event.target.value,
                }))
              }
              placeholder="React, TypeScript, ASP.NET"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Skill Icon</label>
            <input
              className="admin-form-input"
              value={formData.skill_icon}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  skill_icon: event.target.value,
                }))
              }
              placeholder="FaReact"
            />
            <span className="admin-form-hint">React icon key or custom class.</span>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Proficiency (1-100)</label>
            <input
              className="admin-form-input"
              type="number"
              min={1}
              max={100}
              value={formData.proficiency}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  proficiency: Math.min(100, Math.max(1, Number(event.target.value) || 1)),
                }))
              }
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
              {skillStatusOptions.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave}>
            <FaSave />
            {editingId ? 'Save Skill' : 'Create Skill'}
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
            <h2 className="admin-card-title">Skills Portfolio</h2>
            <p className="admin-card-subtitle">
              Manage technical skills and proficiencies.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaCode />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Skill Name</th>
                <th>Icon</th>
                <th>Proficiency</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No skills found.
                  </td>
                </tr>
              )}
              {skills.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.category}</td>
                  <td>{skill.skill_name}</td>
                  <td>{skill.skill_icon || 'No Icon'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          flex: 1,
                          background: 'var(--admin-bg-muted)',
                          borderRadius: '999px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${skill.proficiency}%`,
                            height: '8px',
                            background:
                              'linear-gradient(135deg, var(--admin-primary), var(--admin-primary-soft))',
                          }}
                        />
                      </div>
                      <span style={{ minWidth: '40px', fontSize: '0.76rem' }}>
                        {skill.proficiency}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-status-chip ${(skill.status ?? 'Active') === 'Inactive' ? 'warning' : 'success'}`}>
                      {skill.status ?? 'Active'}
                    </span>
                  </td>
                  <td>{skill.display_order}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startEdit(skill)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => handleDelete(skill.id)}
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
