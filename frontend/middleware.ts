/**
 * Next.js Middleware Entry Point - COMPLETE PASS THROUGH
 *
 * This middleware is configured for complete pass-through with minimal processing.
 * All authentication, rate limiting, and security checks are bypassed for development.
 * The middleware function is optimized to do absolutely nothing but pass requests through.
 *
 * @module middleware
 * @since 2025-10-31
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js middleware function that processes incoming requests.
 *
 * Currently configured as a complete pass-through with no processing for development purposes.
 * In production, this could be extended to handle:
 * - Authentication and authorization checks
 * - Rate limiting and security validations
 * - Request logging and monitoring
 * - Header manipulation and rewrites
 *
 * @param {NextRequest} request - The incoming Next.js request object
 * @returns {NextResponse} Pass-through response allowing request to continue
 *
 * @example
 * ```typescript
 * // Automatically called by Next.js for all requests
 * // Currently returns NextResponse.next() for all routes
 * ```
 *
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
export default function middleware(request: NextRequest): NextResponse {
  // Immediate pass-through with no processing
  return NextResponse.next();
}

// Completely disable middleware by not exporting config
// This removes the middleware from the request pipeline entirely
// export const config = {
//   matcher: [],
// };
