import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiCalendar, FiExternalLink, FiGithub } from 'react-icons/fi';
import PortfolioDetailShell from '@/components/detail/PortfolioDetailShell';
import { getActiveProjectById, getActiveProjects } from '@/lib/publicPortfolio.server';
import { parseTechStack } from '@/utils/helpers';

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

function clampDescription(value: string | null | undefined, maxLength = 160) {
  const safeValue = String(value ?? '').trim();
  if (!safeValue) {
    return '';
  }

  if (safeValue.length <= maxLength) {
    return safeValue;
  }

  return `${safeValue.slice(0, maxLength - 1).trimEnd()}...`;
}

function splitParagraphs(value: string | null | undefined) {
  return String(value ?? '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getActiveProjectById(id).catch(() => null);

  if (!project) {
    return {
      title: 'Project Not Found | Portfolio',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${project.title} | Projects`,
    description: clampDescription(project.description),
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  const [project, allProjects] = await Promise.all([
    getActiveProjectById(id).catch(() => null),
    getActiveProjects().catch(() => []),
  ]);

  if (!project) {
    notFound();
  }

  const technologies = parseTechStack(project.technologies || '');
  const descriptionParagraphs = splitParagraphs(project.description);
  const relatedProjects = allProjects
    .filter((candidate) => candidate.id !== project.id)
    .slice(0, 3);

  return (
    <PortfolioDetailShell
      sectionLabel="Project Deep Dive"
      title={project.title}
      subtitle={
        clampDescription(project.description, 220)
        || 'A closer look at implementation decisions, architecture, and outcomes.'
      }
      backHref="/#projects"
      backLabel="Back To Portfolio"
      meta={(
        <>
          <span className="detail-meta-item">
            <FiCalendar aria-hidden className="h-4 w-4" />
            {project.project_year}
          </span>
          <span className="tag tag-red">{project.status || 'active'}</span>
        </>
      )}
    >
      <article className="project-card detail-surface">
        <div className="project-content">
          <h2 className="project-title">Project Overview</h2>

          <div className="detail-rich-text">
            {(descriptionParagraphs.length > 0
              ? descriptionParagraphs
              : ['This project description will be updated soon.']
            ).map((paragraph, index) => (
              <p key={`${project.id}-paragraph-${index}`}>{paragraph}</p>
            ))}
          </div>

          {technologies.length > 0 && (
            <div className="project-tags" style={{ marginTop: '1.25rem' }}>
              {technologies.map((technology, index) => (
                <span
                  key={`${project.id}-${technology}`}
                  className={`tag ${['tag-blue', 'tag-orange', 'tag-teal', 'tag-red'][index % 4]}`}
                >
                  {technology}
                </span>
              ))}
            </div>
          )}

          {(project.github_url || project.demo_url) && (
            <div className="project-actions" style={{ marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  <FiGithub aria-hidden className="btn-icon" />
                  Source Code
                </a>
              )}

              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                >
                  <FiExternalLink aria-hidden className="btn-icon" />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </article>

      {relatedProjects.length > 0 && (
        <section className="glass-card detail-surface">
          <div className="project-content">
            <h2 className="project-title">More Projects</h2>

            <div className="projects-grid" style={{ marginTop: '1.1rem' }}>
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.id}`}
                  className="project-card"
                >
                  <div className="project-content">
                    <h3 className="project-title">{relatedProject.title}</h3>
                    <p className="project-desc">
                      {clampDescription(relatedProject.description, 140)
                        || 'Project description coming soon.'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PortfolioDetailShell>
  );
}
