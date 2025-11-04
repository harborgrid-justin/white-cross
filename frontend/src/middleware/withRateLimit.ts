/**
 * Rate Limiting Higher-Order Function for Next.js API Routes
 *
 * Provides a wrapper for API route handlers to enforce rate limiting,
 * preventing abuse and ensuring system stability. Compatible with Next.js 16
 * App Router API routes.
 *
 * @module middleware/withRateLimit
 * @since 2025-10-27
 *
 * @example
 * ```typescript
 * import { withRateLimit } from '@/middleware/withRateLimit';
 *
 * export const GET = withRateLimit(
 *   async (request: NextRequest) => {
 *     return NextResponse.json({ message: 'Success' });
 *   },
 *   { tier: 'standard' }
 * );
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  RateLimiter,
  RATE_LIMIT_CONFIGS,
  getIdentifier,
  createRateLimitHeaders,
} from '@/lib/middleware/rateLimiter';

/**
 * Rate limit tier types
 * - 'standard': Default rate limits for general API endpoints
 * - 'elevated': Higher limits for trusted or premium users
 * - 'admin': Moderate limits for administrative operations
 * - 'auth': Strict limits for authentication endpoints
 */
export type RateLimitTier = 'standard' | 'elevated' | 'admin' | 'auth';

/**
 * Rate limit configuration options
 */
export interface RateLimitOptions {
  /**
   * Rate limit tier to apply
   * @default 'standard'
   */
  tier?: RateLimitTier;

  /**
   * Custom rate limit configuration (overrides tier)
   */
  config?: {
    /** Time window in milliseconds */
    windowMs: number;
    /** Maximum requests per window */
    maxRequests: number;
    /** Custom error message */
    message?: string;
  };

  /**
   * Custom identifier extraction function
   * @param request - The incoming request
   * @returns Unique identifier for rate limiting
   */
  getIdentifier?: (request: NextRequest) => string | Promise<string>;

  /**
   * Whether to skip rate limiting for certain conditions
   * @param request - The incoming request
   * @returns true to skip rate limiting
   */
  skipRateLimit?: (request: NextRequest) => boolean | Promise<boolean>;

  /**
   * Custom error response handler
   */
  onRateLimitExceeded?: (request: NextRequest, resetTime: number) => NextResponse;
}

/**
 * API route handler type for Next.js App Router
 */
export type ApiRouteHandler = (
  request: NextRequest,
  context?: { params?: Record<string, string | string[]> }
) => Promise<NextResponse> | NextResponse;

/**
 * Get rate limiter instance based on tier or custom config
 */
function getRateLimiterForTier(tier: RateLimitTier, customConfig?: RateLimitOptions['config']): RateLimiter {
  if (customConfig) {
    return new RateLimiter(customConfig);
  }

  const tierConfigMap = {
    standard: 'api',
    elevated: 'public',
    admin: 'admin',
    auth: 'auth',
  } as const;

  const configKey = tierConfigMap[tier] as keyof typeof RATE_LIMIT_CONFIGS;
  return new RateLimiter(RATE_LIMIT_CONFIGS[configKey]);
}

/**
 * Extract user ID from authorization header if present
 */
function extractUserId(request: NextRequest): string | undefined {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return undefined;
    }

    // Decode JWT token to get user ID (without verification - just for rate limiting)
    const token = authHeader.substring(7);
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
    );

    return payload.userId || payload.sub;
  } catch {
    // If token parsing fails, fall back to IP-based rate limiting
    return undefined;
  }
}

/**
 * Create default rate limit exceeded response
 */
function createRateLimitResponse(
  resetTime: number,
  maxRequests: number,
  message?: string
): NextResponse {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return NextResponse.json(
    {
      error: 'Too Many Requests',
      message: message || 'Rate limit exceeded. Please try again later.',
      retryAfter,
      resetTime: new Date(resetTime).toISOString(),
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
      },
    }
  );
}

/**
 * Higher-order function that wraps an API route handler with rate limiting
 *
 * @param handler - The API route handler to wrap
 * @param options - Rate limiting configuration options
 * @returns Wrapped handler with rate limiting applied
 *
 * @example
 * ```typescript
 * // Using default (standard) tier
 * export const GET = withRateLimit(async (request) => {
 *   return NextResponse.json({ data: 'protected' });
 * });
 *
 * // Using auth tier for login endpoint
 * export const POST = withRateLimit(
 *   async (request) => {
 *     const body = await request.json();
 *     // ... authentication logic
 *     return NextResponse.json({ token: 'xxx' });
 *   },
 *   { tier: 'auth' }
 * );
 *
 * // Using custom configuration
 * export const POST = withRateLimit(
 *   async (request) => {
 *     // ... handler logic
 *   },
 *   {
 *     config: {
 *       windowMs: 60000, // 1 minute
 *       maxRequests: 10,
 *       message: 'Custom rate limit message',
 *     }
 *   }
 * );
 *
 * // With custom identifier (e.g., API key)
 * export const GET = withRateLimit(
 *   async (request) => {
 *     // ... handler logic
 *   },
 *   {
 *     getIdentifier: (req) => req.headers.get('x-api-key') || 'unknown',
 *   }
 * );
 *
 * // Skip rate limiting for specific conditions
 * export const GET = withRateLimit(
 *   async (request) => {
 *     // ... handler logic
 *   },
 *   {
 *     skipRateLimit: (req) => req.headers.get('x-internal-request') === 'true',
 *   }
 * );
 * ```
 */
