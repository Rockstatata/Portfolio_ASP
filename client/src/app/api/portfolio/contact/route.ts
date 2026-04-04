import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 8;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

type RateLimitRecord = {
  count: number;
  windowStartMs: number;
};

const contactRateLimits = new Map<string, RateLimitRecord>();

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function getRateLimitKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const userAgent = request.headers.get('user-agent')?.trim().slice(0, 120) ?? 'unknown';
  const ip = forwardedFor || realIp || 'unknown';

  return `${ip}:${userAgent}`;
}

function cleanupRateLimits(nowMs: number) {
  for (const [key, record] of contactRateLimits.entries()) {
    if (nowMs - record.windowStartMs > RATE_LIMIT_WINDOW_MS) {
      contactRateLimits.delete(key);
    }
  }
}

function isRateLimited(request: NextRequest) {
  const nowMs = Date.now();
  cleanupRateLimits(nowMs);

  const key = getRateLimitKey(request);
  const existing = contactRateLimits.get(key);

  if (!existing) {
    contactRateLimits.set(key, {
      count: 1,
      windowStartMs: nowMs,
    });
    return false;
  }

  if (nowMs - existing.windowStartMs > RATE_LIMIT_WINDOW_MS) {
    contactRateLimits.set(key, {
      count: 1,
      windowStartMs: nowMs,
    });
    return false;
  }

  const count = existing.count + 1;
  contactRateLimits.set(key, {
    ...existing,
    count,
  });

  return count > MAX_SUBMISSIONS_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return jsonResponse({ ok: false, error: 'Too many submissions. Please try again later.' }, 429);
  }

  try {
    const body = (await request.json()) as ContactPayload;

    const name = normalizeString(body.name, MAX_NAME_LENGTH);
    const email = normalizeString(body.email, MAX_EMAIL_LENGTH);
    const subject = normalizeString(body.subject, MAX_SUBJECT_LENGTH);
    const message = normalizeString(body.message, MAX_MESSAGE_LENGTH);

    if (!name || !email || !message) {
      return jsonResponse(
        { ok: false, error: 'Name, email, and message are required.' },
        400,
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return jsonResponse({ ok: false, error: 'Please enter a valid email address.' }, 400);
    }

    const { error } = await supabaseAdmin
      .from('messages')
      .insert({
        name,
        email,
        subject,
        message,
        is_read: false,
        is_archived: false,
      });

    if (error) {
      return jsonResponse({ ok: false, error: error.message }, 500);
    }

    return jsonResponse({ ok: true, message: 'Message sent successfully.' }, 201);
  } catch (error) {
    console.error('Failed to submit contact message', error);
    return jsonResponse({ ok: false, error: 'Failed to submit message.' }, 500);
  }
}
