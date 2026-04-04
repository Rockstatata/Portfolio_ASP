'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaClock, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import type { TimelineItem } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  isMissingColumnError,
  updateAdminResource,
} from '@/lib/adminResourceClient';
import { truncateText } from '@/utils/helpers';

type TimelineForm = {
  year_range: string;
  title: string;
  location: string;
  type: 'education' | 'work' | 'milestone';
  status: string;
  display_order: number;
  description: string;
};

const defaultForm: TimelineForm = {
  year_range: '',
  title: '',
  location: '',
  type: 'work',
  status: 'Active',
  display_order: 0,
  description: '',
};

const timelineStatusOptions = ['Active', 'Completed', 'In Progress', 'Ongoing', 'Inactive'];

export default function AdminTimelinePage() {
  const [timelineEntries, setTimelineEntries] = useState<TimelineItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TimelineForm>(defaultForm);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const formTitle = useMemo(
    () => (editingId ? 'Edit Timeline Entry' : 'Add New Timeline Entry'),
    [editingId],
  );

  const loadTimeline = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminResource<TimelineItem>('timeline');
      setTimelineEntries(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Failed to load timeline.',
      );
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTimeline();
  }, [loadTimeline]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  const startEdit = (entry: TimelineItem) => {
    setEditingId(entry.id);
    setFormData({
      year_range: entry.year_range,
      title: entry.title,
      location: entry.location,
      type: entry.type,
      status: entry.status ?? 'Active',
      display_order: entry.display_order,
      description: entry.description,
    });
  };

  const handleSave = async () => {
    if (!formData.year_range.trim() || !formData.title.trim()) {
      setError('Year range and title are required.');
      return;
    }

    setError('');
    setNotice('');

    const payload = {
      year_range: formData.year_range.trim(),
      title: formData.title.trim(),
      location: formData.location.trim(),
      type: formData.type,
      status: formData.status,
      display_order: formData.display_order,
      description: formData.description.trim(),
    };

    try {
      if (editingId) {
        await updateAdminResource<TimelineItem>('timeline', editingId, payload);
      } else {
        await createAdminResource<TimelineItem>('timeline', payload);
      }

      resetForm();
      await loadTimeline();
    } catch (saveError) {
      if (isMissingColumnError(saveError, 'status')) {
        const { status: statusToDrop, ...fallbackPayload } = payload;
        void statusToDrop;

        try {
          if (editingId) {
            await updateAdminResource<TimelineItem>('timeline', editingId, fallbackPayload);
          } else {
            await createAdminResource<TimelineItem>('timeline', fallbackPayload);
          }

          resetForm();
          await loadTimeline();
          setNotice('Saved successfully. Timeline status requires schema update to persist.');
          return;
        } catch (retryError) {
          setError(
            retryError instanceof Error
              ? retryError.message
              : 'Failed to save timeline entry.',
          );
          return;
        }
      }

      setError(
        saveError instanceof Error ? saveError.message : 'Failed to save timeline entry.',
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline entry?')) {
      return;
    }

    try {
      await deleteAdminResource('timeline', id);
      if (editingId === id) {
        resetForm();
      }
      await loadTimeline();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Failed to delete timeline entry.',
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
              Create and manage timeline events and milestones.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaSave />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Year Range *</label>
            <input
              className="admin-form-input"
              value={formData.year_range}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  year_range: event.target.value,
                }))
              }
              placeholder="2020-2023, 2025-Present"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Title *</label>
            <input
              className="admin-form-input"
              value={formData.title}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  title: event.target.value,
                }))
              }
              placeholder="Event title"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Location</label>
            <input
              className="admin-form-input"
              value={formData.location}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  location: event.target.value,
                }))
              }
              placeholder="Location or Remote"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Type</label>
            <select
              className="admin-form-select"
              value={formData.type}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  type: event.target.value as TimelineForm['type'],
                }))
              }
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
              <option value="milestone">Milestone</option>
            </select>
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
              {timelineStatusOptions.map((statusOption) => (
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
              rows={6}
              value={formData.description}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  description: event.target.value,
                }))
              }
              placeholder="Detailed description of this timeline entry"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave}>
            <FaSave />
            {editingId ? 'Save Entry' : 'Create Entry'}
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
            <h2 className="admin-card-title">Timeline Events</h2>
            <p className="admin-card-subtitle">
              Manage life and career timeline entries.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaClock />
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Year Range</th>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Description</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timelineEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-empty-state">
                    No timeline events found.
                  </td>
                </tr>
              )}
              {timelineEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.year_range}</td>
                  <td>{entry.title}</td>
                  <td>{entry.location || '—'}</td>
                  <td>{entry.type}</td>
                  <td>
                    <span className={`admin-status-chip ${(entry.status ?? 'Active') === 'Inactive' ? 'warning' : 'success'}`}>
                      {entry.status ?? 'Active'}
                    </span>
                  </td>
                  <td>{truncateText(entry.description || '', 90)}</td>
                  <td>{entry.display_order}</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startEdit(entry)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => handleDelete(entry.id)}
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
