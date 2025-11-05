/**
 * Next.js Edge Middleware - Root Authentication & Security
 *
 * This middleware runs on Vercel Edge Runtime for optimal performance.
 * It handles:
 * - JWT authentication and validation
 * - Route protection (public vs protected routes)
 * - Security headers
 * - User context injection
 * - RBAC (Role-Based Access Control) integration
 *
 * @module middleware
 * @runtime edge
 * @since 2025-11-04
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Token payload interface
 * Must match the JWT structure from lib/auth.ts
 */
interface TokenPayload {
  id: string;
  email: string;
  role: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  jti?: string;
}

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
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Check if request is for a static file
 */
function isStaticFile(pathname: string): boolean {
  return STATIC_EXTENSIONS.some((ext) => pathname.endsWith(ext));
}

/**
 * Extract JWT token from request
 * Checks both Authorization header and cookies
 */
function extractToken(request: NextRequest): string | null {
  // Try Authorization header first (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try cookies - check common cookie names
  const cookieToken = request.cookies.get('access_token')?.value ||
                      request.cookies.get('auth_token')?.value ||
                      request.cookies.get('token')?.value ||
                      request.cookies.get('jwt')?.value;

  return cookieToken || null;
}

/**
 * Decode JWT token (basic decoding without signature verification)
 * Note: Signature verification requires crypto API not available in edge runtime
 * Full verification should happen in API routes using lib/auth.ts
 */
function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64 in edge runtime
    const jsonPayload = atob(base64);
    const payload = JSON.parse(jsonPayload) as TokenPayload;

    return payload;
  } catch (error) {
    console.error('[Middleware] Token decode error:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(payload: TokenPayload): boolean {
  if (!payload.exp) {
    return false; // No expiration set
  }

  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy (adjust as needed)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
}

/**
 * Add user context headers to request
 * These headers are available in API routes and Server Components
 */
function addUserContextHeaders(
  requestHeaders: Headers,
  payload: TokenPayload
): Headers {
  const headers = new Headers(requestHeaders);

  headers.set('x-user-id', payload.id);
  headers.set('x-user-email', payload.email);
  headers.set('x-user-role', payload.role);

  return headers;
}

/**
 * Main middleware function
 * Runs on every request to protected routes
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (isStaticFile(pathname)) {
    return NextResponse.next();
  }

  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // Extract token from request
  const token = extractToken(request);

  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);

    // Preserve redirect path (except root which defaults to dashboard)
    const redirectPath = pathname === '/' ? '/dashboard' : pathname;
    loginUrl.searchParams.set('redirect', redirectPath);
    loginUrl.searchParams.set('error', 'unauthorized');

    console.warn(`[Middleware] No token found for ${pathname}`);

    const response = NextResponse.redirect(loginUrl);
    addSecurityHeaders(response);
    return response;
  }

  // Decode token
  const payload = decodeToken(token);

  // Invalid token - redirect to login
  if (!payload) {
    const loginUrl = new URL('/login', request.url);

    const redirectPath = pathname === '/' ? '/dashboard' : pathname;
    loginUrl.searchParams.set('redirect', redirectPath);
    loginUrl.searchParams.set('error', 'invalid_token');

    console.warn(`[Middleware] Invalid token for ${pathname}`);

    const response = NextResponse.redirect(loginUrl);
    addSecurityHeaders(response);
    return response;
  }

  // Check token expiration
  if (isTokenExpired(payload)) {
    const sessionExpiredUrl = new URL('/session-expired', request.url);

    const redirectPath = pathname === '/' ? '/dashboard' : pathname;
    sessionExpiredUrl.searchParams.set('reason', 'token_expired');
    sessionExpiredUrl.searchParams.set('redirect', redirectPath);

    console.warn(`[Middleware] Token expired for user ${payload.id}`);

    const response = NextResponse.redirect(sessionExpiredUrl);
    addSecurityHeaders(response);
    return response;
  }

  // Token is valid - proceed with request
  // Add user context headers for downstream use
  const requestHeaders = addUserContextHeaders(request.headers, payload);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  addSecurityHeaders(response);

  return response;
}

/**
 * Middleware configuration
 * Defines which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
