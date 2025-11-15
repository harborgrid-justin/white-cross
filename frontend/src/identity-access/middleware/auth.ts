/**
 * Authentication Middleware for Next.js Proxy
 *
 * Provides authentication middleware functions for the Next.js proxy.
 * Handles JWT token validation, user context injection, and public route checking.
 *
 * @module identity-access/middleware/auth
 * @since 2025-11-04
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyAccessToken, TokenPayload } from '@/lib/auth';

/**
 * Public routes that don't require authentication
 * These routes are accessible without a valid JWT token
 */
const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/session-expired',
  '/access-denied',
  '/unauthorized',
  '/404',
  '/500',
  '/_next',
  '/static',
  '/favicon',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
] as const;

/**
 * Static file extensions that should be skipped
 */
const STATIC_EXTENSIONS = [
  '.ico',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.css',
  '.js',
  '.json',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
] as const;

/**
 * Check if a route is public (doesn't require authentication)
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Check if request is for a static file
 */
function isStaticFile(pathname: string): boolean {
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

/**
 * Authentication middleware function
 * Validates JWT tokens and returns user payload or error response
 */
export function authMiddleware(request: NextRequest): {
  response: NextResponse | null;
  payload: TokenPayload | null;
} {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (isStaticFile(pathname)) {
    return { response: null, payload: null };
  }

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return { response: null, payload: null };
  }

  // Extract token from request
  const token = extractToken(request);

  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    const redirectPath = pathname === '/' ? '/dashboard' : pathname;
    loginUrl.searchParams.set('redirect', redirectPath);
    loginUrl.searchParams.set('error', 'unauthorized');

    console.warn(`[Auth Middleware] No token found for ${pathname}`);

    const response = NextResponse.redirect(loginUrl);
    return { response, payload: null };
  }

  // Verify token
  try {
    const payload = await verifyAccessToken(token);

    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const sessionExpiredUrl = new URL('/session-expired', request.url);
      const redirectPath = pathname === '/' ? '/dashboard' : pathname;
      sessionExpiredUrl.searchParams.set('reason', 'token_expired');
      sessionExpiredUrl.searchParams.set('redirect', redirectPath);

      console.warn(`[Auth Middleware] Token expired for user ${payload.id}`);

      const response = NextResponse.redirect(sessionExpiredUrl);
      return { response, payload: null };
    }

    return { response: null, payload };
  } catch (error) {
    // Invalid token - redirect to login
    const loginUrl = new URL('/login', request.url);
    const redirectPath = pathname === '/' ? '/dashboard' : pathname;
    loginUrl.searchParams.set('redirect', redirectPath);
    loginUrl.searchParams.set('error', 'invalid_token');

    console.warn(`[Auth Middleware] Invalid token for ${pathname}:`, error);

    const response = NextResponse.redirect(loginUrl);
    return { response, payload: null };
  }
}

/**
 * Add user context headers to request
 * These headers are available in API routes and Server Components
 */
export function addUserContextHeaders(
  request: NextRequest,
  payload: TokenPayload
): Headers {
  const headers = new Headers(request.headers);

  headers.set('x-user-id', payload.id);
  headers.set('x-user-email', payload.email);
  headers.set('x-user-role', payload.role);

  return headers;
}

// Re-export TokenPayload for convenience
export type { TokenPayload };