/**
 * Production-Ready Next.js Proxy - Complete Security & HIPAA Compliance
 *
 * This proxy provides comprehensive security features for the White Cross
 * healthcare platform including:
 *
 * - JWT authentication with signature verification
 * - Role-based access control (RBAC)
 * - CSRF protection
 * - Security headers (CSP, HSTS, X-Frame-Options, etc.)
 * - Rate limiting (in-memory, Redis-ready)
 * - Audit logging for PHI access
 * - Session timeout enforcement
 * - Request sanitization markers
 * - XSS prevention
 * - CORS configuration
 *
 * @module proxy
 * @since 2025-10-26
 * @version 1.0.0
 *
 * @example Environment Variables Required
 * ```env
 * JWT_SECRET=your-secret-key-here
 * NEXT_PUBLIC_API_URL=http://localhost:3001
 * NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
 * NODE_ENV=production|development
 * ```
 *
 * @example Proxy Execution Flow
 * 1. Security Headers (all requests)
 * 2. CORS/Preflight handling
 * 3. Rate Limiting
 * 4. CSRF Validation (state-changing methods)
 * 5. Authentication Check
 * 6. RBAC Authorization
 * 7. Audit Logging (PHI/Admin routes)
 * 8. Request Sanitization Markers
 */

import { NextResponse, NextRequest } from 'next/server';

// Import modular middleware components
import {
  authMiddleware,
  addUserContextHeaders,
  isPublicRoute,
  type TokenPayload,
} from './middleware/auth';
import { rbacMiddleware } from './middleware/rbac';
import { securityHeadersMiddleware, handlePreflightRequest } from './middleware/security';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { auditMiddleware, requiresPHIAudit, requiresAdminAudit } from './middleware/audit';
import { sanitizeMiddleware } from './middleware/sanitization';
import { getCSRFHeaderName } from './lib/security/csrf';

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
 * CSRF validation for state-changing operations
 */
function validateCSRF(request: NextRequest): boolean {
  const method = request.method;

  // Only validate for state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return true;
  }

  // Skip CSRF for API auth endpoints (they use different protection)
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return true;
  }

  const csrfHeader = request.headers.get(getCSRFHeaderName());
  const csrfCookie = request.cookies.get('csrf_token')?.value;

  // Both must be present and match
  return !!(csrfHeader && csrfCookie && csrfHeader === csrfCookie);
}

/**
 * Main proxy function
 *
 * This function orchestrates all middleware components in the correct order
 * to ensure comprehensive security and compliance.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();

  // ==========================================
  // 1. HANDLE PREFLIGHT (OPTIONS) REQUESTS
  // ==========================================
  const preflightResponse = handlePreflightRequest(request);
  if (preflightResponse) {
    return preflightResponse;
  }

  // ==========================================
  // 2. APPLY SECURITY HEADERS (ALL REQUESTS)
  // ==========================================
  const response = securityHeadersMiddleware(request);

  // ==========================================
  // 3. SKIP MIDDLEWARE FOR STATIC FILES
  // ==========================================
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon' ||
    pathname.startsWith('/icon') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname === '/api/health'
  ) {
    return response;
  }

  // ==========================================
  // 4. RATE LIMITING
  // ==========================================
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) {
    // Apply security headers to error response
    return securityHeadersMiddleware(request, rateLimitResponse);
  }

  // ==========================================
  // 5. CHECK IF PUBLIC ROUTE FIRST
  // ==========================================
  // Public routes don't need CSRF or auth checks
  if (isPublicRoute(pathname)) {
    return response;
  }

  // ==========================================
  // 6. CSRF VALIDATION (for protected routes only)
  // ==========================================
  if (!validateCSRF(request)) {
    console.warn('[PROXY] CSRF validation failed:', pathname);

    const csrfErrorResponse = new NextResponse(
      JSON.stringify({
        error: 'CSRF Validation Failed',
        message: 'Invalid or missing CSRF token',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return securityHeadersMiddleware(request, csrfErrorResponse);
  }

  // ==========================================
  // 7. AUTHENTICATION CHECK (for protected routes only)
  // ==========================================
  const { response: authResponse, payload } = authMiddleware(request);

  // If auth failed, return redirect with security headers
  if (authResponse) {
    return securityHeadersMiddleware(request, authResponse);
  }

  // At this point, user must be authenticated
  if (!payload) {
    console.error('[PROXY] Unexpected: No payload after auth check');
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'internal_error');
    return NextResponse.redirect(loginUrl);
  }

  // ==========================================
  // 8. ADD USER CONTEXT TO HEADERS
  // ==========================================
  const requestHeaders = addUserContextHeaders(request, payload);

  // ==========================================
  // 9. RBAC AUTHORIZATION
  // ==========================================
  // Create new request with user context headers for RBAC check
  const requestWithContext = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });

  const rbacResponse = rbacMiddleware(requestWithContext);
  if (rbacResponse) {
    return securityHeadersMiddleware(request, rbacResponse);
  }

  // ==========================================
  // 10. AUDIT LOGGING
  // ==========================================
  if (requiresPHIAudit(pathname) || requiresAdminAudit(pathname)) {
    auditMiddleware(requestWithContext);
  }

  // ==========================================
  // 11. REQUEST SANITIZATION MARKERS
  // ==========================================
  await sanitizeMiddleware(requestWithContext);

  // ==========================================
  // 12. FINAL RESPONSE
  // ==========================================
  const processingTime = Date.now() - startTime;

  // Log slow requests
  if (processingTime > 100) {
    console.warn(
      `[PROXY] Slow request: ${pathname} took ${processingTime}ms`
    );
  }

  // Return response with updated headers
  const finalResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add processing time header (for monitoring)
  finalResponse.headers.set('X-Middleware-Time', processingTime.toString());

  // Apply security headers to final response
  return securityHeadersMiddleware(request, finalResponse);
}

/**
 * Proxy Configuration
 *
 * Specifies which routes should be protected by this proxy.
 * Excludes Next.js internals and static files for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (static assets)
     * - Static file extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:ico|png|jpg|jpeg|gif|svg|webp)).*)',
  ],
};

/**
 * Export middleware components for testing and reuse
 */
export {
  authMiddleware,
  rbacMiddleware,
  securityHeadersMiddleware,
  rateLimitMiddleware,
  auditMiddleware,
  sanitizeMiddleware,
};
