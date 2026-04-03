import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminPasskeyGate from '@/components/admin/AdminPasskeyGate';
import { ADMIN_AUTH_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';

type AdminIndexPageProps = {
  searchParams: Promise<{ next?: string }>;
};

function getSafeNextPath(nextPath: string | undefined) {
  if (nextPath && nextPath.startsWith('/admin')) {
    return nextPath;
  }

  return '/admin/dashboard';
}

export default async function AdminIndexPage({ searchParams }: AdminIndexPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  const isAuthorized = await verifyAdminSessionToken(sessionToken);

  if (isAuthorized) {
    redirect('/admin/dashboard');
  }

  const { next } = await searchParams;
  return <AdminPasskeyGate defaultNextPath={getSafeNextPath(next)} />;
}
