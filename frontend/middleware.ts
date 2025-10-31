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

// Complete pass-through middleware - no processing at all
export default function middleware(request: NextRequest) {
  // Immediate pass-through with no processing
  return NextResponse.next();
}

// Completely disable middleware by not exporting config
// This removes the middleware from the request pipeline entirely
// export const config = {
//   matcher: [],
// };
