'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Skill } from '@/types';

interface SkillBarProps {
  skill: Skill;
  index: number;
}

const ease = [0.25, 1, 0.5, 1] as [number, number, number, number];

export default function SkillBar({ skill, index }: SkillBarProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05, ease }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium app-heading">{skill.skill_name}</span>
        <motion.span
          className="text-xs app-muted tabular-nums"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3, delay: index * 0.05 + 0.6 }}
        >
          {skill.proficiency}%
        </motion.span>
      </div>
      <div className="h-2 app-progress-track rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.proficiency}%` } : {}}
          transition={{ duration: 0.9, delay: index * 0.05 + 0.2, ease }}
          className="h-full rounded-full app-progress-fill"
        />
      </div>
    </motion.div>
  );
}
