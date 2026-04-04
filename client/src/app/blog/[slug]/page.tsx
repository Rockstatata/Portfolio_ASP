import type { Metadata } from 'next';
import { getBlogPostById, getBlogPostBySlug, getBlogPosts } from '@/lib/database';
import { formatDate, parseTags } from '@/utils/helpers';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import AnimatedSection from '@/components/AnimatedSection';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

async function getBlogPostByRouteParam(slugOrId: string) {
  const bySlug = await getBlogPostBySlug(slugOrId).catch(() => null);
  if (bySlug) {
    return bySlug;
  }

  return getBlogPostById(slugOrId).catch(() => null);
}

function clampDescription(value: string, maxLength = 160) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostByRouteParam(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Portfolio',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: clampDescription(post.excerpt || post.content),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([
    getBlogPostByRouteParam(slug),
    getBlogPosts().catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.tags);
  const relatedPosts = allPosts
    .filter((candidate) => candidate.id !== post.id)
    .slice(0, 3);

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

            {post.image_url && (
              // image_url values can be local or external URLs configured via admin.
              // Using img keeps rendering resilient without requiring image domain config.
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full rounded-xl border mb-8"
                style={{ borderColor: 'var(--app-border)' }}
                loading="lazy"
              />
            )}

            <div className="prose prose-lg max-w-none prose-headings:text-(--app-text) prose-a:text-(--app-accent)">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-(--app-text) leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </AnimatedSection>

        {relatedPosts.length > 0 && (
          <AnimatedSection delay={0.08} className="mt-8">
            <section className="app-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold app-heading">More Articles</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => {
                  const routeParam = relatedPost.slug?.trim() || relatedPost.id;
                  return (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${routeParam}`}
                      className="app-surface-soft p-4 rounded-xl transition-all hover:translate-y-[-2px]"
                    >
                      <h3 className="font-medium app-heading">{relatedPost.title}</h3>
                      <p className="mt-1 text-sm app-muted line-clamp-3">
                        {relatedPost.excerpt || relatedPost.content}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
