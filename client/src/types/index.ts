export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string;
  project_year: number;
  demo_url: string | null;
  github_url: string | null;
  status: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  categories: string;
  tags: string;
  published_at: string | null;
  read_time: number;
  image_url: string | null;
  status: 'draft' | 'published';
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  category: string;
  skill_name: string;
  skill_icon: string;
  proficiency: number;
  status?: string | null;
  display_order: number;
}

export interface TimelineItem {
  id: string;
  year_range: string;
  title: string;
  location: string;
  description: string;
  type: 'education' | 'work' | 'milestone';
  status?: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  responsibilities: string;
  status?: string | null;
  display_order: number;
}

export interface HomeSection {
  id: string;
  section_name: string;
  content: string;
  image_path: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_class: string;
  display_order: number;
  is_active: boolean;
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  section_type: string;
  display_order: number;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  page_path: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
}
