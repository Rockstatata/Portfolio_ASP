import type { StorageFile } from '@/types';

type UploadAdminFileInput = {
  file: File;
  folder?: string;
  resource?: string;
  resourceId?: string;
  fieldName?: string;
};

export async function fetchAdminFiles() {
  const response = await fetch('/api/admin/storage', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const result = (await response.json()) as {
    ok: boolean;
    data?: StorageFile[];
    error?: string;
  };

  if (!response.ok || !result.ok) {
    throw new Error(result.error ?? 'Failed to fetch uploaded files.');
  }

  return result.data ?? [];
}

export async function uploadAdminFile(input: UploadAdminFileInput) {
  const formData = new FormData();
  formData.append('file', input.file);

  if (input.folder) {
    formData.append('folder', input.folder);
  }

  if (input.resource) {
    formData.append('resource', input.resource);
  }

  if (input.resourceId) {
    formData.append('resourceId', input.resourceId);
  }

  if (input.fieldName) {
    formData.append('fieldName', input.fieldName);
  }

  const response = await fetch('/api/admin/storage', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const result = (await response.json()) as {
    ok: boolean;
    data?: StorageFile;
    error?: string;
  };

  if (!response.ok || !result.ok || !result.data) {
    throw new Error(result.error ?? 'Failed to upload file.');
  }

  return result.data;
}

export async function deleteAdminFile(id: string) {
  const response = await fetch(`/api/admin/storage/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = (await response.json()) as {
    ok: boolean;
    error?: string;
  };

  if (!response.ok || !result.ok) {
    throw new Error(result.error ?? 'Failed to delete file.');
  }
}
