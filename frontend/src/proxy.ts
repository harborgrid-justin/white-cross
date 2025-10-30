/**
 * Next.js Proxy (formerly Middleware) - Production-Ready Security and Authorization
 *
 * Comprehensive proxy for authentication, authorization, rate limiting,
 * and audit logging for HIPAA-compliant healthcare platform.
 *
 * Features:
 * - JWT token verification with signature validation
 * - Role-based access control (RBAC)
 * - Rate limiting (in-memory + Redis-ready)
 * - Audit logging for PHI access
 * - Security headers
 * - Locale detection for i18n
 * - Request ID generation for tracing
 *
 * @module proxy
 * @since 2025-10-26
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractToken, hasRolePermission } from '@/lib/auth/jwtVerifier';
import {
  getRateLimiter,
  getIdentifier,
  getRouteType,
  createRateLimitHeaders,
} from '@/lib/middleware/rateLimiter';
import {
  auditLogger,
  AuditEventType,
  isPHIRoute,
  extractResourceInfo,
} from '@/lib/middleware/auditLogger';

// ==========================================
// CONFIGURATION
// ==========================================

/**
 * Role definitions matching backend RBAC
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  DISTRICT_ADMIN = 'DISTRICT_ADMIN',
  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
  NURSE = 'NURSE',
  STAFF = 'STAFF',
}

/**
 * Route permission configuration
 * Routes require one of the specified roles
 */
const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin': [UserRole.ADMIN, UserRole.DISTRICT_ADMIN],
  '/inventory': [UserRole.ADMIN, UserRole.NURSE, UserRole.SCHOOL_ADMIN],
  '/reports': [UserRole.ADMIN, UserRole.DISTRICT_ADMIN, UserRole.SCHOOL_ADMIN],
  '/settings': [
    UserRole.ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.NURSE,
    UserRole.STAFF,
  ],
};

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/forgot-password',
  '/reset-password',
  '/signup',
  '/verify-email',
  '/health',
  '/_next',
  '/static',
  '/favicon.ico',
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/refresh',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/refresh',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/refresh',
];

/**
 * Routes that should bypass rate limiting
 */
const RATE_LIMIT_BYPASS = ['/health', '/api/health', '/_next', '/static'];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Check if route is public (no auth required)
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Check if user has required role for the requested path
 */
function hasPermission(userRole: UserRole, pathname: string): boolean {
  // Find the matching route pattern
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(route)) {
      return allowedRoles.some((allowedRole) => hasRolePermission(userRole, allowedRole));
    }
  }
  // Default: allow access if no specific permission defined
  return true;
}

/**
 * Generate unique request ID for tracing
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Detect user locale from headers
 */
function detectLocale(request: NextRequest): string {
  // Try accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // Parse accept-language header (e.g., "en-US,en;q=0.9,es;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .filter(Boolean);

    // Return first language or default
    if (languages.length > 0) {
      return languages[0];
    }
  }

  // Default to US English
  return 'en-US';
}

// ==========================================
// MAIN PROXY FUNCTION
// ==========================================

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestId = generateRequestId();

  // Skip proxy for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // ==========================================
  // RATE LIMITING
  // ==========================================

  if (!RATE_LIMIT_BYPASS.some((route) => pathname.startsWith(route))) {
    const routeType = getRouteType(pathname);
    const rateLimiter = getRateLimiter(routeType);

    // Get identifier (IP or user ID if authenticated)
    const identifier = getIdentifier(request);

    // Check rate limit
    const rateLimit = await rateLimiter.check(identifier, pathname);

    if (!rateLimit.allowed) {
      // Log security event
      await auditLogger.logSecurityEvent(
        AuditEventType.RATE_LIMIT_EXCEEDED,
        {
          method: request.method,
          path: pathname,
          headers: request.headers,
        },
        undefined,
        rateLimit.message
      );

      // Return rate limit error
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: rateLimit.message,
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: createRateLimitHeaders(rateLimit),
        }
      );
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  // Extract auth token from cookie or Authorization header
  const token = extractToken(request);

  // Redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const verification = await verifyToken(token);

  if (!verification.valid || !verification.payload) {
    // Log security event
    await auditLogger.logSecurityEvent(
      AuditEventType.INVALID_TOKEN,
      {
        method: request.method,
        path: pathname,
        headers: request.headers,
      },
      undefined,
      verification.error
    );

    // Redirect to login with error
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('error', verification.error || 'invalid_token');
    return NextResponse.redirect(loginUrl);
  }

  const payload = verification.payload;

  // ==========================================
  // AUTHORIZATION (RBAC)
  // ==========================================

  // Check role-based permissions
  if (!hasPermission(payload.role as UserRole, pathname)) {
    // Log access denied
    await auditLogger.log({
      eventType: AuditEventType.ACCESS_DENIED,
      timestamp: new Date().toISOString(),
      requestId,
      userId: payload.userId,
      userRole: payload.role,
      ipAddress:
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      method: request.method,
      path: pathname,
      result: 'DENIED',
    });

    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  // ==========================================
  // PHI ACCESS LOGGING (HIPAA REQUIREMENT)
  // ==========================================

  if (isPHIRoute(pathname)) {
    const { resourceType, resourceId } = extractResourceInfo(pathname);

    // Determine action based on method
    let action: 'VIEW' | 'MODIFY' | 'DELETE' | 'EXPORT' = 'VIEW';
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      action = 'MODIFY';
    } else if (request.method === 'DELETE') {
      action = 'DELETE';
    } else if (pathname.includes('/export')) {
      action = 'EXPORT';
    }

    // Log PHI access
    await auditLogger.logPHIAccess(
      action,
      {
        method: request.method,
        path: pathname,
        headers: request.headers,
      },
      payload.userId,
      payload.role,
      resourceType,
      resourceId || 'list',
      'SUCCESS'
    );
  }

  // ==========================================
  // ADMIN ACTION LOGGING
  // ==========================================

  if (pathname.startsWith('/admin')) {
    await auditLogger.logAdminAction(
      {
        method: request.method,
        path: pathname,
        headers: request.headers,
      },
      payload.userId,
      payload.role,
      `${request.method} ${pathname}`,
      'SUCCESS'
    );
  }

  // ==========================================
  // REQUEST HEADERS
  // ==========================================

  // Create response headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-locale', detectLocale(request));

  // Add organization ID if present
  if (payload.organizationId) {
    requestHeaders.set('x-organization-id', payload.organizationId);
  }

  // ==========================================
  // SECURITY HEADERS
  // ==========================================

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add security headers
  response.headers.set('X-Request-ID', requestId);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Add HSTS header in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

/**
 * Middleware matcher configuration
 * Specify which routes should be protected by this middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - Static files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
