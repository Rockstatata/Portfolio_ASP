'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import type { Project } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  updateAdminResource,
} from '@/lib/adminResourceClient';
import { uploadAdminFile } from '@/lib/adminStorageClient';

type ProjectForm = {
  title: string;
  description: string;
  technologies: string;
  demo_url: string;
  github_url: string;
  status: string;
  project_year: number;
  image_url: string;
  display_order: number;
};

const defaultForm: ProjectForm = {
  title: '',
  description: '',
  technologies: '',
  demo_url: '',
  github_url: '',
  status: 'active',
  project_year: new Date().getFullYear(),
  image_url: '',
  display_order: 0,
};

const projectStatusOptions: Array<{ value: string; label: string }> = [
  { value: 'active', label: 'Completed' },
  { value: 'draft', label: 'In Development / Planning' },
  { value: 'archived', label: 'On Hold / Cancelled' },
];

const projectStatusChipByValue: Record<string, string> = {
  active: 'success',
  draft: 'warning',
  archived: 'danger',
};

const getProjectStatusLabel = (value: string) => {
  const matched = projectStatusOptions.find((option) => option.value === value);
  return matched ? matched.label : value;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectForm>(defaultForm);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const formTitle = useMemo(
    () => (editingId ? 'Edit Project' : 'Add New Project'),
    [editingId],
  );

  const loadProjects = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminResource<Project>('projects');
      setProjects(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load projects.');
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setSelectedImageFile(null);
  };

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setSelectedImageFile(null);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      demo_url: project.demo_url ?? '',
      github_url: project.github_url ?? '',
      status: project.status,
      project_year: project.project_year,
      image_url: project.image_url ?? '',
      display_order: project.display_order,
    });
  };

  const handleImageUpload = async () => {
    if (!selectedImageFile) {
      setError('Please choose an image to upload.');
      return;
    }

    setError('');
    setIsUploadingImage(true);

    try {
      const uploaded = await uploadAdminFile({
        file: selectedImageFile,
        folder: 'projects',
        resource: 'projects',
        resourceId: editingId ?? undefined,
        fieldName: 'image_url',
      });

      setFormData((currentForm) => ({
        ...currentForm,
        image_url: uploaded.public_url,
      }));
      setSelectedImageFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setError('');
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      technologies: formData.technologies.trim(),
      demo_url: formData.demo_url.trim() || null,
      github_url: formData.github_url.trim() || null,
      status: formData.status,
      project_year: formData.project_year,
      image_url: formData.image_url.trim() || null,
      display_order: formData.display_order,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateAdminResource<Project>('projects', editingId, payload);
      } else {
        await createAdminResource<Project>('projects', payload);
      }

      resetForm();
      await loadProjects();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save project.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await deleteAdminResource('projects', id);
      if (editingId === id) {
        resetForm();
      }
      await loadProjects();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete project.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">{formTitle}</h1>
            <p className="admin-card-subtitle">Create and manage your portfolio projects.</p>
          </div>
          <div className="admin-stat-icon">
            <FaSave />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Project Title *</label>
            <input
              className="admin-form-input"
              value={formData.title}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, title: event.target.value }))
              }
              placeholder="Enter project title"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Project Year</label>
            <input
              className="admin-form-input"
              type="number"
              value={formData.project_year}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  project_year: Number(event.target.value) || new Date().getFullYear(),
                }))
              }
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Description *</label>
            <textarea
              className="admin-form-textarea"
              rows={4}
              value={formData.description}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, description: event.target.value }))
              }
              placeholder="Describe your project"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Technologies</label>
            <input
              className="admin-form-input"
              value={formData.technologies}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, technologies: event.target.value }))
              }
              placeholder="React, Next.js, PostgreSQL"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Status</label>
            <select
              className="admin-form-select"
              value={formData.status}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, status: event.target.value }))
              }
            >
              {projectStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Demo Link</label>
            <input
              className="admin-form-input"
              value={formData.demo_url}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, demo_url: event.target.value }))
              }
              placeholder="https://demo.example.com"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Source Code Link</label>
            <input
              className="admin-form-input"
              value={formData.github_url}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, github_url: event.target.value }))
              }
              placeholder="https://github.com/user/repo"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Image Path</label>
            <input
              className="admin-form-input"
              value={formData.image_url}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, image_url: event.target.value }))
              }
              placeholder="/images/projects/project.jpg"
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Upload Image</label>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                className="admin-form-input"
                type="file"
                accept="image/*"
                style={{ maxWidth: '420px' }}
                onChange={(event) => setSelectedImageFile(event.target.files?.[0] ?? null)}
              />
              <button
                className="admin-btn admin-btn-secondary"
                type="button"
                disabled={!selectedImageFile || isUploadingImage}
                onClick={() => void handleImageUpload()}
              >
                {isUploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
            <span className="admin-form-hint">
              Uploads to the portfolio-storage bucket and sets Image Path automatically.
            </span>
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
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave}>
            <FaSave />
            {editingId ? 'Save Project' : 'Create Project'}
          </button>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={resetForm}>
            Cancel
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
            <h2 className="admin-card-title">Existing Projects</h2>
            <p className="admin-card-subtitle">Manage live project records shown on `/projects`.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Technologies</th>
                <th>Year</th>
                <th>Status</th>
                <th>Links</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-empty-state">
                    No projects found.
                  </td>
                </tr>
              )}
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.technologies}</td>
                  <td>{project.project_year}</td>
                  <td>
                    <span
                      className={`admin-status-chip ${projectStatusChipByValue[project.status] ?? 'warning'}`}
                    >
                      {getProjectStatusLabel(project.status)}
                    </span>
                  </td>
                  <td>
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noreferrer" style={{ marginRight: '0.5rem' }}>
                        Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer">
                        Code
                      </a>
                    )}
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startEdit(project)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => handleDelete(project.id)}
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
    </>
  );
}
