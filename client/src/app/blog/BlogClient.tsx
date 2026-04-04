'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import BlogCard from '@/components/BlogCard';
import type { BlogPost } from '@/types';
import { parseTags } from '@/utils/helpers';
import { FiSearch } from 'react-icons/fi';

type BlogClientProps = {
  posts: BlogPost[];
};

export default function BlogClient({ posts }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => parseTags(post.tags)))),
    [posts],
  );

  const tags = useMemo(() => ['All', ...allTags], [allTags]);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const excerpt = post.excerpt ?? '';
        const matchesSearch =
          searchQuery.length === 0
          || post.title.toLowerCase().includes(searchQuery.toLowerCase())
          || excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag =
          selectedTag === 'All' || parseTags(post.tags).includes(selectedTag);
        return matchesSearch && matchesTag;
      }),
    [posts, searchQuery, selectedTag],
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Blog" subtitle="Thoughts, tutorials, and insights" />

        <div className="w-full max-w-xl mx-auto mb-8">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 app-muted" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="app-input w-full pl-11 pr-4 py-3 rounded-full"
            />
          </motion.div>
        </div>

        <LayoutGroup>
          <div className="app-horizontal-scroll mb-12">
            <div className="app-horizontal-scroll-inner sm:justify-center">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`app-touch-target relative shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedTag === tag
                      ? 'text-white'
                      : 'app-filter-btn'
                  }`}
                >
                  {selectedTag === tag && (
                    <motion.div
                      layoutId="blog-filter-active"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: 'var(--app-accent)', boxShadow: '0 10px 24px rgba(220, 20, 60, 0.28)' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </LayoutGroup>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              >
                <BlogCard post={post} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredPosts.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center app-muted mt-12"
          >
            No blog posts found matching your search.
          </motion.p>
        )}
      </div>
    </div>
  );
}
