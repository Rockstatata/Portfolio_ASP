import { supabase } from './supabase';
import type {
  AboutSection,
  AnalyticsEvent,
  BlogPost,
  Contact,
  Experience,
  HomeSection,
  Project,
  Skill,
  SocialLink,
  TimelineItem,
} from '@/types';

// Projects
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Project[];
}

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Project[];
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select('*')
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update({ ...project, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Blog posts
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function getAllBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select('*')
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(id: string, post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(post)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Messages
export async function getContacts() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Contact[];
}

export async function createContact(contact: Omit<Contact, 'id' | 'is_read' | 'is_archived' | 'created_at'>) {
  const { data, error } = await supabase
    .from('messages')
    .insert(contact)
    .select('*')
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function updateContact(id: string, contact: Partial<Contact>) {
  const { data, error } = await supabase
    .from('messages')
    .update(contact)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Contact;
}

export async function markContactRead(id: string) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Skills
export async function getSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Skill[];
}

export async function createSkill(skill: Omit<Skill, 'id'>) {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select('*')
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(id: string, skill: Partial<Skill>) {
  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Timeline
export async function getTimeline() {
  const { data, error } = await supabase
    .from('timeline')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as TimelineItem[];
}

export async function createTimelineItem(item: Omit<TimelineItem, 'id'>) {
  const { data, error } = await supabase
    .from('timeline')
    .insert(item)
    .select('*')
    .single();

  if (error) throw error;
  return data as TimelineItem;
}

export async function updateTimelineItem(id: string, item: Partial<TimelineItem>) {
  const { data, error } = await supabase
    .from('timeline')
    .update(item)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as TimelineItem;
}

export async function deleteTimelineItem(id: string) {
  const { error } = await supabase
    .from('timeline')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Experience
export async function getExperiences() {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as Experience[];
}

export async function getExperienceById(id: string) {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function createExperience(experience: Omit<Experience, 'id'>) {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select('*')
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(id: string, experience: Partial<Experience>) {
  const { data, error } = await supabase
    .from('experiences')
    .update(experience)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function deleteExperience(id: string) {
  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// About
export async function getAboutSections() {
  const { data, error } = await supabase
    .from('about_sections')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as AboutSection[];
}

export async function createAboutSection(section: Omit<AboutSection, 'id'>) {
  const { data, error } = await supabase
    .from('about_sections')
    .insert(section)
    .select('*')
    .single();

  if (error) throw error;
  return data as AboutSection;
}

export async function updateAboutSection(id: string, section: Partial<AboutSection>) {
  const { data, error } = await supabase
    .from('about_sections')
    .update(section)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as AboutSection;
}

export async function deleteAboutSection(id: string) {
  const { error } = await supabase
    .from('about_sections')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Home sections
export async function getHomeSections() {
  const { data, error } = await supabase
    .from('home_sections')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as HomeSection[];
}

export async function getAllHomeSections() {
  const { data, error } = await supabase
    .from('home_sections')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as HomeSection[];
}

// Social links
export async function getSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as SocialLink[];
}

export async function getAllSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as SocialLink[];
}

// Analytics
export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>) {
  const { error } = await supabase
    .from('analytics_events')
    .insert(event);

  if (error) {
    console.error('Analytics tracking error:', error);
  }
}

export async function getAnalytics() {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) throw error;
  return data as AnalyticsEvent[];
}
