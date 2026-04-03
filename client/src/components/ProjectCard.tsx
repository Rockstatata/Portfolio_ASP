'use client';

import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import type { Project } from '@/types';
import { parseTechStack } from '@/utils/helpers';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const techStack = parseTechStack(project.technologies);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group app-surface overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image placeholder */}
      <div className="h-48 app-surface-soft flex items-center justify-center">
        <span
          className="text-4xl font-bold"
          style={{ color: 'color-mix(in srgb, var(--app-accent) 22%, transparent)' }}
        >
          {project.title.charAt(0)}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold app-heading group-hover:text-(--app-accent) transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-sm app-muted line-clamp-3">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="app-chip px-2.5 py-0.5 text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 flex gap-3">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="app-link inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <FiGithub className="w-4 h-4" />
              Code
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="app-link inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <FiExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
