import {
  ADMIN_AUTH_COOKIE,
  verifyAdminSessionToken,
} from '@/lib/adminAuth';

function getCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const cookiePart of cookies) {
    const [rawKey, ...rawValue] = cookiePart.trim().split('=');
    if (rawKey === cookieName) {
      const cookieValue = rawValue.join('=');
      try {
        return decodeURIComponent(cookieValue);
      } catch {
        return cookieValue;
      }
    }
  }

  return null;
}

function isMutationRequest(method: string) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
}

function getRequestOrigin(request: Request) {
  const explicitOrigin = request.headers.get('origin');
  if (explicitOrigin) {
    return explicitOrigin;
  }

  const referer = request.headers.get('referer');
  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

function isTrustedMutationOrigin(request: Request) {
  if (!isMutationRequest(request.method)) {
    return true;
  }

  const requestOrigin = getRequestOrigin(request);
  if (!requestOrigin) {
    return false;
  }

  try {
    return requestOrigin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function isAuthorizedAdminRequest(request: Request) {
  if (!isTrustedMutationOrigin(request)) {
    return false;
  }

  const cookieHeader = request.headers.get('cookie');
  const sessionValue = getCookieValue(cookieHeader, ADMIN_AUTH_COOKIE);
  return verifyAdminSessionToken(sessionValue);
}
