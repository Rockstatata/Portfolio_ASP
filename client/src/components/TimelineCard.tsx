'use client';

import { motion } from 'framer-motion';
import { FiBriefcase, FiBook, FiStar } from 'react-icons/fi';
import type { TimelineItem } from '@/types';

interface TimelineCardProps {
  item: TimelineItem;
  index: number;
}

export default function TimelineCard({ item, index }: TimelineCardProps) {
  const isLeft = index % 2 === 0;
  const Icon = item.type === 'work' ? FiBriefcase : item.type === 'education' ? FiBook : FiStar;

  return (
    <div className={`flex items-center gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
      >
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#DC143C' }}>
          {item.year_range}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.location}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
      </motion.div>

      {/* Center dot */}
      <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full items-center justify-center text-white" style={{ backgroundColor: '#DC143C' }}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="hidden md:block flex-1" />
    </div>
  );
}
