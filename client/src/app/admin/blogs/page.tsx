'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import type { BlogPost } from '@/types';
import {
  createAdminResource,
  deleteAdminResource,
  fetchAdminResource,
  updateAdminResource,
} from '@/lib/adminResourceClient';
import { uploadAdminFile } from '@/lib/adminStorageClient';
import { formatDate, generateSlug, getReadingTime, truncateText } from '@/utils/helpers';

type BlogForm = {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  categories: string;
  status: 'draft' | 'published';
  published_at: string;
  read_time: number;
  image_url: string;
};

const defaultForm: BlogForm = {
  title: '',
  content: '',
  excerpt: '',
  tags: '',
  categories: '',
  status: 'draft',
  published_at: '',
  read_time: 1,
  image_url: '',
};

function toDateTimeInputValue(value: string | null) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogForm>(defaultForm);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const formTitle = useMemo(
    () => (editingId ? 'Edit Blog Post' : 'Add New Blog Post'),
    [editingId],
  );

  const loadPosts = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminResource<BlogPost>('blogs');
      setPosts(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load blogs.');
    }
  }, []);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const resetForm = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setSelectedImageFile(null);
  };

  const startEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setSelectedImageFile(null);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt ?? '',
      tags: post.tags,
      categories: post.categories,
      status: post.status,
      published_at: post.published_at ?? '',
      read_time: post.read_time,
      image_url: post.image_url ?? '',
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
        folder: 'blogs',
        resource: 'blogs',
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
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setError('');

    const publishedAt =
      formData.status === 'published'
        ? (formData.published_at || new Date().toISOString())
        : null;

    const payload = {
      title: formData.title.trim(),
      slug: generateSlug(formData.title.trim()),
      content: formData.content,
      excerpt: formData.excerpt.trim() || null,
      tags: formData.tags.trim(),
      categories: formData.categories.trim(),
      status: formData.status,
      published_at: publishedAt,
      read_time: Math.max(1, formData.read_time || getReadingTime(formData.content)),
      image_url: formData.image_url.trim() || null,
    };

    try {
      if (editingId) {
        await updateAdminResource<BlogPost>('blogs', editingId, payload);
      } else {
        await createAdminResource<BlogPost>('blogs', payload);
      }

      resetForm();
      await loadPosts();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save blog post.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await deleteAdminResource('blogs', id);
      if (editingId === id) {
        resetForm();
      }
      await loadPosts();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete blog post.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">{formTitle}</h1>
            <p className="admin-card-subtitle">Create and manage blog posts and articles.</p>
          </div>
          <div className="admin-stat-icon">
            <FaSave />
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-form-label">Title *</label>
            <input
              className="admin-form-input"
              value={formData.title}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, title: event.target.value }))
              }
              placeholder="Blog title"
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
                  status: event.target.value as 'draft' | 'published',
                }))
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Categories</label>
            <input
              className="admin-form-input"
              value={formData.categories}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, categories: event.target.value }))
              }
              placeholder="Technology, Programming"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Tags</label>
            <input
              className="admin-form-input"
              value={formData.tags}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, tags: event.target.value }))
              }
              placeholder="nextjs, supabase"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Publish Date</label>
            <input
              type="datetime-local"
              className="admin-form-input"
              value={toDateTimeInputValue(formData.published_at)}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  published_at: event.target.value
                    ? new Date(event.target.value).toISOString()
                    : '',
                }))
              }
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Read Time (minutes)</label>
            <input
              className="admin-form-input"
              type="number"
              min={1}
              value={formData.read_time}
              onChange={(event) =>
                setFormData((currentForm) => ({
                  ...currentForm,
                  read_time: Math.max(1, Number(event.target.value) || 1),
                }))
              }
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Image Path</label>
            <input
              className="admin-form-input"
              value={formData.image_url}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, image_url: event.target.value }))
              }
              placeholder="/images/blog/post.jpg"
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
              Uploads to the portfolio-storage bucket and fills Image Path automatically.
            </span>
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Excerpt</label>
            <textarea
              className="admin-form-textarea"
              rows={3}
              value={formData.excerpt}
              onChange={(event) =>
                setFormData((currentForm) => ({ ...currentForm, excerpt: event.target.value }))
              }
              placeholder="Short summary"
            />
          </div>

          <div className="admin-form-group full-width">
            <label className="admin-form-label">Content *</label>
            <textarea
              className="admin-form-textarea"
              rows={12}
              value={formData.content}
              onChange={(event) =>
                setFormData((currentForm) => {
                  const content = event.target.value;
                  return {
                    ...currentForm,
                    content,
                    read_time: getReadingTime(content),
                  };
                })
              }
              placeholder="Write your blog content"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave}>
            <FaSave />
            {editingId ? 'Save Post' : 'Create Post'}
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
            <h2 className="admin-card-title">Blog Posts</h2>
            <p className="admin-card-subtitle">Manage published and draft blog posts.</p>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Excerpt</th>
                <th>Categories</th>
                <th>Status</th>
                <th>Publish Date</th>
                <th>Read Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No blog posts found.
                  </td>
                </tr>
              )}
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{truncateText(post.excerpt ?? post.content, 90)}</td>
                  <td>{post.categories}</td>
                  <td>
                    <span className={`admin-status-chip ${post.status === 'published' ? 'success' : 'warning'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{post.published_at ? formatDate(post.published_at) : 'Not Set'}</td>
                  <td>{post.read_time} min</td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => startEdit(post)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => handleDelete(post.id)}
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
