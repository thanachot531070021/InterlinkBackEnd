/**
 * Next.js Middleware for Authentication
 * Protects admin routes and redirects to login if not authenticated
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ['/signin', '/signup', '/error-404'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If accessing admin routes without token, redirect to login
  if (pathname.startsWith('/admin') && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/signin';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If accessing login page with token, redirect to dashboard
  if (isPublicPath && token && pathname.startsWith('/signin')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
