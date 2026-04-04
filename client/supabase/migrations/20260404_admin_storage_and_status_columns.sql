-- Admin storage support + status column alignment
-- Safe to run multiple times

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure public upload bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-storage', 'portfolio-storage', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Align admin form fields with table schema
ALTER TABLE skills ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Current';

-- Persistent file metadata for uploaded storage assets
CREATE TABLE IF NOT EXISTS storage_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_name TEXT NOT NULL DEFAULT 'portfolio-storage',
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  resource TEXT,
  resource_id UUID,
  field_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE storage_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access" ON storage_files;
CREATE POLICY "Admin full access" ON storage_files FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE INDEX IF NOT EXISTS idx_storage_files_created_at ON storage_files(created_at);
CREATE INDEX IF NOT EXISTS idx_storage_files_resource ON storage_files(resource, resource_id);
