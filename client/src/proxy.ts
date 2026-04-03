import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ADMIN_AUTH_COOKIE, verifyAdminSessionToken } from '@/lib/adminAuth';
import { updateSession } from '@/utils/supabase/middleware';

function isUnprotectedAdminPath(pathname: string) {
  return pathname === '/admin' || pathname === '/admin/login';
}

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return supabaseResponse;
  }

  if (isUnprotectedAdminPath(pathname)) {
    return supabaseResponse;
  }

  const sessionToken = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  const hasValidSession = await verifyAdminSessionToken(sessionToken);
  if (hasValidSession) {
    return supabaseResponse;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin';
  loginUrl.search = '';
  loginUrl.searchParams.set('next', `${pathname}${search}`);

  const redirectResponse = NextResponse.redirect(loginUrl);
  supabaseResponse.cookies.getAll().forEach(({ name, value }) => {
    redirectResponse.cookies.set(name, value);
  });

  return redirectResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
