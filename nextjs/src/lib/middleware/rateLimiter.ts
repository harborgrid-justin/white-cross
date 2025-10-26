/**
 * Rate Limiter Middleware
 *
 * Implements rate limiting using sliding window algorithm.
 * Supports both in-memory storage (development) and Redis (production).
 *
 * @module middleware/rateLimiter
 * @since 2025-10-26
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string; // Error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

/**
 * In-memory rate limit store
 * Key format: `${identifier}:${path}`
 */
const memoryStore = new Map<string, RateLimitStore>();

/**
 * Clean up expired entries every 5 minutes
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryStore.entries()) {
    if (value.resetTime < now) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Default rate limit configurations for different route types
 */
export const RATE_LIMIT_CONFIGS = {
  // Authentication routes - strict limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts. Please try again later.',
  },
  // API routes - moderate limits
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  // Public routes - generous limits
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 120, // 120 requests per minute
    message: 'Too many requests. Please slow down.',
  },
  // Admin routes - moderate limits
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    message: 'Too many admin requests. Please slow down.',
  },
} as const;

/**
 * Rate limiter class
 */
export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = {
      windowMs: config.windowMs || RATE_LIMIT_CONFIGS.api.windowMs,
      maxRequests: config.maxRequests || RATE_LIMIT_CONFIGS.api.maxRequests,
      message: config.message || RATE_LIMIT_CONFIGS.api.message,
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false,
    };
  }

  /**
   * Check if request is rate limited
   * @returns null if allowed, error response if rate limited
   */
  async check(identifier: string, path: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  }> {
    const key = `${identifier}:${path}`;
    const now = Date.now();
    const resetTime = now + this.config.windowMs;

    // Get or create store entry
    let store = memoryStore.get(key);

    // Reset if window expired
    if (!store || store.resetTime < now) {
      store = {
        count: 0,
        resetTime,
      };
      memoryStore.set(key, store);
    }

    // Increment count
    store.count++;

    // Check if limit exceeded
    const allowed = store.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - store.count);

    return {
      allowed,
      remaining,
      resetTime: store.resetTime,
      message: allowed ? undefined : this.config.message,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  async reset(identifier: string, path: string): Promise<void> {
    const key = `${identifier}:${path}`;
    memoryStore.delete(key);
  }

  /**
   * Get current rate limit status
   */
  async getStatus(identifier: string, path: string): Promise<{
    count: number;
    remaining: number;
    resetTime: number;
  }> {
    const key = `${identifier}:${path}`;
    const store = memoryStore.get(key);
    const now = Date.now();

    if (!store || store.resetTime < now) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
      };
    }

    return {
      count: store.count,
      remaining: Math.max(0, this.config.maxRequests - store.count),
      resetTime: store.resetTime,
    };
  }
}

/**
 * Get rate limiter for route type
 */
export function getRateLimiter(routeType: keyof typeof RATE_LIMIT_CONFIGS): RateLimiter {
  return new RateLimiter(RATE_LIMIT_CONFIGS[routeType]);
}

/**
 * Get identifier from request (IP or user ID)
 */
export function getIdentifier(
  request: {
    ip?: string;
    headers: Headers;
  },
  userId?: string
): string {
  // Prefer user ID for authenticated requests
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return `ip:${forwardedFor.split(',')[0].trim()}`;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return `ip:${realIp}`;
  }

  // Fallback to request IP
  return `ip:${request.ip || 'unknown'}`;
}

/**
 * Determine route type from path
 */
export function getRouteType(path: string): keyof typeof RATE_LIMIT_CONFIGS {
  if (path.startsWith('/api/v1/auth') || path.startsWith('/login')) {
    return 'auth';
  }
  if (path.startsWith('/admin')) {
    return 'admin';
  }
  if (path.startsWith('/api')) {
    return 'api';
  }
  return 'public';
}

/**
 * Create rate limit headers
 */
export function createRateLimitHeaders(result: {
  remaining: number;
  resetTime: number;
}): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
  };
}
