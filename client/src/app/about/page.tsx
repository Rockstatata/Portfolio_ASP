import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import SkillBar from '@/components/SkillBar';
import { getAboutSections, getExperiences, getSkills } from '@/lib/database';
import type { Skill } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'Learn more about my background, skills, and professional experience.',
};

function getStrengthCategory(sectionType: string) {
  const normalized = sectionType.toLowerCase();
  if (!normalized.startsWith('strength:')) {
    return null;
  }

  const key = normalized.replace('strength:', '').replace(/_/g, ' ').trim();
  return key ? key.replace(/\b\w/g, (char) => char.toUpperCase()) : 'Strengths';
}

export default async function AboutPage() {
  const [aboutSections, skills, experiences] = await Promise.all([
    getAboutSections().catch(() => []),
    getSkills().catch(() => []),
    getExperiences().catch(() => []),
  ]);

  const regularAboutSections = aboutSections.filter(
    (section) => getStrengthCategory(section.section_type) === null,
  );

  const strengthSections = aboutSections
    .map((section) => ({
      section,
      category: getStrengthCategory(section.section_type),
    }))
    .filter((item): item is { section: typeof aboutSections[number]; category: string } => item.category !== null);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        <div className="space-y-8 mb-16">
          {regularAboutSections.map((section, i) => (
            <AnimatedSection key={section.id} delay={i * 0.1}>
              <div className="app-surface p-8">
                <h3 className="text-xl font-semibold app-heading">{section.title}</h3>
                {section.subtitle && (
                  <p className="text-sm mt-1 app-accent">{section.subtitle}</p>
                )}
                <p className="mt-4 app-muted leading-relaxed">{section.content}</p>
              </div>
            </AnimatedSection>
          ))}
          {regularAboutSections.length === 0 && (
            <p className="app-muted text-center">No about sections available yet.</p>
          )}
        </div>

        {strengthSections.length > 0 && (
          <>
            <SectionHeading title="Strengths & Interests" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {strengthSections.map(({ section, category }, i) => (
                <AnimatedSection key={section.id} delay={i * 0.08}>
                  <div className="app-surface p-6">
                    <p className="text-xs font-semibold uppercase tracking-wide app-accent">
                      {category}
                    </p>
                    <h3 className="text-lg font-semibold app-heading mt-2">
                      {section.title}
                    </h3>
                    <p className="mt-3 app-muted leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </>
        )}

        <SectionHeading title="Technical Skills" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <AnimatedSection key={category} className="app-surface p-6">
              <h3 className="text-lg font-semibold app-heading mb-4">{category}</h3>
              <div className="space-y-4">
                {categorySkills.map((skill, i) => (
                  <SkillBar key={skill.id} skill={skill} index={i} />
                ))}
              </div>
            </AnimatedSection>
          ))}
          {skills.length === 0 && (
            <p className="app-muted text-center md:col-span-2">No skills available yet.</p>
          )}
        </div>

        <SectionHeading title="Experience" />
        <div className="space-y-6">
          {experiences.map((experience, i) => (
            <AnimatedSection key={experience.id} delay={i * 0.1}>
              <div className="app-surface p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold app-heading">{experience.position}</h3>
                    <p className="text-sm app-accent">{experience.company}</p>
                  </div>
                  <span className="text-sm app-muted mt-1 sm:mt-0">{experience.duration}</span>
                </div>
                <p className="mt-3 app-muted">{experience.description}</p>
                {experience.responsibilities && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {experience.responsibilities.split(',').map((responsibility) => (
                      <span key={responsibility.trim()} className="px-2.5 py-0.5 text-xs font-medium rounded-full app-chip">
                        {responsibility.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Link
                    href={`/experience/${experience.id}`}
                    className="text-sm font-medium app-link hover:underline"
                  >
                    View full experience
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
          {experiences.length === 0 && (
            <p className="app-muted text-center">No experience entries available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
