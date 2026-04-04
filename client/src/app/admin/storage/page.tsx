'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaCopy, FaFolderOpen, FaTrash, FaUpload } from 'react-icons/fa';
import type { StorageFile } from '@/types';
import { deleteAdminFile, fetchAdminFiles, uploadAdminFile } from '@/lib/adminStorageClient';

function formatBytes(size: number) {
  if (!Number.isFinite(size) || size < 0) {
    return '0 B';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  const units = ['KB', 'MB', 'GB'];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function AdminStoragePage() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folder, setFolder] = useState('general');
  const [resource, setResource] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const loadFiles = useCallback(async () => {
    setError('');
    try {
      const data = await fetchAdminFiles();
      setFiles(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load files.');
    }
  }, []);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return files;
    }

    return files.filter((item) => {
      const searchable = [
        item.original_name,
        item.mime_type ?? '',
        item.resource ?? '',
        item.field_name ?? '',
        item.storage_path,
      ]
        .join(' ')
        .toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [files, query]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setError('');
    setNotice('');
    setIsUploading(true);

    try {
      const uploaded = await uploadAdminFile({
        file: selectedFile,
        folder,
        resource: resource.trim() || undefined,
        resourceId: resourceId.trim() || undefined,
        fieldName: fieldName.trim() || undefined,
      });

      setSelectedFile(null);
      setNotice(`Uploaded ${uploaded.original_name} successfully.`);
      await loadFiles();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file from storage and database references?')) {
      return;
    }

    setError('');
    setNotice('');

    try {
      await deleteAdminFile(id);
      setNotice('File deleted successfully.');
      await loadFiles();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete file.');
    }
  };

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setNotice('Copied URL to clipboard.');
      setError('');
    } catch {
      setError('Failed to copy URL.');
    }
  };

  return (
    <>
      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h1 className="admin-card-title">Storage Manager</h1>
            <p className="admin-card-subtitle">
              Upload files to the portfolio-storage bucket and keep persistent references in the database.
            </p>
          </div>
          <div className="admin-stat-icon">
            <FaFolderOpen />
          </div>
        </div>

        <div className="admin-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="admin-form-group full-width">
            <label className="admin-form-label">File</label>
            <input
              className="admin-form-input"
              type="file"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Folder</label>
            <input
              className="admin-form-input"
              value={folder}
              onChange={(event) => setFolder(event.target.value)}
              placeholder="general, projects, blogs"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Resource Name (Optional)</label>
            <input
              className="admin-form-input"
              value={resource}
              onChange={(event) => setResource(event.target.value)}
              placeholder="projects, blogs, home"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Resource ID (Optional)</label>
            <input
              className="admin-form-input"
              value={resourceId}
              onChange={(event) => setResourceId(event.target.value)}
              placeholder="UUID"
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Field Name (Optional)</label>
            <input
              className="admin-form-input"
              value={fieldName}
              onChange={(event) => setFieldName(event.target.value)}
              placeholder="image_url, image_path, resume_url"
            />
          </div>
        </div>

        <div className="admin-form-actions">
          <button
            className="admin-btn admin-btn-primary"
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            <FaUpload />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
        {notice && <p className="success-message">{notice}</p>}
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Uploaded Files</h2>
            <p className="admin-card-subtitle">
              Search, copy URLs, or delete files with synchronized storage cleanup.
            </p>
          </div>
        </div>

        <div className="admin-form-group" style={{ maxWidth: '420px', marginBottom: '1rem' }}>
          <label className="admin-form-label">Search Files</label>
          <input
            className="admin-form-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by file name, type, resource, or path"
          />
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th>Reference</th>
                <th>Created</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan={7} className="admin-empty-state">
                    No uploaded files found.
                  </td>
                </tr>
              )}
              {filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td>
                    <strong>{file.original_name}</strong>
                    <div className="app-muted" style={{ fontSize: '0.75rem' }}>
                      {file.storage_path}
                    </div>
                  </td>
                  <td>{file.mime_type || 'Unknown'}</td>
                  <td>{formatBytes(file.size_bytes)}</td>
                  <td>
                    {file.resource ? `${file.resource}${file.field_name ? `.${file.field_name}` : ''}` : 'Manual upload'}
                  </td>
                  <td>{new Date(file.created_at).toLocaleString()}</td>
                  <td>
                    <a href={file.public_url} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </td>
                  <td>
                    <button
                      className="admin-btn admin-btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => void handleCopy(file.public_url)}
                      title="Copy URL"
                    >
                      <FaCopy />
                    </button>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ padding: '0.4rem 0.6rem' }}
                      type="button"
                      onClick={() => void handleDelete(file.id)}
                      title="Delete file"
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
