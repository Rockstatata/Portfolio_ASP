import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import TimelineCard from '@/components/TimelineCard';
import SkillBar from '@/components/SkillBar';
import {
  getAboutSections,
  getBlogPosts,
  getExperiences,
  getHomeSections,
  getProjects,
  getSkills,
  getSocialLinks,
  getTimeline,
} from '@/lib/database';
import type { Skill } from '@/types';
import { getSocialIcon } from '@/lib/socialIcons';

function groupSkills(skills: Skill[]) {
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);
}

export default async function HomePage() {
  const [
    homeSections,
    aboutSections,
    skills,
    projects,
    timeline,
    experiences,
    blogPosts,
    socialLinks,
  ] = await Promise.all([
    getHomeSections().catch(() => []),
    getAboutSections().catch(() => []),
    getSkills().catch(() => []),
    getProjects().catch(() => []),
    getTimeline().catch(() => []),
    getExperiences().catch(() => []),
    getBlogPosts().catch(() => []),
    getSocialLinks().catch(() => []),
  ]);

  const groupedSkills = groupSkills(skills);
  const aboutDisplaySections = aboutSections.filter(
    (section) => !section.section_type.toLowerCase().startsWith('strength:'),
  );

  const sortedSections = [...homeSections].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const heroSection = sortedSections.find(
    (section) => section.section_name.toLowerCase() === 'hero',
  );

  const contentSections = sortedSections.filter((section) => section.id !== heroSection?.id);

  const renderSection = (sectionName: string) => {
    const normalizedName = sectionName.toLowerCase();

    if (normalizedName.includes('about')) {
      return (
        <div className="space-y-6">
          {aboutDisplaySections.slice(0, 3).map((section) => (
            <div key={section.id} className="app-surface p-6">
              <h3 className="text-lg font-semibold app-heading">{section.title}</h3>
              {section.subtitle && (
                <p className="text-sm mt-1 app-accent">{section.subtitle}</p>
              )}
              <p className="mt-3 app-muted">{section.content}</p>
            </div>
          ))}
          {aboutDisplaySections.length === 0 && (
            <p className="app-muted">No about content configured.</p>
          )}
        </div>
      );
    }

    if (normalizedName.includes('skill')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="app-surface p-6">
              <h3 className="text-lg font-semibold app-heading mb-4">{category}</h3>
              <div className="space-y-4">
                {categorySkills.map((skill, index) => (
                  <SkillBar key={skill.id} skill={skill} index={index} />
                ))}
              </div>
            </div>
          ))}
          {skills.length === 0 && (
            <p className="app-muted md:col-span-2">No skills configured.</p>
          )}
        </div>
      );
    }

    if (normalizedName.includes('project')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 6).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
          {projects.length === 0 && (
            <p className="app-muted md:col-span-3">No projects configured.</p>
          )}
        </div>
      );
    }

    if (normalizedName.includes('timeline')) {
      return (
        <div className="space-y-6">
          {timeline.map((item, index) => (
            <TimelineCard key={item.id} item={item} index={index} />
          ))}
          {timeline.length === 0 && (
            <p className="app-muted">No timeline entries configured.</p>
          )}
        </div>
      );
    }

    if (normalizedName.includes('experience')) {
      return (
        <div className="space-y-6">
          {experiences.map((experience) => (
            <div key={experience.id} className="app-surface p-6">
              <h3 className="text-lg font-semibold app-heading">{experience.position}</h3>
              <p className="text-sm app-accent">{experience.company} • {experience.duration}</p>
              <p className="mt-3 app-muted">{experience.description}</p>
            </div>
          ))}
          {experiences.length === 0 && (
            <p className="app-muted">No experience entries configured.</p>
          )}
        </div>
      );
    }

    if (normalizedName.includes('blog')) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 6).map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
          {blogPosts.length === 0 && (
            <p className="app-muted md:col-span-3">No blog posts configured.</p>
          )}
        </div>
      );
    }

    if (normalizedName.includes('contact')) {
      return (
        <div className="app-surface p-8 text-center">
          <p className="app-muted mb-6">Manage contact details and social links from the admin panel.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.icon_class);
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full app-icon-button app-surface-soft"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
          <Link
            href="/contact"
            className="app-btn-primary inline-flex items-center gap-2 px-6 py-3 font-medium rounded-full"
          >
            Open Contact Page
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );
    }

    return (
      <div className="app-surface p-8">
        <p className="app-muted">Section content: {sectionName}</p>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mb-16 text-center">
          <p className="text-sm sm:text-base font-medium tracking-wide uppercase mb-4 app-accent">
            {heroSection?.section_name ?? 'Portfolio'}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold app-heading leading-tight">
            {heroSection?.content || 'Content is controlled via the admin panel.'}
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="app-btn-primary inline-flex items-center gap-2 px-8 py-3 font-medium rounded-full"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="app-btn-secondary inline-flex items-center gap-2 px-8 py-3 border-2 font-medium rounded-full hover:border-(--app-accent)"
            >
              Contact
            </Link>
          </div>
        </section>

        {contentSections.map((section) => (
          <section key={section.id} className="mb-16">
            <SectionHeading title={section.section_name} subtitle={section.content} />
            {renderSection(section.section_name)}
          </section>
        ))}

        {contentSections.length === 0 && (
          <p className="text-center app-muted">
            No active home sections found. Add or activate sections from the admin panel.
          </p>
        )}
      </div>
    </div>
  );
}
