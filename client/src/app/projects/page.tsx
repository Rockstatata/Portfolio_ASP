'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import { sampleProjects } from '@/data/sampleData';
import { parseTechStack } from '@/utils/helpers';

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>('All');

  // Get unique tech tags
  const allTechs = Array.from(
    new Set(sampleProjects.flatMap((p) => parseTechStack(p.technologies)))
  );
  const filters = ['All', ...allTechs];

  const filteredProjects = filter === 'All'
    ? sampleProjects
    : sampleProjects.filter((p) => parseTechStack(p.technologies).includes(filter));

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Projects" subtitle="Explore my work across different technologies" />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                filter === f
                  ? 'text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={filter === f ? { backgroundColor: '#DC143C' } : undefined}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-12">
            No projects found with the selected filter.
          </p>
        )}
      </div>
    </div>
  );
}
