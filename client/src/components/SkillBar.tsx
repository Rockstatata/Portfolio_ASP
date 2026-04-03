'use client';

import { motion } from 'framer-motion';
import type { Skill } from '@/types';

interface SkillBarProps {
  skill: Skill;
  index: number;
}

export default function SkillBar({ skill, index }: SkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium app-heading">{skill.skill_name}</span>
        <span className="text-xs app-muted">{skill.proficiency}%</span>
      </div>
      <div className="h-2 app-progress-track rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
          className="h-full rounded-full app-progress-fill"
        />
      </div>
    </motion.div>
  );
}
