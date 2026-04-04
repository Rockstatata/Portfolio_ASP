import { redirect } from 'next/navigation';

type ExperiencesAliasDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ExperiencesAliasDetailPage({
  params,
}: ExperiencesAliasDetailPageProps) {
  const { id } = await params;
  redirect(`/experience/${id}`);
}
