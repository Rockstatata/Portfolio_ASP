import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest } from '@/lib/adminApiAuth';
import { ADMIN_RESOURCE_CONFIG } from '@/lib/adminResources';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type Context = {
  params: Promise<{ resource: string }>;
};

function getResourceConfig(resource: string) {
  return ADMIN_RESOURCE_CONFIG[resource];
}

export async function GET(request: Request, context: Context) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { resource } = await context.params;
  const config = getResourceConfig(resource);
  if (!config) {
    return NextResponse.json({ ok: false, error: 'Unknown resource' }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from(config.table)
    .select('*')
    .order(config.orderColumn, { ascending: config.ascending ?? true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function POST(request: Request, context: Context) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { resource } = await context.params;
  const config = getResourceConfig(resource);
  if (!config) {
    return NextResponse.json({ ok: false, error: 'Unknown resource' }, { status: 404 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from(config.table)
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}
