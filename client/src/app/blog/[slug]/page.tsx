import { sampleBlogPosts } from '@/data/sampleData';
import { formatDate, parseTags } from '@/utils/helpers';
import Link from 'next/link';
import { FiArrowLeft, FiClock, FiCalendar } from 'react-icons/fi';
import { notFound } from 'next/navigation';
import AnimatedSection from '@/components/AnimatedSection';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sampleBlogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = sampleBlogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const tags = parseTags(post.tags);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#DC143C] transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        <AnimatedSection>
          <article>
            <header className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {post.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  {formatDate(post.published_at)}
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
                    className="px-3 py-1 text-xs font-medium rounded-full bg-red-50 dark:bg-red-900/20 text-[#DC143C]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-[#DC143C]">
              {/* Render content as simple paragraphs for now */}
              {post.content.split('\n\n').map((paragraph) => (
                <p key={paragraph.substring(0, 40)} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
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
