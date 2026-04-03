import { getBlogPostBySlug } from '@/lib/database';
import { formatDate, parseTags } from '@/utils/helpers';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import AnimatedSection from '@/components/AnimatedSection';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.tags);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm app-link transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <AnimatedSection>
          <article>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold app-heading">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm app-muted">
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  {post.published_at ? formatDate(post.published_at) : 'Unpublished'}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  {post.read_time} min read
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-full app-chip"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-lg max-w-none prose-headings:text-(--app-text) prose-a:text-(--app-accent)">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-(--app-text) leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </AnimatedSection>
      </div>
    </div>
  );
}
