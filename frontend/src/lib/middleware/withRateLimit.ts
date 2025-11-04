/**
 * Rate limiting middleware for Next.js API routes
 * Prevents abuse and protects against DDoS attacks
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import type { RateLimitConfig } from '@/lib/rateLimit';

/**
 * Route handler type
 */
export type RouteHandler = (
  request: NextRequest,
  context: any
) => Promise<NextResponse>;

/**
 * Wrap route handler with rate limiting
 */
export function withRateLimit(config: RateLimitConfig, handler: RouteHandler) {
  return async (request: NextRequest, context: any) => {
    const { limited, remaining, resetTime } = checkRateLimit(request, config);

    if (limited) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetTime).toISOString()
          }
        }
      );
    }

    // Call handler with rate limit headers
    const response = await handler(request, context);

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());

    return response;
  };
}
