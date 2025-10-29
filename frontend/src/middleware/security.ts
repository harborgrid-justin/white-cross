/**
 * Security Headers Middleware
 *
 * Implements HIPAA-compliant security headers including CSP, HSTS,
 * X-Frame-Options, and other security best practices.
 *
 * @module middleware/security
 * @since 2025-10-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_HEADERS, generateCSPHeader } from '@/lib/security/config';

/**
 * Apply security headers to response
 */
export function securityHeadersMiddleware(
  request: NextRequest,
  response?: NextResponse
): NextResponse {
  const res = response || NextResponse.next();

  // Apply all security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  // Add additional context-specific headers
  const { pathname } = request.nextUrl;

  // Stricter CSP for admin pages
  if (pathname.startsWith('/admin')) {
    res.headers.set('Content-Security-Policy', generateStrictCSP());
  }

  // Add custom security headers for API routes
  if (pathname.startsWith('/api/')) {
    res.headers.set('X-API-Version', '1.0');
    res.headers.set('X-Request-ID', generateRequestId());
  }

  return res;
}

/**
 * Generate strict CSP for admin pages
 */
function generateStrictCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
}

/**
 * Generate unique request ID for tracking
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate request origin for CORS
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // Same-origin requests don't have Origin header

  const allowedOrigins = process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  return allowedOrigins.includes(origin);
}

/**
 * Add CORS headers if needed
 */
export function addCORSHeaders(request: NextRequest, response: NextResponse): NextResponse {
  const origin = request.headers.get('origin');

  if (origin && validateOrigin(request)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-CSRF-Token, X-Request-ID'
    );
    response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  }

  return response;
}

/**
 * Handle OPTIONS preflight requests
 */
export function handlePreflightRequest(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    return addCORSHeaders(request, response);
  }
  return null;
}
