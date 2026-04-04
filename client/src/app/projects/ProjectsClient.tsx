'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/types';
import { parseTechStack } from '@/utils/helpers';

type ProjectsClientProps = {
  projects: Project[];
};

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [filter, setFilter] = useState<string>('All');

  const allTechs = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => parseTechStack(project.technologies)))),
    [projects],
  );

  const filters = useMemo(() => ['All', ...allTechs], [allTechs]);

  const filteredProjects = useMemo(
    () =>
      filter === 'All'
        ? projects
        : projects.filter((project) => parseTechStack(project.technologies).includes(filter)),
    [filter, projects],
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Projects" subtitle="Explore my work across different technologies" />

        <LayoutGroup>
          <div className="app-horizontal-scroll mb-12">
            <div className="app-horizontal-scroll-inner sm:justify-center">
              {filters.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`app-touch-target relative shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    filter === tag
                      ? 'text-white'
                      : 'app-filter-btn'
                  }`}
                >
                  {filter === tag && (
                    <motion.div
                      layoutId="project-filter-active"
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
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center app-muted mt-12"
          >
            No projects found with the selected filter.
          </motion.p>
        )}
      </div>
    </div>
  );
}
