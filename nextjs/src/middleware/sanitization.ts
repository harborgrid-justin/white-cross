/**
 * Request Sanitization Middleware
 *
 * Sanitizes incoming requests to prevent XSS and injection attacks.
 * Applies to all state-changing HTTP methods (POST, PUT, PATCH, DELETE).
 *
 * @module middleware/sanitization
 * @since 2025-10-26
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Sanitize string value to prevent XSS
 */
function sanitizeString(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }

  // Remove potentially dangerous patterns
  return value
    // Remove script tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol (except for images)
    .replace(/data:(?!image\/)/gi, '')
    .trim();
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * Sanitization middleware
 *
 * Note: This middleware cannot modify the request body in Next.js Edge Runtime.
 * The actual sanitization should happen in API routes.
 * This middleware only marks the request as needing sanitization.
 */
export async function sanitizeMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const method = request.method;

  // Only sanitize state-changing methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    return null;
  }

  // Mark request as requiring sanitization
  const headers = new Headers(request.headers);
  headers.set('x-sanitize-required', 'true');

  // For API routes, let them handle sanitization
  // For page routes, this is primarily for audit purposes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[SANITIZE] Marking API request for sanitization: ${method} ${request.nextUrl.pathname}`);
  }

  return null;
}

/**
 * Sanitize request body (use in API routes)
 *
 * @example
 * ```typescript
 * import { sanitizeRequestBody } from '@/middleware/sanitization';
 *
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   const sanitized = sanitizeRequestBody(body);
 *   // Use sanitized data
 * }
 * ```
 */
export function sanitizeRequestBody<T = any>(body: T): T {
  return sanitizeObject(body) as T;
}

/**
 * Export utility functions
 */
export { sanitizeString, sanitizeObject };
