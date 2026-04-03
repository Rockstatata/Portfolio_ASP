'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                filter === tag
                  ? 'app-filter-btn is-active'
                  : 'app-filter-btn'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="text-center app-muted mt-12">
            No projects found with the selected filter.
          </p>
        )}
      </div>
    </div>
  );
}