export function withRateLimit(
  handler: ApiRouteHandler,
  options: RateLimitOptions = {}
): ApiRouteHandler {
  const {
    tier = 'standard',
    config: customConfig,
    getIdentifier: customGetIdentifier,
    skipRateLimit,
    onRateLimitExceeded,
  } = options;

  // Initialize rate limiter
  const rateLimiter = getRateLimiterForTier(tier, customConfig);

  return async (
    request: NextRequest,
    context?: { params?: Record<string, string | string[]> }
  ): Promise<NextResponse> => {
    try {
      // Check if rate limiting should be skipped
      if (skipRateLimit && (await skipRateLimit(request))) {
        return handler(request, context);
      }

      // Extract identifier for rate limiting
      let identifier: string;
      if (customGetIdentifier) {
        identifier = await customGetIdentifier(request);
      } else {
        // Try to get user ID from auth token, fall back to IP
        const userId = extractUserId(request);
        identifier = getIdentifier(request, userId);
      }

      // Get the request path for rate limiting
      const path = request.nextUrl.pathname;

      // Check rate limit
      const result = await rateLimiter.check(identifier, path);

      // If rate limit exceeded, return 429 response
      if (!result.allowed) {
        console.warn(
          `[RATE_LIMIT] Rate limit exceeded for ${identifier} on ${path}`,
          `(tier: ${tier})`
        );

        if (onRateLimitExceeded) {
          return onRateLimitExceeded(request, result.resetTime);
        }

        const tierMap = {
          standard: 'api',
          elevated: 'public',
          admin: 'admin',
          auth: 'auth',
        } as const;
        const configKey = tierMap[tier] as keyof typeof RATE_LIMIT_CONFIGS;

        return createRateLimitResponse(
          result.resetTime,
          customConfig?.maxRequests || RATE_LIMIT_CONFIGS[configKey].maxRequests,
          result.message
        );
      }

      // Execute the handler
      const response = await handler(request, context);

      // Add rate limit headers to successful response
      const rateLimitHeaders = createRateLimitHeaders(result);
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });

      // Add limit header
      const tierMap = {
        standard: 'api',
        elevated: 'public',
        admin: 'admin',
        auth: 'auth',
      } as const;
      const configKey = tierMap[tier] as keyof typeof RATE_LIMIT_CONFIGS;
      const maxRequests = customConfig?.maxRequests || RATE_LIMIT_CONFIGS[configKey].maxRequests;
      response.headers.set('X-RateLimit-Limit', maxRequests.toString());

      return response;
    } catch (error) {
      // Log error but don't block request if rate limiting fails
      console.error('[RATE_LIMIT] Rate limiting error:', error);

      // Fall back to executing handler without rate limiting
      return handler(request, context);
    }
  };
}

/**
 * Preset rate limit configurations for common use cases
 */
export const RateLimitPresets = {
  /**
   * Standard API endpoint (60 req/min)
   */
  standard: (): RateLimitOptions => ({ tier: 'standard' }),

  /**
   * Elevated rate limits for trusted endpoints (120 req/min)
   */
  elevated: (): RateLimitOptions => ({ tier: 'elevated' }),

  /**
   * Admin endpoints (30 req/min)
   */
  admin: (): RateLimitOptions => ({ tier: 'admin' }),

  /**
   * Authentication endpoints - strict limits (5 req/15min)
   */
  auth: (): RateLimitOptions => ({ tier: 'auth' }),

  /**
   * Custom configuration
   */
  custom: (windowMs: number, maxRequests: number, message?: string): RateLimitOptions => ({
    config: { windowMs, maxRequests, message },
  }),

  /**
   * Very strict rate limiting for sensitive operations (1 req/min)
   */
  strict: (): RateLimitOptions => ({
    config: {
      windowMs: 60 * 1000,
      maxRequests: 1,
      message: 'This endpoint has very strict rate limits.',
    },
  }),

  /**
   * Generous rate limits for public/read-only endpoints (300 req/min)
   */
  generous: (): RateLimitOptions => ({
    config: {
      windowMs: 60 * 1000,
      maxRequests: 300,
      message: 'Rate limit exceeded for public endpoint.',
    },
  }),
} as const;

/**
 * Utility to create a rate limiter with user-specific identification
 *
 * @example
 * ```typescript
 * export const POST = withUserRateLimit(async (request) => {
 *   // Only rate limits authenticated users
 *   return NextResponse.json({ data: 'user-specific' });
 * });
 * ```
 */
export function withUserRateLimit(
  handler: ApiRouteHandler,
  options: Omit<RateLimitOptions, 'getIdentifier'> = {}
): ApiRouteHandler {
  return withRateLimit(handler, {
    ...options,
    getIdentifier: (request) => {
      const userId = extractUserId(request);
      if (!userId) {
        throw new Error('User authentication required for this endpoint');
      }
      return `user:${userId}`;
    },
  });
}

/**
 * Utility to create a rate limiter with IP-based identification
 *
 * @example
 * ```typescript
 * export const GET = withIPRateLimit(async (request) => {
 *   // Rate limits by IP only
 *   return NextResponse.json({ data: 'ip-based' });
 * });
 * ```
 */
export function withIPRateLimit(
  handler: ApiRouteHandler,
  options: Omit<RateLimitOptions, 'getIdentifier'> = {}
): ApiRouteHandler {
  return withRateLimit(handler, {
    ...options,
    getIdentifier: (request) => getIdentifier(request),
  });
}

/**
 * Export rate limit tier type for external use
 */
export type { RateLimitOptions as RateLimitConfig };
