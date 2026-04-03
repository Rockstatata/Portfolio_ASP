import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest } from '@/lib/adminApiAuth';
import { ADMIN_RESOURCE_CONFIG } from '@/lib/adminResources';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type Context = {
  params: Promise<{ resource: string; id: string }>;
};

function getResourceConfig(resource: string) {
  return ADMIN_RESOURCE_CONFIG[resource];
}

export async function PUT(request: Request, context: Context) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { resource, id } = await context.params;
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
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}

export async function DELETE(request: Request, context: Context) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { resource, id } = await context.params;
  const config = getResourceConfig(resource);
  if (!config) {
    return NextResponse.json({ ok: false, error: 'Unknown resource' }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from(config.table)
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
