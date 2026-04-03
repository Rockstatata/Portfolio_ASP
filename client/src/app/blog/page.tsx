import BlogClient from './BlogClient';
import { getBlogPosts } from '@/lib/database';

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);
  return <BlogClient posts={posts} />;
}
