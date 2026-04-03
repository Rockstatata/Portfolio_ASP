import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_AUTH_COOKIE,
  constantTimeEquals,
  createAdminSessionToken,
  getAdminPasskey,
  getAdminSessionTtlSeconds,
} from '@/lib/adminAuth';

type LoginPayload = {
  passkey?: string;
};

type LoginAttemptRecord = {
  attempts: number;
  windowStartedAtMs: number;
  blockedUntilMs: number;
};

const MAX_LOGIN_ATTEMPTS = 8;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const BLOCK_DURATION_MS = 30 * 60 * 1000;
const loginAttempts = new Map<string, LoginAttemptRecord>();

function cleanupLoginAttempts(nowMs: number) {
  for (const [key, record] of loginAttempts.entries()) {
    const windowExpired = nowMs - record.windowStartedAtMs > ATTEMPT_WINDOW_MS;
    const blockExpired = record.blockedUntilMs <= nowMs;
    if (windowExpired && blockExpired) {
      loginAttempts.delete(key);
    }
  }
}

function getClientIdentifier(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const userAgent = request.headers.get('user-agent')?.trim().slice(0, 120) ?? 'unknown';
  const ip = forwardedFor || realIp || 'unknown';

  return `${ip}:${userAgent}`;
}

function getLoginRateLimitState(clientIdentifier: string, nowMs: number) {
  cleanupLoginAttempts(nowMs);

  const record = loginAttempts.get(clientIdentifier);
  if (!record) {
    return {
      allowed: true,
      retryAfterSeconds: 0,
    };
  }

  if (record.blockedUntilMs > nowMs) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((record.blockedUntilMs - nowMs) / 1000),
      ),
    };
  }

  if (nowMs - record.windowStartedAtMs > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(clientIdentifier);
  }

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}

function recordFailedLogin(clientIdentifier: string, nowMs: number) {
  const existing = loginAttempts.get(clientIdentifier);
  if (!existing || nowMs - existing.windowStartedAtMs > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(clientIdentifier, {
      attempts: 1,
      windowStartedAtMs: nowMs,
      blockedUntilMs: 0,
    });
    return;
  }

  const attempts = existing.attempts + 1;
  const blockedUntilMs = attempts >= MAX_LOGIN_ATTEMPTS
    ? nowMs + BLOCK_DURATION_MS
    : 0;

  loginAttempts.set(clientIdentifier, {
    attempts,
    windowStartedAtMs: existing.windowStartedAtMs,
    blockedUntilMs,
  });
}

function clearFailedLogins(clientIdentifier: string) {
  loginAttempts.delete(clientIdentifier);
}

export async function POST(request: NextRequest) {
  const nowMs = Date.now();
  const clientIdentifier = getClientIdentifier(request);
  const rateLimitState = getLoginRateLimitState(clientIdentifier, nowMs);
  if (!rateLimitState.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Too many login attempts. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': String(rateLimitState.retryAfterSeconds),
        },
      },
    );
  }

  let payload: LoginPayload = {};

  try {
    payload = (await request.json()) as LoginPayload;
  } catch {
    recordFailedLogin(clientIdentifier, nowMs);
    return NextResponse.json(
      { ok: false, error: 'Invalid request body.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  let expectedPasskey: string;
  try {
    expectedPasskey = getAdminPasskey();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Admin authentication is not configured.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const providedPasskey = payload.passkey?.trim() ?? '';
  if (!providedPasskey || !constantTimeEquals(providedPasskey, expectedPasskey)) {
    recordFailedLogin(clientIdentifier, nowMs);
    return NextResponse.json(
      { ok: false, error: 'Invalid passkey.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  clearFailedLogins(clientIdentifier);

  let sessionToken: string;
  try {
    sessionToken = await createAdminSessionToken();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Admin session could not be created.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const response = NextResponse.json(
    { ok: true },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: getAdminSessionTtlSeconds(),
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json(
    { ok: true },
    { headers: { 'Cache-Control': 'no-store' } },
  );
  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: '',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
  });
  return response;
}
