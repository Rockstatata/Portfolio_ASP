import type { Metadata } from 'next';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import SkillBar from '@/components/SkillBar';
import { sampleAboutSections, sampleSkills, sampleExperiences } from '@/data/sampleData';

export const metadata: Metadata = {
  title: 'About | Portfolio',
  description: 'Learn more about my background, skills, and professional experience.',
};

export default function AboutPage() {
  const groupedSkills = sampleSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof sampleSkills>);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        {/* About sections */}
        <div className="space-y-8 mb-16">
          {sampleAboutSections.map((section, i) => (
            <AnimatedSection key={section.id} delay={i * 0.1}>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{section.title}</h3>
                {section.subtitle && (
                  <p className="text-sm mt-1" style={{ color: '#DC143C' }}>{section.subtitle}</p>
                )}
                <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Skills */}
        <SectionHeading title="Technical Skills" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <AnimatedSection key={category} className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{category}</h3>
              <div className="space-y-4">
                {skills.map((skill, i) => (
                  <SkillBar key={skill.id} skill={skill} index={i} />
                ))}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Experience */}
        <SectionHeading title="Experience" />
        <div className="space-y-6">
          {sampleExperiences.map((exp, i) => (
            <AnimatedSection key={exp.id} delay={i * 0.1}>
              <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.position}</h3>
                    <p className="text-sm" style={{ color: '#DC143C' }}>{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{exp.duration}</span>
                </div>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{exp.description}</p>
                {exp.responsibilities && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.responsibilities.split(',').map((r) => (
                      <span key={r.trim()} className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-50 dark:bg-red-900/20 text-[#DC143C]">
                        {r.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
