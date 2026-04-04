import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiCalendar, FiExternalLink, FiGithub } from 'react-icons/fi';
import AnimatedSection from '@/components/AnimatedSection';
import { getProjectById, getProjects } from '@/lib/database';
import { parseTechStack } from '@/utils/helpers';

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

function clampDescription(value: string, maxLength = 160) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}...`;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id).catch(() => null);

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
    getProjectById(id).catch(() => null),
    getProjects().catch(() => []),
  ]);

  if (!project) {
    notFound();
  }

  const techStack = parseTechStack(project.technologies);
  const descriptionParagraphs = project.description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const relatedProjects = allProjects
    .filter((candidate) => candidate.id !== project.id)
    .slice(0, 3);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm app-link transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to projects
        </Link>

        <AnimatedSection>
          <article className="app-surface p-6 sm:p-8">
            <header>
              <h1 className="text-3xl sm:text-4xl font-bold app-heading">{project.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm app-muted">
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  {project.project_year}
                </span>

                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full app-chip">
                  {project.status}
                </span>
              </div>

              {techStack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {techStack.map((technology) => (
                    <span
                      key={technology}
                      className="app-chip-neutral px-2.5 py-0.5 text-xs font-medium rounded-full"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <div className="mt-7 space-y-4">
              {(descriptionParagraphs.length > 0 ? descriptionParagraphs : [project.description]).map((paragraph) => (
                <p key={paragraph} className="app-muted leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {(project.github_url || project.demo_url) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  >
                    <FiGithub className="w-4 h-4" />
                    View Code
                  </a>
                )}

                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="app-btn-secondary inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  >
                    <FiExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </article>
        </AnimatedSection>

        {relatedProjects.length > 0 && (
          <AnimatedSection delay={0.08} className="mt-8">
            <section className="app-surface p-6 sm:p-8">
              <h2 className="text-xl font-semibold app-heading">More Projects</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedProjects.map((relatedProject) => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="app-surface-soft p-4 rounded-xl transition-all hover:translate-y-[-2px]"
                  >
                    <h3 className="font-medium app-heading">{relatedProject.title}</h3>
                    <p className="mt-1 text-sm app-muted line-clamp-2">
                      {relatedProject.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}