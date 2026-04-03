import ProjectsClient from './ProjectsClient';
import { getProjects } from '@/lib/database';

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);
  return <ProjectsClient projects={projects} />;
}
