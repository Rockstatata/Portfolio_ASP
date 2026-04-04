import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

type Context = {
  params: Promise<{ id: string }>;
};

function jsonResponse(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

async function findPublishedBlogContent(idOrSlug: string) {
  const byId = await supabaseAdmin
    .from('blog_posts')
    .select('id, content, status')
    .eq('id', idOrSlug)
    .maybeSingle();

  if (byId.error) {
    return byId;
  }

  if (byId.data) {
    return byId;
  }

  return supabaseAdmin
    .from('blog_posts')
    .select('id, content, status')
    .eq('slug', idOrSlug)
    .maybeSingle();
}

export async function GET(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const decodedId = decodeURIComponent(id);

    if (!decodedId.trim()) {
      return jsonResponse({ ok: false, error: 'Invalid blog id.' }, 400);
    }

    const result = await findPublishedBlogContent(decodedId.trim());

    if (result.error) {
      return jsonResponse({ ok: false, error: result.error.message }, 500);
    }

    if (!result.data || result.data.status !== 'published') {
      return jsonResponse({ ok: false, error: 'Blog post not found.' }, 404);
    }

    return jsonResponse({ ok: true, content: result.data.content ?? '' });
  } catch (error) {
    console.error('Failed to load blog content', error);
    return jsonResponse({ ok: false, error: 'Failed to load blog content.' }, 500);
  }
}
