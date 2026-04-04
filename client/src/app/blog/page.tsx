import BlogClient from './BlogClient';
import { getBlogPosts } from '@/lib/database';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);
  return <BlogClient posts={posts} />;
}
