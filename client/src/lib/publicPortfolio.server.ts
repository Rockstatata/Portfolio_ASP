import 'server-only';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { BlogPost, Experience, Project } from '@/types';

type StatusRecord = {
  status?: string | null;
};

const HIDDEN_STATUSES = new Set(['inactive', 'archived', 'draft', 'hidden', 'disabled']);

function decodeRouteParam(value: string) {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
}

function isVisibleStatus(status: string | null | undefined) {
  const normalized = String(status ?? '').trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return !HIDDEN_STATUSES.has(normalized);
}

function filterVisibleStatus<T extends StatusRecord>(rows: T[] | null | undefined) {
  return (rows ?? []).filter((row) => isVisibleStatus(row.status));
}

export async function getActiveProjects() {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Project[];
}

export async function getActiveProjectById(idParam: string) {
  const id = decodeRouteParam(idParam);
  if (!id) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as Project | null;
}

export async function getPublishedBlogPosts() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as BlogPost[];
}

export async function getPublishedBlogPostByRouteParam(slugOrIdParam: string) {
  const slugOrId = decodeRouteParam(slugOrIdParam);
  if (!slugOrId) {
    return null;
  }

  const bySlug = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slugOrId)
    .maybeSingle();

  if (bySlug.error) {
    throw bySlug.error;
  }

  if (bySlug.data) {
    return bySlug.data as BlogPost;
  }

  const byId = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('id', slugOrId)
    .maybeSingle();

  if (byId.error) {
    throw byId.error;
  }

  return (byId.data ?? null) as BlogPost | null;
}

export async function getVisibleExperiences() {
  const { data, error } = await supabaseAdmin
    .from('experiences')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return filterVisibleStatus(data as Experience[]);
}

export async function getVisibleExperienceById(idParam: string) {
  const id = decodeRouteParam(idParam);
  if (!id) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('experiences')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data || !isVisibleStatus(data.status)) {
    return null;
  }

  return data as Experience;
}
