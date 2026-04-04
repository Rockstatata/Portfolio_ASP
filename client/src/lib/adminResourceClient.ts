export async function fetchAdminResource<T>(resource: string) {
  const response = await fetch(`/api/admin/resources/${resource}`, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  const result = (await response.json()) as {
    ok: boolean;
    data?: T[];
    error?: string;
  };

  if (!response.ok || !result.ok) {
    throw new Error(result.error ?? `Failed to fetch ${resource}`);
  }

  return result.data ?? [];
}

export async function createAdminResource<T>(
  resource: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch(`/api/admin/resources/${resource}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as {
    ok: boolean;
    data?: T;
    error?: string;
  };

  if (!response.ok || !result.ok || !result.data) {
    throw new Error(result.error ?? `Failed to create ${resource}`);
  }

  return result.data;
}

export async function updateAdminResource<T>(
  resource: string,
  id: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch(`/api/admin/resources/${resource}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json()) as {
    ok: boolean;
    data?: T;
    error?: string;
  };

  if (!response.ok || !result.ok || !result.data) {
    throw new Error(result.error ?? `Failed to update ${resource}`);
  }

  return result.data;
}

export async function deleteAdminResource(resource: string, id: string) {
  const response = await fetch(`/api/admin/resources/${resource}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const result = (await response.json()) as {
    ok: boolean;
    error?: string;
  };

  if (!response.ok || !result.ok) {
    throw new Error(result.error ?? `Failed to delete ${resource}`);
  }
}

export function isMissingColumnError(error: unknown, columnName: string) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  const target = columnName.toLowerCase();
  const hasColumnReference = message.includes(target);
  const hasMissingSignal =
    message.includes('does not exist') ||
    message.includes('schema cache') ||
    message.includes('could not find') ||
    message.includes('column');

  return hasColumnReference && hasMissingSignal;
}
