import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 120;
const MAX_EVENT_TYPE_LENGTH = 64;
const MAX_PATH_LENGTH = 256;
const MAX_METADATA_SIZE = 4000;

type AnalyticsPayload = {
  event_type?: unknown;
  page_path?: unknown;
  metadata?: unknown;
};

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

type RateLimitRecord = {
  count: number;
  windowStartMs: number;
};

const analyticsRateLimits = new Map<string, RateLimitRecord>();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const analyticsClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
  : null;

function normalizeString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
}

function normalizeMetadata(value: unknown): JsonValue | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  try {
    const serialized = JSON.stringify(value);
    if (!serialized || serialized.length > MAX_METADATA_SIZE) {
      return null;
    }

    return value as JsonValue;
  } catch {
    return null;
  }
}

function getRateLimitKey(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const userAgent = request.headers.get('user-agent')?.trim().slice(0, 120) ?? 'unknown';
  const ip = forwardedFor || realIp || 'unknown';

  return `${ip}:${userAgent}`;
}

function cleanupRateLimits(nowMs: number) {
  for (const [key, record] of analyticsRateLimits.entries()) {
    if (nowMs - record.windowStartMs > RATE_LIMIT_WINDOW_MS) {
      analyticsRateLimits.delete(key);
    }
  }
}

function isRateLimited(request: NextRequest) {
  const nowMs = Date.now();
  cleanupRateLimits(nowMs);

  const key = getRateLimitKey(request);
  const existing = analyticsRateLimits.get(key);

  if (!existing) {
    analyticsRateLimits.set(key, {
      count: 1,
      windowStartMs: nowMs,
    });
    return false;
  }

  if (nowMs - existing.windowStartMs > RATE_LIMIT_WINDOW_MS) {
    analyticsRateLimits.set(key, {
      count: 1,
      windowStartMs: nowMs,
    });
    return false;
  }

  const count = existing.count + 1;
  analyticsRateLimits.set(key, {
    ...existing,
    count,
  });

  return count > MAX_EVENTS_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: 'Too many analytics requests' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }

  try {
    const body = (await request.json()) as AnalyticsPayload;
    const eventType = normalizeString(body.event_type, MAX_EVENT_TYPE_LENGTH);
    const pagePath = normalizeString(body.page_path, MAX_PATH_LENGTH);
    const metadata = normalizeMetadata(body.metadata);

    if (!eventType || !pagePath || !pagePath.startsWith('/')) {
      return NextResponse.json(
        { error: 'event_type and page_path are required' },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    if (!analyticsClient) {
      return NextResponse.json(
        { success: true, skipped: true },
        {
          status: 202,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    const { error } = await analyticsClient
      .from('analytics_events')
      .insert({
        event_type: eventType,
        page_path: pagePath,
        metadata,
      });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to store analytics event' },
        {
          status: 503,
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    return NextResponse.json(
      { success: true },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      },
    );
  }
}
