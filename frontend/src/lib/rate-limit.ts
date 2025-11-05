/**
 * Rate Limiting Utility
 *
 * Implements sliding window rate limiting for API endpoints.
 * Uses in-memory storage for development, Redis for production.
 *
 * @module lib/rate-limit
 * @since 2025-11-05
 */

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: string;
}

interface RateLimitStore {
  requests: number[];
  resetTime: number;
}

/**
 * In-memory rate limit store (use Redis in production)
 */
const store = new Map<string, RateLimitStore>();

/**
 * Parse window string to milliseconds
 */
function parseWindow(window: string): number {
  const match = window.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid window format: ${window}`);
  }

  const [, amount, unit] = match;
  const value = parseInt(amount, 10);

  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Invalid window unit: ${unit}`);
  }
}

/**
 * Rate limiter class
 */
export class RateLimiter {
  /**
   * Check if request is within rate limit
   *
   * @param identifier - Unique identifier (IP address, user ID, etc.)
   * @param limit - Maximum number of requests
   * @param window - Time window (e.g., '15m', '1h', '1d')
   * @returns Rate limit result
   */
  async check(identifier: string, limit: number, window: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = parseWindow(window);
    const resetTime = now + windowMs;

    // Get or create store entry
    let entry = store.get(identifier);
    if (!entry) {
      entry = { requests: [], resetTime };
      store.set(identifier, entry);
    }

    // Remove expired requests
    entry.requests = entry.requests.filter(time => now - time < windowMs);

    // Check if limit exceeded
    if (entry.requests.length >= limit) {
      const oldestRequest = entry.requests[0];
      const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);

      return {
        success: false,
        limit,
        remaining: 0,
        reset: resetTime,
        retryAfter: retryAfter.toString(),
      };
    }

    // Add current request
    entry.requests.push(now);

    return {
      success: true,
      limit,
      remaining: limit - entry.requests.length,
      reset: resetTime,
    };
  }

  /**
   * Clear rate limit for identifier
   */
  async clear(identifier: string): Promise<void> {
    store.delete(identifier);
  }

  /**
   * Clear all rate limits
   */
  async clearAll(): Promise<void> {
    store.clear();
  }
}

/**
 * Global rate limiter instance
 */
let rateLimiter: RateLimiter;

/**
 * Get rate limiter instance
 */
export function getRateLimiter(): RateLimiter {
  if (!rateLimiter) {
    rateLimiter = new RateLimiter();
  }
  return rateLimiter;
}
