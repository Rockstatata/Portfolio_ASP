-- ============================================
-- Portfolio Database Schema for Supabase
-- Migrated from ASP.NET WebForms SQL Server
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure the public storage bucket exists for admin uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-storage', 'portfolio-storage', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ============================================
-- Users table (managed by Supabase Auth)
-- This is for additional user profile data
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Projects table
-- Migrated from: ASP.NET Projects table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT NOT NULL DEFAULT '',
  project_year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  demo_url TEXT,
  github_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Blog Posts table
-- Migrated from: ASP.NET Blogs table
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  categories TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  published_at TIMESTAMPTZ,
  read_time INTEGER DEFAULT 1,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Messages table (Contact form submissions)
-- Migrated from: ASP.NET Contacts table
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Skills table
-- Migrated from: ASP.NET Skills table
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  skill_icon TEXT DEFAULT '',
  proficiency INTEGER NOT NULL DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  status TEXT NOT NULL DEFAULT 'Active',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- Timeline table
-- Migrated from: ASP.NET Timeline table
-- ============================================
CREATE TABLE IF NOT EXISTS timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_range TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT DEFAULT '',
  description TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'work' CHECK (type IN ('education', 'work', 'milestone')),
  status TEXT NOT NULL DEFAULT 'Active',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- Experiences table
-- Migrated from: ASP.NET Experience table
-- ============================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT DEFAULT '',
  responsibilities TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Current',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- Uploaded Storage Files table
-- Stores metadata and references for files uploaded to portfolio-storage bucket
-- ============================================
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

-- Backfill compatibility for older deployments where these status columns are missing
ALTER TABLE skills ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE timeline ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Active';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Current';

-- ============================================
-- About Sections table
-- Migrated from: ASP.NET AboutSections table
-- ============================================
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'main',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- Social Links table
-- Migrated from: ASP.NET SocialLinks table
-- ============================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_class TEXT DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- ============================================
-- Home Sections table
-- Migrated from: ASP.NET HomeSections table
-- ============================================
CREATE TABLE IF NOT EXISTS home_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_path TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Analytics Events table
-- New addition for tracking
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  page_path TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_files ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to keep schema re-runnable
DROP POLICY IF EXISTS "Public read access" ON projects;
DROP POLICY IF EXISTS "Public read access" ON blog_posts;
DROP POLICY IF EXISTS "Public read access" ON skills;
DROP POLICY IF EXISTS "Public read access" ON timeline;
DROP POLICY IF EXISTS "Public read access" ON experiences;
DROP POLICY IF EXISTS "Public read access" ON about_sections;
DROP POLICY IF EXISTS "Public read access" ON social_links;
DROP POLICY IF EXISTS "Public read access" ON home_sections;

DROP POLICY IF EXISTS "Public insert access" ON messages;
DROP POLICY IF EXISTS "Public insert access" ON analytics_events;

DROP POLICY IF EXISTS "Admin full access" ON projects;
DROP POLICY IF EXISTS "Admin full access" ON blog_posts;
DROP POLICY IF EXISTS "Admin full access" ON messages;
DROP POLICY IF EXISTS "Admin full access" ON skills;
DROP POLICY IF EXISTS "Admin full access" ON timeline;
DROP POLICY IF EXISTS "Admin full access" ON experiences;
DROP POLICY IF EXISTS "Admin full access" ON about_sections;
DROP POLICY IF EXISTS "Admin full access" ON social_links;
DROP POLICY IF EXISTS "Admin full access" ON home_sections;
DROP POLICY IF EXISTS "Admin full access" ON analytics_events;
DROP POLICY IF EXISTS "Admin full access" ON storage_files;
DROP POLICY IF EXISTS "Admin profile access" ON user_profiles;

-- Public read access for portfolio content
CREATE POLICY "Public read access" ON projects FOR SELECT USING (status = 'active');
CREATE POLICY "Public read access" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read access" ON timeline FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_sections FOR SELECT USING (true);
CREATE POLICY "Public read access" ON social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON home_sections FOR SELECT USING (is_active = true);

-- Public insert for contact messages and analytics
CREATE POLICY "Public insert access" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON analytics_events FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users with admin role)
CREATE POLICY "Admin full access" ON projects FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON skills FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON timeline FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON experiences FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON about_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON social_links FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON home_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin full access" ON storage_files FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin profile access" ON user_profiles FOR ALL USING (id = auth.uid());

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_storage_files_created_at ON storage_files(created_at);
CREATE INDEX IF NOT EXISTS idx_storage_files_resource ON storage_files(resource, resource_id);

-- ============================================
-- Seed Data
-- ============================================
-- Intentionally left empty to avoid reintroducing placeholder content.
-- Use: node client/scripts/seed-supabase.mjs --force
-- This seeds Supabase with frontend-derived portfolio content and keeps admin/data in sync.
