import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Paths that don't require authentication but are under /admin
const publicAdminPaths = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password'
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public admin paths
  if (publicAdminPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for the auth token cookie
  const token = request.cookies.get('imc_auth_token')?.value;

  // If no token exists, redirect to login
  if (!token) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Verify the token
  const payload = verifyToken(token);

  // If token is invalid or expired, redirect to login
  if (!payload) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('error', 'Session expired. Please log in again.');
    return NextResponse.redirect(url);
  }

  // Role-based Route Authorization Matrix
  const role = payload.role;
  
  if (role !== 'SUPER_ADMIN') {
    // Super Admin only routes
    const superAdminOnlyPaths = ['/admin/users', '/admin/menus', '/admin/settings'];
    if (superAdminOnlyPaths.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
      const url = new URL('/admin', request.url);
      url.searchParams.set('error', 'Access Denied: Super Admin permissions required.');
      return NextResponse.redirect(url);
    }

    if (role === 'COUNSELLOR') {
      // Counsellor cannot access CMS builders, media library, gallery, or site management
      const counsellorRestrictedPaths = [
        '/admin/homepage',
        '/admin/landing-pages',
        '/admin/media',
        '/admin/gallery',
        '/admin/partners',
      ];
      if (counsellorRestrictedPaths.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
        const url = new URL('/admin', request.url);
        url.searchParams.set('error', 'Access Denied: Counsellor role cannot access this module.');
        return NextResponse.redirect(url);
      }
    }

    if (role === 'EDITOR') {
      // Editor cannot access Lead CRM, CMS builders, or site management
      const editorRestrictedPaths = [
        '/admin/leads',
        '/admin/homepage',
        '/admin/landing-pages',
        '/admin/courses',
        '/admin/categories',
        '/admin/faculty',
      ];
      if (editorRestrictedPaths.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
        const url = new URL('/admin', request.url);
        url.searchParams.set('error', 'Access Denied: Editor role cannot access this module.');
        return NextResponse.redirect(url);
      }
    }
  }

  // Pass user info to downstream via headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId.toString());
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-name', payload.name);

  // Return response with modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only match on /admin paths and avoid static files/images
export const config = {
  matcher: ['/admin/:path*'],
};
