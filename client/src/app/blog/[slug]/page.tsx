import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiCalendar, FiClock } from 'react-icons/fi';
import PortfolioDetailShell from '@/components/detail/PortfolioDetailShell';
import {
  getPublishedBlogPostByRouteParam,
  getPublishedBlogPosts,
} from '@/lib/publicPortfolio.server';
import { formatDate, parseTags } from '@/utils/helpers';

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-dynamic';

function stripHtml(value: string | null | undefined) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clampDescription(value: string | null | undefined, maxLength = 160) {
  const safeValue = String(value ?? '').trim();
  if (!safeValue) {
    return '';
  }

  if (safeValue.length <= maxLength) {
    return safeValue;
  }

  return `${safeValue.slice(0, maxLength - 1).trimEnd()}...`;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostByRouteParam(slug).catch(() => null);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Portfolio',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: clampDescription(post.excerpt || stripHtml(post.content)),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([
    getPublishedBlogPostByRouteParam(slug).catch(() => null),
    getPublishedBlogPosts().catch(() => []),
  ]);

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.tags || '');
  const content = String(post.content ?? '').trim();
  const hasHtmlContent = /<\/?[a-z][\s\S]*>/i.test(content);

  const textParagraphs = hasHtmlContent
    ? []
    : content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

  const relatedPosts = allPosts
    .filter((candidate) => candidate.id !== post.id)
    .slice(0, 3);

  return (
    <PortfolioDetailShell
      sectionLabel="Blog Article"
      title={post.title}
      subtitle={
        clampDescription(post.excerpt || stripHtml(post.content), 230)
        || 'A practical article from my engineering notes and build logs.'
      }
      backHref="/#blog"
      backLabel="Back To Portfolio"
      meta={(
        <>
          <span className="detail-meta-item">
            <FiCalendar aria-hidden className="h-4 w-4" />
            {post.published_at ? formatDate(post.published_at) : 'Unpublished'}
          </span>
          <span className="detail-meta-item">
            <FiClock aria-hidden className="h-4 w-4" />
            {post.read_time || 1} min read
          </span>
        </>
      )}
    >
      <article className="blog-card detail-surface">
        <div className="blog-content">
          {post.image_url && (
            // image_url values can be local or external URLs configured via admin.
            // Using img keeps rendering resilient without requiring image domain config.
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.image_url}
              alt={post.title}
              className="project-img"
              style={{
                height: 'clamp(220px, 34vw, 380px)',
                borderRadius: '0.8rem',
                marginBottom: '1.25rem',
              }}
              loading="lazy"
            />
          )}

          <div className="blog-tags" style={{ marginBottom: '1rem' }}>
            {tags.map((tag) => (
              <span key={`${post.id}-${tag}`} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>

          {content ? (
            hasHtmlContent ? (
              <div
                className="detail-rich-text"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="detail-rich-text">
                {textParagraphs.map((paragraph, index) => (
                  <p key={`${post.id}-paragraph-${index}`}>{paragraph}</p>
                ))}
              </div>
            )
          ) : (
            <p className="blog-excerpt">No content available for this post yet.</p>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="glass-card detail-surface">
          <div className="blog-content">
            <h2 className="project-title">More Articles</h2>

            <div className="projects-grid" style={{ marginTop: '1.1rem' }}>
              {relatedPosts.map((relatedPost) => {
                const routeParam = relatedPost.slug?.trim() || relatedPost.id;
                return (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${routeParam}`}
                    className="blog-card"
                  >
                    <div className="blog-content">
                      <h3 className="blog-post-title">{relatedPost.title}</h3>
                      <p className="blog-excerpt">
                        {clampDescription(relatedPost.excerpt || stripHtml(relatedPost.content), 145)
                          || 'Read this article for implementation notes and takeaways.'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </PortfolioDetailShell>
  );
}
