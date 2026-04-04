'use client';

import { useRef, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import type { Project } from '@/types';
import { parseTechStack } from '@/utils/helpers';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const techStack = parseTechStack(project.technologies);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } }}
      onMouseMove={handleMouseMove}
      className="group app-surface app-card-glow overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image placeholder */}
      <div className="h-48 app-surface-soft flex items-center justify-center overflow-hidden">
        <motion.span
          className="text-4xl font-bold"
          style={{ color: 'color-mix(in srgb, var(--app-accent) 22%, transparent)' }}
          whileHover={{ scale: 1.2, rotate: -5 }}
          transition={{ duration: 0.3 }}
        >
          {project.title.charAt(0)}
        </motion.span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold app-heading app-break-anywhere group-hover:text-(--app-accent) transition-colors duration-300">
          <Link href={`/projects/${project.id}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm app-muted line-clamp-3 app-break-anywhere">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.08 + i * 0.04 }}
              className="app-chip px-2.5 py-0.5 text-xs font-medium rounded-full"
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/projects/${project.id}`}
            className="app-link inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            Details
          </Link>
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
