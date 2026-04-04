import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

type StatusRecord = {
  status?: string | null;
};

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

function isVisibleStatus(status: string | null | undefined) {
  const normalized = (status ?? '').trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return !['inactive', 'archived', 'draft', 'hidden', 'disabled'].includes(normalized);
}

function filterVisibleStatus<T extends StatusRecord>(rows: T[] | null | undefined) {
  return (rows ?? []).filter((row) => isVisibleStatus(row.status));
}

export async function GET() {
  try {
    const [
      homeResult,
      aboutResult,
      projectsResult,
      blogsResult,
      skillsResult,
      timelineResult,
      experiencesResult,
      socialLinksResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('home_sections')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('about_sections')
        .select('*')
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false }),
      supabaseAdmin
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('timeline')
        .select('*')
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true }),
      supabaseAdmin
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
    ]);

    const failedResult = [
      homeResult,
      aboutResult,
      projectsResult,
      blogsResult,
      skillsResult,
      timelineResult,
      experiencesResult,
      socialLinksResult,
    ].find((result) => Boolean(result.error));

    if (failedResult?.error) {
      return jsonResponse({ ok: false, error: failedResult.error.message }, 500);
    }

    const data = {
      homeSections: homeResult.data ?? [],
      aboutSections: filterVisibleStatus(aboutResult.data),
      projects: projectsResult.data ?? [],
      blogs: blogsResult.data ?? [],
      skills: filterVisibleStatus(skillsResult.data),
      timeline: filterVisibleStatus(timelineResult.data),
      experiences: filterVisibleStatus(experiencesResult.data),
      socialLinks: socialLinksResult.data ?? [],
    };

    return jsonResponse({ ok: true, data });
  } catch (error) {
    console.error('Failed to load portfolio content', error);
    return jsonResponse({ ok: false, error: 'Failed to load portfolio content.' }, 500);
  }
}
