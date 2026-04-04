import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest } from '@/lib/adminApiAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const DEFAULT_UPLOAD_BUCKET = 'portfolio-storage';
const DEFAULT_UPLOAD_FOLDER = 'general';
const DEFAULT_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

type UploadedFileRow = {
  id: string;
  bucket_name: string;
  storage_path: string;
  public_url: string;
  original_name: string;
  mime_type: string | null;
  size_bytes: number;
  resource: string | null;
  resource_id: string | null;
  field_name: string | null;
  created_at: string;
  updated_at: string;
};

function getUploadBucketName() {
  return process.env.ADMIN_UPLOAD_BUCKET?.trim() || DEFAULT_UPLOAD_BUCKET;
}

function getMaxUploadSizeBytes() {
  const configured = process.env.ADMIN_MAX_UPLOAD_SIZE_BYTES?.trim();
  if (!configured) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  const parsed = Number.parseInt(configured, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  return parsed;
}

function getFileExtension(fileName: string) {
  const normalized = fileName.trim();
  const dotIndex = normalized.lastIndexOf('.');
  if (dotIndex < 0 || dotIndex === normalized.length - 1) {
    return '';
  }

  return normalized.slice(dotIndex + 1).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function sanitizePathSegment(value: string, fallback: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.{2,}/g, '-');

  if (!normalized) {
    return fallback;
  }

  return normalized;
}

function buildStoragePath(folder: string, originalName: string) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const extension = getFileExtension(originalName);
  const uniqueId =
    globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const baseName = sanitizePathSegment(folder, DEFAULT_UPLOAD_FOLDER);
  return `${baseName}/${year}/${month}/${uniqueId}${extension ? `.${extension}` : ''}`;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function GET(request: Request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('storage_files')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: (data ?? []) as UploadedFileRow[] });
}

export async function POST(request: Request) {
  if (!(await isAuthorizedAdminRequest(request))) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid multipart form data.' }, { status: 400 });
  }

  const uploadedFile = formData.get('file');
  if (!(uploadedFile instanceof File)) {
    return NextResponse.json({ ok: false, error: 'A file is required.' }, { status: 400 });
  }

  if (uploadedFile.size <= 0) {
    return NextResponse.json({ ok: false, error: 'Uploaded file is empty.' }, { status: 400 });
  }

  const maxUploadSize = getMaxUploadSizeBytes();
  if (uploadedFile.size > maxUploadSize) {
    return NextResponse.json(
      {
        ok: false,
        error: `File exceeds max upload size (${Math.round(maxUploadSize / (1024 * 1024))} MB).`,
      },
      { status: 413 },
    );
  }

  const rawFolder = String(formData.get('folder') ?? DEFAULT_UPLOAD_FOLDER);
  const folder = sanitizePathSegment(rawFolder, DEFAULT_UPLOAD_FOLDER);

  const rawResource = String(formData.get('resource') ?? '').trim();
  const rawResourceId = String(formData.get('resourceId') ?? '').trim();
  const rawFieldName = String(formData.get('fieldName') ?? '').trim();

  const resource = rawResource || null;
  const resourceId = rawResourceId && isUuid(rawResourceId) ? rawResourceId : null;
  const fieldName = rawFieldName || null;

  const bucketName = getUploadBucketName();
  const storagePath = buildStoragePath(folder, uploadedFile.name || 'file');
  const arrayBuffer = await uploadedFile.arrayBuffer();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucketName)
    .upload(storagePath, arrayBuffer, {
      contentType: uploadedFile.type || undefined,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucketName)
    .getPublicUrl(storagePath);

  const publicUrl = publicUrlData.publicUrl;

  const { data, error } = await supabaseAdmin
    .from('storage_files')
    .insert({
      bucket_name: bucketName,
      storage_path: storagePath,
      public_url: publicUrl,
      original_name: uploadedFile.name || 'file',
      mime_type: uploadedFile.type || null,
      size_bytes: uploadedFile.size,
      resource,
      resource_id: resourceId,
      field_name: fieldName,
    })
    .select('*')
    .single();

  if (error) {
    await supabaseAdmin.storage.from(bucketName).remove([storagePath]);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data: data as UploadedFileRow }, { status: 201 });
}
