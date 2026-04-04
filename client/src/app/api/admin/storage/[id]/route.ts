import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest } from '@/lib/adminApiAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type Context = {
  params: Promise<{ id: string }>;
};

function isStorageNotFoundError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes('not found') || normalized.includes('does not exist');
}

export async function DELETE(request: Request, context: Context) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return NextResponse.json({ ok: false, error: 'Invalid file id.' }, { status: 400 });
  }

  const { data: row, error: rowError } = await supabaseAdmin
    .from('storage_files')
    .select('id, bucket_name, storage_path')
    .eq('id', id)
    .maybeSingle();

  if (rowError) {
    return NextResponse.json({ ok: false, error: rowError.message }, { status: 500 });
  }

  if (!row) {
    return NextResponse.json({ ok: false, error: 'File record not found.' }, { status: 404 });
  }

  const typedRow = row as {
    id: string;
    bucket_name: string;
    storage_path: string;
  };

  const { error: storageError } = await supabaseAdmin.storage
    .from(typedRow.bucket_name)
    .remove([typedRow.storage_path]);

  if (storageError && !isStorageNotFoundError(storageError.message)) {
    return NextResponse.json({ ok: false, error: storageError.message }, { status: 500 });
  }

  const { error: deleteError } = await supabaseAdmin
    .from('storage_files')
    .delete()
    .eq('id', typedRow.id);

  if (deleteError) {
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
