import { redirect } from 'next/navigation';

type BlogsAliasDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogsAliasDetailPage({ params }: BlogsAliasDetailPageProps) {
  const { slug } = await params;
  redirect(`/blog/${slug}`);
}
