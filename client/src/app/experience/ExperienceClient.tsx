'use client';

import { useMemo, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup, useInView } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import type { Experience } from '@/types';
import { truncateText } from '@/utils/helpers';

type ExperienceClientProps = {
  experiences: Experience[];
};

function parseResponsibilityTags(value: string) {
  return value
    .split(/[\n,;|]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const responsibilityTags = parseResponsibilityTags(experience.responsibilities);
  const cardRef = useRef<HTMLElement>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      onMouseMove={handleMouseMove}
      className="app-surface app-card-glow p-6"
    >
      <div ref={ref} className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold app-heading app-break-anywhere">
            {experience.position}
          </h3>
          <p className="text-sm app-accent mt-1 app-break-anywhere">{experience.company}</p>
        </div>
        {experience.status && (
          <span className="app-chip px-2.5 py-0.5 text-xs font-medium rounded-full">
            {experience.status}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm app-muted">{experience.duration}</p>

      <p className="mt-4 app-muted leading-relaxed">
        {truncateText(experience.description || '', 170)}
      </p>

      {responsibilityTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {responsibilityTags.map((tag, i) => (
            <motion.span
              key={`${experience.id}-${tag}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.06 + i * 0.04 }}
              className="app-chip-neutral px-2.5 py-0.5 text-xs font-medium rounded-full"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      )}

      <div className="mt-5">
        <Link
          href={`/experience/${experience.id}`}
          className="app-link font-medium text-sm hover:underline"
        >
          View full experience
        </Link>
      </div>
    </motion.article>
  );
}

export default function ExperienceClient({ experiences }: ExperienceClientProps) {
  const [filter, setFilter] = useState<string>('All');

  const statusFilters = useMemo(() => {
    const uniqueStatuses = Array.from(
      new Set(
        experiences
          .map((experience) => (experience.status ?? '').trim())
          .filter(Boolean),
      ),
    );

    return ['All', ...uniqueStatuses];
  }, [experiences]);

  const filteredExperiences = useMemo(
    () =>
      filter === 'All'
        ? experiences
        : experiences.filter(
            (experience) => (experience.status ?? '').trim() === filter,
          ),
    [experiences, filter],
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Experience"
          subtitle="Role-by-role breakdown of my professional journey and impact"
        />

        {statusFilters.length > 1 && (
          <LayoutGroup>
            <div className="app-horizontal-scroll mb-10">
              <div className="app-horizontal-scroll-inner sm:justify-center">
                {statusFilters.map((statusValue) => (
                  <button
                    key={statusValue}
                    type="button"
                    onClick={() => setFilter(statusValue)}
                    className={`app-touch-target relative shrink-0 whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      filter === statusValue
                        ? 'text-white'
                        : 'app-filter-btn'
                    }`}
                  >
                    {filter === statusValue && (
                      <motion.div
                        layoutId="exp-filter-active"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: 'var(--app-accent)', boxShadow: '0 10px 24px rgba(220, 20, 60, 0.28)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{statusValue}</span>
                  </button>
                ))}
              </div>
            </div>
          </LayoutGroup>
        )}

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              >
                <ExperienceCard experience={experience} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredExperiences.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center app-muted mt-12"
          >
            No experience entries found for the selected filter.
          </motion.p>
        )}
      </div>
    </div>
  );
}
