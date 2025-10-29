/**
 * Production-grade Rate Limiting with Upstash Redis
 *
 * Uses Upstash Redis for distributed rate limiting across multiple instances.
 * Falls back to in-memory store if Redis is unavailable.
 */

import { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Custom identifier function (defaults to IP address) */
  identifier?: (request: NextRequest) => string;
}

/**
 * Initialize Upstash Redis client
 */
let redis: Redis | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

/**
 * In-memory fallback store when Redis is not available
 */
interface RateLimitStore {
  requests: number;
  resetTime: number;
}

const fallbackStore = new Map<string, RateLimitStore>();

/**
 * Extract client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for reverse proxy scenarios)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Cloudflare connecting IP
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to request IP
  return request.ip || 'unknown';
}

/**
 * Check rate limit using Upstash Redis (production)
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<{ limited: boolean; remaining: number; resetTime: number }> {
  if (!redis) {
    throw new Error('Redis not initialized');
  }

  // Create sliding window rate limiter
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${config.windowSeconds}s`),
    analytics: true,
    prefix: 'ratelimit',
  });

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  return {
    limited: !success,
    remaining,
    resetTime: reset,
  };
}

/**
 * Check rate limit using in-memory store (fallback/development)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  // Get or create rate limit entry
  let entry = fallbackStore.get(key);

  // Reset if window has expired
  if (!entry || now >= entry.resetTime) {
    entry = {
      requests: 0,
      resetTime: now + windowMs,
    };
    fallbackStore.set(key, entry);
  }

  // Increment request count
  entry.requests++;

  // Check if limit exceeded
  const limited = entry.requests > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.requests);

  return {
    limited,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Check rate limit for request
 * Uses Redis in production, falls back to in-memory store
 */
export async function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{ limited: boolean; remaining: number; resetTime: number }> {
  const identifier = config.identifier
    ? config.identifier(request)
    : getClientIdentifier(request);

  try {
    if (redis) {
      return await checkRateLimitRedis(identifier, config);
    } else {
      return checkRateLimitMemory(identifier, config);
    }
  } catch (error) {
    console.error('Rate limit check failed, using fallback:', error);
    return checkRateLimitMemory(identifier, config);
  }
}

/**
 * Clean up expired in-memory rate limit entries
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, entry] of fallbackStore.entries()) {
    if (now >= entry.resetTime) {
      fallbackStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0 && process.env.NODE_ENV !== 'production') {
    console.log(`Cleaned up ${cleaned} expired rate limit entries`);
  }
}

/**
 * Production-grade rate limit configurations
 */
export const RATE_LIMITS = {
  /** Very strict rate limit for authentication endpoints */
  AUTH: {
    maxRequests: 5,
    windowSeconds: 900, // 15 minutes
  },

  /** Strict rate limit for password reset */
  PASSWORD_RESET: {
    maxRequests: 3,
    windowSeconds: 3600, // 1 hour
  },

  /** Standard rate limit for write API endpoints */
  API_WRITE: {
    maxRequests: 60,
    windowSeconds: 60, // 1 minute
  },

  /** Relaxed rate limit for read API endpoints */
  API_READ: {
    maxRequests: 200,
    windowSeconds: 60, // 1 minute
  },

  /** Very strict rate limit for expensive operations */
  EXPENSIVE: {
    maxRequests: 10,
    windowSeconds: 60, // 1 minute
  },

  /** Rate limit for file uploads */
  UPLOAD: {
    maxRequests: 20,
    windowSeconds: 300, // 5 minutes
  },

  /** Rate limit for search queries */
  SEARCH: {
    maxRequests: 50,
    windowSeconds: 60, // 1 minute
  },
} as const;

/**
 * Create rate limit middleware for API routes
 */
export function withRateLimit(config: RateLimitConfig) {
  return async (request: NextRequest) => {
    const result = await checkRateLimit(request, config);

    if (result.limited) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null; // Allow request to continue
  };
}

// Run cleanup every 5 minutes for in-memory fallback
if (typeof setInterval !== 'undefined' && !redis) {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
