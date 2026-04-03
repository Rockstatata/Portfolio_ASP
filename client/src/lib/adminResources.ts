export type AdminResourceConfig = {
  table: string;
  orderColumn: string;
  ascending?: boolean;
};

export const ADMIN_RESOURCE_CONFIG: Record<string, AdminResourceConfig> = {
  projects: {
    table: 'projects',
    orderColumn: 'display_order',
    ascending: true,
  },
  blogs: {
    table: 'blog_posts',
    orderColumn: 'created_at',
    ascending: false,
  },
  messages: {
    table: 'messages',
    orderColumn: 'created_at',
    ascending: false,
  },
  skills: {
    table: 'skills',
    orderColumn: 'display_order',
    ascending: true,
  },
  timeline: {
    table: 'timeline',
    orderColumn: 'display_order',
    ascending: true,
  },
  experiences: {
    table: 'experiences',
    orderColumn: 'display_order',
    ascending: true,
  },
  about: {
    table: 'about_sections',
    orderColumn: 'display_order',
    ascending: true,
  },
  home: {
    table: 'home_sections',
    orderColumn: 'display_order',
    ascending: true,
  },
  social: {
    table: 'social_links',
    orderColumn: 'display_order',
    ascending: true,
  },
};
