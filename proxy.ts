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
  // Authenticated portal users have access to all CMS and CRM admin pages
  const role = payload.role || 'SUPER_ADMIN';

  // Strict role boundary: COUNSELLOR is strictly restricted to Dashboard and Leads
  if (role === 'COUNSELLOR') {
    const isAllowed = 
      pathname === '/admin' || 
      pathname === '/admin/' || 
      pathname.startsWith('/admin/leads');

    if (!isAllowed) {
      return NextResponse.redirect(new URL('/admin/leads', request.url));
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
