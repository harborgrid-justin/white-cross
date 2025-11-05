/**
 * @fileoverview Rate Limiting Implementation
 * @module lib/helpers/rate-limit
 *
 * Provides in-memory rate limiting for server actions to prevent
 * brute force attacks and abuse. Uses a sliding window algorithm
 * with automatic cleanup.
 *
 * IMPORTANT: This is an in-memory implementation suitable for single-instance
 * deployments. For multi-instance/distributed systems, use Redis or similar.
 */

import type { RateLimitInfo } from '../types/action-result';

/**
 * Rate limit entry with expiration
 */
interface RateLimitEntry {
  /** Request timestamps */
  requests: number[];
  /** Expiration time (ms since epoch) */
  expiresAt: number;
}

/**
 * Rate limit store
 * Maps: "scope:identifier" -> RateLimitEntry
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleanup interval (5 minutes)
 */
const CLEANUP_INTERVAL = 5 * 60 * 1000;

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
  /** Custom error message */
  message?: string;
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  /** Login attempts by IP: 5 per 15 minutes */
  LOGIN_IP: {
    maxRequests: 5,
    windowSeconds: 15 * 60,
  },
  /** Login attempts by email: 3 per 15 minutes */
  LOGIN_EMAIL: {
    maxRequests: 3,
    windowSeconds: 15 * 60,
  },
  /** Password reset requests: 3 per hour */
  PASSWORD_RESET: {
    maxRequests: 3,
    windowSeconds: 60 * 60,
  },
  /** Password change attempts: 5 per hour */
  PASSWORD_CHANGE: {
    maxRequests: 5,
    windowSeconds: 60 * 60,
  },
} as const;

/**
 * Check if a request should be rate limited
 *
 * Uses a sliding window algorithm to track requests over time.
 * Automatically cleans up old entries.
 *
 * @param scope - Rate limit scope (e.g., 'login-ip', 'login-email')
 * @param identifier - Unique identifier (e.g., IP address, email)
 * @param config - Rate limit configuration
 * @returns Rate limit information
 *
 * @example
 * const limitInfo = checkRateLimit('login-ip', ipAddress, RATE_LIMITS.LOGIN_IP);
 * if (limitInfo.limited) {
 *   return actionRateLimitError(limitInfo.resetIn!);
 * }
 */
export function checkRateLimit(
  scope: string,
  identifier: string,
  config: RateLimitConfig
): RateLimitInfo {
  const key = `${scope}:${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const cutoff = now - windowMs;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry) {
    entry = {
      requests: [],
      expiresAt: now + windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Remove requests outside the window
  entry.requests = entry.requests.filter((timestamp) => timestamp > cutoff);

  // Check if limit exceeded
  if (entry.requests.length >= config.maxRequests) {
    // Calculate reset time
    const oldestRequest = entry.requests[0];
    const resetIn = Math.ceil((oldestRequest + windowMs - now) / 1000);

    return {
      limited: true,
      remaining: 0,
      resetIn,
      key,
    };
  }

  // Record this request
  entry.requests.push(now);
  entry.expiresAt = now + windowMs;

  return {
    limited: false,
    remaining: config.maxRequests - entry.requests.length,
    resetIn: config.windowSeconds,
    key,
  };
}

/**
 * Reset rate limit for a specific key
 *
 * Useful for testing or manual intervention
 *
 * @param scope - Rate limit scope
 * @param identifier - Unique identifier
 */
export function resetRateLimit(scope: string, identifier: string): void {
  const key = `${scope}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Clean up expired rate limit entries
 *
 * Should be called periodically to prevent memory leaks
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  const expiredKeys: string[] = [];

  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.expiresAt < now) {
      expiredKeys.push(key);
    }
  }

  for (const key of expiredKeys) {
    rateLimitStore.delete(key);
  }
}

/**
 * Get current rate limit stats (for monitoring)
 *
 * @returns Current stats
 */
export function getRateLimitStats() {
  return {
    totalKeys: rateLimitStore.size,
    scopes: Array.from(rateLimitStore.keys()).reduce((acc, key) => {
      const scope = key.split(':')[0];
      acc[scope] = (acc[scope] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}

// Start cleanup interval
if (typeof globalThis !== 'undefined' && !globalThis.__rateLimitCleanupStarted) {
  setInterval(cleanupRateLimits, CLEANUP_INTERVAL);
  globalThis.__rateLimitCleanupStarted = true;
}

// Type augmentation for global cleanup flag
declare global {
  var __rateLimitCleanupStarted: boolean | undefined;
}
