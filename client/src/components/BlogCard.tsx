'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import type { BlogPost } from '@/types';
import { formatDate, parseTags } from '@/utils/helpers';

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const tags = parseTags(post.tags);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        <span className="flex items-center gap-1">
          <FiClock className="w-3.5 h-3.5" />
          {post.read_time} min read
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#DC143C] transition-colors">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>

      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
        {post.excerpt}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#DC143C] hover:underline"
      >
        Read more
        <FiArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.article>
  );
}
