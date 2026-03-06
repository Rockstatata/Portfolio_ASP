'use client';

import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import BlogCard from '@/components/BlogCard';
import { sampleBlogPosts } from '@/data/sampleData';
import { parseTags } from '@/utils/helpers';
import { FiSearch } from 'react-icons/fi';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = Array.from(
    new Set(sampleBlogPosts.flatMap((p) => parseTags(p.tags)))
  );
  const tags = ['All', ...allTags];

  const filteredPosts = sampleBlogPosts.filter((post) => {
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || parseTags(post.tags).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Blog" subtitle="Thoughts, tutorials, and insights" />

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#DC143C] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                selectedTag === tag
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={selectedTag === tag ? { backgroundColor: '#DC143C' } : undefined}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Blog cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-12">
            No blog posts found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
