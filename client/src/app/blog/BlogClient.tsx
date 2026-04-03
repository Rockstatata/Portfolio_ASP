'use client';

import { useMemo, useState } from 'react';
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

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 app-muted" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="app-input w-full pl-11 pr-4 py-3 rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                selectedTag === tag
                  ? 'app-filter-btn is-active'
                  : 'app-filter-btn'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <p className="text-center app-muted mt-12">
            No blog posts found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
