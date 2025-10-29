/**
 * Example Usage for withRateLimit Middleware
 *
 * This file demonstrates various ways to use the rate limiting middleware
 * in Next.js App Router API routes.
 *
 * @module middleware/withRateLimit.example
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withRateLimit,
  withUserRateLimit,
  withIPRateLimit,
  RateLimitPresets,
} from './withRateLimit';

/**
 * Example 1: Basic usage with default (standard) tier
 * Applies 60 requests per minute rate limit
 */
export const GET = withRateLimit(async (request: NextRequest) => {
  return NextResponse.json({ message: 'Success with default rate limits' });
});

/**
 * Example 2: Authentication endpoint with strict limits
 * Applies 5 requests per 15 minutes for login attempts
 */
export const POST_LOGIN = withRateLimit(
  async (request: NextRequest) => {
    const body = await request.json();
    // ... authentication logic
    return NextResponse.json({ token: 'jwt-token-here' });
  },
  RateLimitPresets.auth()
);

/**
 * Example 3: Admin endpoint with moderate limits
 * Applies 30 requests per minute
 */
export const POST_ADMIN = withRateLimit(
  async (request: NextRequest) => {
    // ... admin operation
    return NextResponse.json({ message: 'Admin operation completed' });
  },
  RateLimitPresets.admin()
);

/**
 * Example 4: Custom rate limit configuration
 * 10 requests per minute with custom message
 */
export const POST_CUSTOM = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ message: 'Custom rate limit applied' });
  },
  {
    config: {
      windowMs: 60000, // 1 minute
      maxRequests: 10,
      message: 'You have exceeded the custom rate limit for this endpoint.',
    },
  }
);

/**
 * Example 5: Rate limiting with custom identifier (API key)
 */
export const GET_API_KEY = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ data: 'protected by API key rate limit' });
  },
  {
    tier: 'standard',
    getIdentifier: (req) => {
      const apiKey = req.headers.get('x-api-key');
      return apiKey || 'unknown';
    },
  }
);

/**
 * Example 6: Skip rate limiting for internal requests
 */
export const GET_INTERNAL = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ message: 'May bypass rate limit for internal' });
  },
  {
    tier: 'standard',
    skipRateLimit: (req) => {
      // Skip rate limiting if request is from internal service
      const internalHeader = req.headers.get('x-internal-service');
      return internalHeader === 'true';
    },
  }
);

/**
 * Example 7: Custom error response handler
 */
export const POST_CUSTOM_ERROR = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ message: 'Success' });
  },
  {
    tier: 'standard',
    onRateLimitExceeded: (req, resetTime) => {
      return NextResponse.json(
        {
          error: 'Custom Rate Limit Error',
          message: 'You have made too many requests to this endpoint.',
          resetTime: new Date(resetTime).toISOString(),
          contactSupport: 'support@example.com',
        },
        { status: 429 }
      );
    },
  }
);

/**
 * Example 8: User-specific rate limiting (requires authentication)
 * Rate limits are applied per user ID from JWT token
 */
export const GET_USER_SPECIFIC = withUserRateLimit(async (request: NextRequest) => {
  // This will automatically extract user ID from Authorization header
  return NextResponse.json({ message: 'User-specific rate limit applied' });
});

/**
 * Example 9: IP-based rate limiting only
 * Ignores user authentication and rate limits by IP address
 */
export const GET_IP_ONLY = withIPRateLimit(async (request: NextRequest) => {
  return NextResponse.json({ message: 'IP-based rate limit applied' });
});

/**
 * Example 10: Very strict rate limiting for sensitive operations
 * 1 request per minute
 */
export const POST_SENSITIVE = withRateLimit(
  async (request: NextRequest) => {
    // ... sensitive operation (e.g., password reset)
    return NextResponse.json({ message: 'Sensitive operation completed' });
  },
  RateLimitPresets.strict()
);

/**
 * Example 11: Generous rate limits for public/read-only endpoints
 * 300 requests per minute
 */
export const GET_PUBLIC = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ message: 'Public data' });
  },
  RateLimitPresets.generous()
);

/**
 * Example 12: Elevated rate limits for premium users
 * 120 requests per minute
 */
export const GET_PREMIUM = withRateLimit(
  async (request: NextRequest) => {
    return NextResponse.json({ message: 'Premium content' });
  },
  RateLimitPresets.elevated()
);

/**
 * Example 13: Dynamic route with rate limiting and route params
 */
export const GET_DYNAMIC = withRateLimit(
  async (request: NextRequest, context?: { params?: Record<string, string | string[]> }) => {
    const params = context?.params;
    const id = params && 'id' in params ? params.id : undefined;
    return NextResponse.json({ id, message: 'Dynamic route with rate limit' });
  },
  { tier: 'standard' }
);

/**
 * Example 14: Multiple operations on same route
 * Different rate limits for different HTTP methods
 */
export const handlers = {
  GET: withRateLimit(
    async (request: NextRequest) => {
      return NextResponse.json({ message: 'GET with standard limits' });
    },
    { tier: 'standard' }
  ),

  POST: withRateLimit(
    async (request: NextRequest) => {
      return NextResponse.json({ message: 'POST with auth limits' });
    },
    { tier: 'auth' }
  ),

  DELETE: withRateLimit(
    async (request: NextRequest) => {
      return NextResponse.json({ message: 'DELETE with admin limits' });
    },
    { tier: 'admin' }
  ),
};

/**
 * Example 15: Combining with other middleware (authentication)
 */
export const GET_PROTECTED = withRateLimit(
  async (request: NextRequest) => {
    // You can still check auth inside the handler
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Protected data' });
  },
  { tier: 'standard' }
);
