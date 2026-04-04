import type { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';
import { getExperiences } from '@/lib/database';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Experience | Portfolio',
  description:
    'Explore detailed professional experience, responsibilities, and outcomes.',
};

export default async function ExperiencePage() {
  const experiences = await getExperiences().catch(() => []);
  return <ExperienceClient experiences={experiences} />;
}
