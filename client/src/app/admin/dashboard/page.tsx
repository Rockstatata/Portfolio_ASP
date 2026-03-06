'use client';

import { motion } from 'framer-motion';
import { FiFolder, FiFileText, FiMail, FiEye } from 'react-icons/fi';
import { sampleProjects, sampleBlogPosts } from '@/data/sampleData';

const stats = [
  { label: 'Projects', value: sampleProjects.length, icon: FiFolder, color: '#DC143C' },
  { label: 'Blog Posts', value: sampleBlogPosts.length, icon: FiFileText, color: '#2563eb' },
  { label: 'Messages', value: 12, icon: FiMail, color: '#16a34a' },
  { label: 'Page Views', value: 1234, icon: FiEye, color: '#9333ea' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {sampleProjects.slice(0, 3).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{project.technologies}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Blog Posts</h2>
          <div className="space-y-4">
            {sampleBlogPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{post.tags}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  post.status === 'published'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
