'use client';

import { useRef, type MouseEvent } from 'react';
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
  const routeParam = post.slug?.trim() || post.id;
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } }}
      onMouseMove={handleMouseMove}
      className="group app-surface app-card-glow p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="app-muted flex items-center gap-3 text-sm">
        <time dateTime={post.published_at ?? ''}>
          {post.published_at ? formatDate(post.published_at) : 'Unpublished'}
        </time>
        <span className="flex items-center gap-1">
          <FiClock className="w-3.5 h-3.5" />
          {post.read_time} min read
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold app-heading app-break-anywhere group-hover:text-(--app-accent) transition-colors duration-300">
        <Link href={`/blog/${routeParam}`}>{post.title}</Link>
      </h3>

      <p className="mt-2 app-muted text-sm line-clamp-3 app-break-anywhere">
        {post.excerpt ?? ''}
      </p>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.08 + i * 0.04 }}
            className="app-chip-neutral px-2.5 py-0.5 text-xs font-medium rounded-full"
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <Link
        href={`/blog/${routeParam}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium app-accent hover:underline group/link"
      >
        Read more
        <motion.span
          className="inline-block"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <FiArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </motion.span>
      </Link>
    </motion.article>
  );
}
