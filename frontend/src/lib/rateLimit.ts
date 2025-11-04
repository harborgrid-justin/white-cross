/**
 * Rate limiting utilities for API routes
 * Protects against abuse and DDoS attacks
 */

import { NextRequest } from 'next/server';

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Custom identifier function (defaults to IP address) */
  identifier?: (request: NextRequest) => string;
}

/**
 * Rate limit store interface
 */
interface RateLimitStore {
  requests: number;
  resetTime: number;
}

/**
 * In-memory rate limit store
 * TODO: Replace with Redis for production distributed systems
 */
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Extract client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to CF connecting IP
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // No IP available
  return 'unknown';
}

/**
 * Check rate limit for request
 * Returns null if within limit, error response if exceeded
 */
export function checkRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const identifier = config.identifier
    ? config.identifier(request)
    : getClientIdentifier(request);

  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  // Reset if window has expired
  if (!entry || now >= entry.resetTime) {
    entry = {
      requests: 0,
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(key, entry);
  }

  // Increment request count
  entry.requests++;

  // Check if limit exceeded
  const limited = entry.requests > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.requests);

  return {
    limited,
    remaining,
    resetTime: entry.resetTime
  };
}

/**
 * Clean up expired rate limit entries
 * Should be called periodically to prevent memory leaks
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  let cleaned = 0;
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now >= entry.resetTime) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => {
    rateLimitStore.delete(key);
    cleaned++;
  });

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} expired rate limit entries`);
  }
}

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  /** Strict rate limit for authentication endpoints */
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000 // 15 minutes
  },

  /** Standard rate limit for API endpoints */
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000 // 1 minute
  },

  /** Relaxed rate limit for read-only endpoints */
  READ: {
    maxRequests: 200,
    windowMs: 60 * 1000 // 1 minute
  },

  /** Very strict rate limit for expensive operations */
  EXPENSIVE: {
    maxRequests: 10,
    windowMs: 60 * 1000 // 1 minute
  }
} as const;

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimits, 5 * 60 * 1000);
}
