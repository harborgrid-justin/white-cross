/**
 * Rate Limiting Middleware
 *
 * Implements rate limiting to prevent abuse and ensure system stability.
 * Uses in-memory storage for simplicity. For production with multiple
 * instances, use Redis-backed rate limiting.
 *
 * @module middleware/rateLimit
 * @since 2025-10-26
 */

import { NextRequest, NextResponse } from 'next/server';
import { RATE_LIMIT_CONFIG } from '@/lib/security/config';
import { getClientIP } from './audit';

/**
 * Rate limit entry
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Rate limit storage (in-memory)
 * For production with multiple instances, use Redis
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limit configuration for different route types
 */
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum requests per window
}

/**
 * Determine rate limit config based on route
 */
function getRateLimitConfig(pathname: string): RateLimitConfig {
  // Auth routes - stricter limits
  if (pathname.startsWith('/api/auth')) {
    return RATE_LIMIT_CONFIG.auth;
  }

  // PHI routes - moderate limits
  const phiRoutes = ['/students', '/medications', '/health-records', '/appointments'];
  if (phiRoutes.some((route) => pathname.startsWith(route))) {
    return RATE_LIMIT_CONFIG.phi;
  }

  // General routes
  return RATE_LIMIT_CONFIG.general;
}

/**
 * Check and update rate limit
 */
function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // If no entry or window expired, create new entry
  if (!entry || now >= entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      allowed: true,
      remaining: config.max - 1,
      resetTime,
    };
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  if (entry.count > config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries (run periodically)
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  const entriesToDelete: string[] = [];

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      entriesToDelete.push(key);
    }
  }

  entriesToDelete.forEach((key) => rateLimitStore.delete(key));

  if (entriesToDelete.length > 0) {
    console.log(`[RATE_LIMIT] Cleaned up ${entriesToDelete.length} expired entries`);
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  const identifier = `${clientIP}:${pathname}`;

  // Get rate limit config for this route
  const config = getRateLimitConfig(pathname);

  // Check rate limit
  const { allowed, remaining, resetTime } = checkRateLimit(identifier, config);

  // Create headers with rate limit info
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', config.max.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());

  // If rate limit exceeded, return 429
  if (!allowed) {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
    headers.set('Retry-After', retryAfter.toString());

    console.warn(
      `[RATE_LIMIT] Rate limit exceeded for ${clientIP} on ${pathname}`,
      `(${config.max} req/${config.windowMs}ms)`
    );

    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers.entries()),
        },
      }
    );
  }

  // Add rate limit headers to request for downstream use
  return null;
}

/**
 * Get current rate limit status for an identifier
 */
export function getRateLimitStatus(identifier: string): RateLimitEntry | null {
  return rateLimitStore.get(identifier) || null;
}

/**
 * Reset rate limit for an identifier (admin use)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
  console.log(`[RATE_LIMIT] Reset rate limit for ${identifier}`);
}

/**
 * Get total number of rate limit entries
 */
export function getRateLimitStoreSize(): number {
  return rateLimitStore.size;
}
