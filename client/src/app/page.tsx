import HeroSection from '@/components/HeroSection';
import AnimatedSection from '@/components/AnimatedSection';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import SkillBar from '@/components/SkillBar';
import TimelineCard from '@/components/TimelineCard';
import { sampleProjects, sampleBlogPosts, sampleSkills, sampleTimeline } from '@/data/sampleData';

export default function HomePage() {
  const groupedSkills = sampleSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof sampleSkills>);

  return (
    <>
      <HeroSection />

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeading title="Skills & Expertise" subtitle="Technologies I work with" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <SectionHeading title="My Journey" subtitle="Education and professional experience" />
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />
          <div className="space-y-8">
            {sampleTimeline.map((item, i) => (
              <TimelineCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50/50 dark:bg-gray-900/50">
        <SectionHeading title="Featured Projects" subtitle="Some of my recent work" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.slice(0, 3).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeading title="Latest Posts" subtitle="Thoughts on web development" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBlogPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
