/**
 * Authentication Middleware
 *
 * Handles JWT token validation and user context extraction.
 * Supports both cookie-based and header-based authentication.
 *
 * @module middleware/auth
 * @since 2025-10-26
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Token payload interface
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
  firstName?: string;
  lastName?: string;
}

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/session-expired',
  '/access-denied',
  '/unauthorized',
  '/404',
  '/500',
];

/**
 * Check if a route is public
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route));
}

/**
 * Decode JWT token (without verification)
 *
 * Note: This is basic decoding only. For production, you should verify
 * the signature using jsonwebtoken library in an API route.
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('[AUTH] Token decode error:', error);
    return null;
  }
}

/**
 * Verify token signature (stub - should be done server-side)
 *
 * In production, use jsonwebtoken.verify() in an API route
 * with proper secret key management.
 */
export function verifyTokenSignature(token: string): boolean {
  // This is a stub. Real verification should happen server-side
  // using jsonwebtoken library with JWT_SECRET
  return true;
}

/**
 * Extract token from request
 */
export function extractToken(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get('auth_token')?.value ||
                      request.cookies.get('token')?.value;

  if (cookieToken) {
    return cookieToken;
  }

  // Try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: TokenPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

/**
 * Authentication middleware
 */
export function authMiddleware(request: NextRequest): {
  response: NextResponse | null;
  payload: TokenPayload | null;
} {
  const { pathname } = request.nextUrl;

  // Skip auth for public routes
  if (isPublicRoute(pathname)) {
    return { response: null, payload: null };
  }

  // Skip auth for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
  ) {
    return { response: null, payload: null };
  }

  // Extract token
  const token = extractToken(request);

  // No token - redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'unauthorized');

    console.warn(`[AUTH] No token found for ${pathname}`);

    return {
      response: NextResponse.redirect(loginUrl),
      payload: null,
    };
  }

  // Decode token
  const payload = decodeToken(token);

  // Invalid token - redirect to login
  if (!payload) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', 'invalid_token');

    console.warn(`[AUTH] Invalid token for ${pathname}`);

    return {
      response: NextResponse.redirect(loginUrl),
      payload: null,
    };
  }

  // Check expiration
  if (isTokenExpired(payload)) {
    const sessionExpiredUrl = new URL('/session-expired', request.url);
    sessionExpiredUrl.searchParams.set('reason', 'token_expired');
    sessionExpiredUrl.searchParams.set('redirect', pathname);

    console.warn(`[AUTH] Token expired for user ${payload.userId}`);

    return {
      response: NextResponse.redirect(sessionExpiredUrl),
      payload: null,
    };
  }

  // Token is valid
  return { response: null, payload };
}

/**
 * Add user context to request headers
 */
export function addUserContextHeaders(
  request: NextRequest,
  payload: TokenPayload
): Headers {
  const headers = new Headers(request.headers);

  headers.set('x-user-id', payload.userId);
  headers.set('x-user-email', payload.email);
  headers.set('x-user-role', payload.role);

  if (payload.firstName) {
    headers.set('x-user-first-name', payload.firstName);
  }
  if (payload.lastName) {
    headers.set('x-user-last-name', payload.lastName);
  }

  return headers;
}
