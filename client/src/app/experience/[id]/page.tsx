import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiBriefcase, FiClock } from 'react-icons/fi';
import PortfolioDetailShell from '@/components/detail/PortfolioDetailShell';
import {
  getVisibleExperienceById,
  getVisibleExperiences,
} from '@/lib/publicPortfolio.server';

type ExperienceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

function splitResponsibilities(value: string | null | undefined) {
  return String(value ?? '')
    .split(/[\n,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitParagraphs(value: string | null | undefined) {
  return String(value ?? '')
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

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

export async function generateMetadata({
  params,
}: ExperienceDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const experience = await getVisibleExperienceById(id).catch(() => null);

  if (!experience) {
    return {
      title: 'Experience Not Found | Portfolio',
      description: 'The requested experience entry could not be found.',
    };
  }

  return {
    title: `${experience.position} at ${experience.company} | Experience`,
    description: clampDescription(experience.description || experience.duration),
  };
}

export default async function ExperienceDetailPage({
  params,
}: ExperienceDetailPageProps) {
  const { id } = await params;

  const [experience, allExperiences] = await Promise.all([
    getVisibleExperienceById(id).catch(() => null),
    getVisibleExperiences().catch(() => []),
  ]);

  if (!experience) {
    notFound();
  }

  const descriptionParagraphs = splitParagraphs(experience.description);
  const responsibilities = splitResponsibilities(experience.responsibilities);
  const relatedExperiences = allExperiences
    .filter((entry) => entry.id !== experience.id)
    .slice(0, 3);

  return (
    <PortfolioDetailShell
      sectionLabel="Experience Detail"
      title={experience.position}
      subtitle={
        clampDescription(experience.description || experience.duration, 220)
        || 'Responsibilities, delivery impact, and technical ownership for this role.'
      }
      backHref="/#experience"
      backLabel="Back To Portfolio"
      meta={(
        <>
          <span className="detail-meta-item">
            <FiBriefcase aria-hidden className="h-4 w-4" />
            {experience.company}
          </span>
          <span className="detail-meta-item">
            <FiClock aria-hidden className="h-4 w-4" />
            {experience.duration || 'Duration not specified'}
          </span>
          {experience.status && <span className="tag tag-orange">{experience.status}</span>}
        </>
      )}
    >
      <article className="project-card detail-surface">
        <div className="project-content">
          <h2 className="project-title">Role Overview</h2>

          <div className="detail-rich-text">
            {(descriptionParagraphs.length > 0
              ? descriptionParagraphs
              : ['This experience summary will be added soon.']
            ).map((paragraph, index) => (
              <p key={`${experience.id}-description-${index}`}>{paragraph}</p>
            ))}
          </div>

          {responsibilities.length > 0 && (
            <section style={{ marginTop: '1.4rem' }}>
              <h3 className="project-title" style={{ marginBottom: '0.75rem' }}>
                Key Responsibilities
              </h3>

              <ul className="project-tags" style={{ marginBottom: 0 }}>
                {responsibilities.map((item, index) => (
                  <li
                    key={`${experience.id}-responsibility-${index}`}
                    className={`tag ${['tag-blue', 'tag-purple', 'tag-teal', 'tag-cyan'][index % 4]}`}
                    style={{ listStyle: 'none' }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>

      {relatedExperiences.length > 0 && (
        <section className="glass-card detail-surface">
          <div className="project-content">
            <h2 className="project-title">More Experience</h2>

            <div className="projects-grid" style={{ marginTop: '1.1rem' }}>
              {relatedExperiences.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/experience/${entry.id}`}
                  className="project-card"
                >
                  <div className="project-content">
                    <h3 className="project-title">{entry.position}</h3>
                    <p className="project-desc" style={{ marginBottom: '0.4rem' }}>
                      {entry.company}
                    </p>
                    <p className="project-desc">
                      {clampDescription(entry.description || entry.duration, 130)
                        || 'More detail coming soon.'}
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
