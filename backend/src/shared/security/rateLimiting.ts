/**
 * Rate Limiting Utilities
 * Prevents brute force attacks and API abuse
 *
 * Security: OWASP API Security Top 10 - API4:2023 Unrestricted Resource Consumption
 * HIPAA: Protects against PHI data harvesting attacks
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { createClient } from 'redis';
import { logger } from '../logging/logger';
import Boom from '@hapi/boom';

// Redis client for distributed rate limiting
let redisClient: ReturnType<typeof createClient> | null = null;

// In-memory fallback when Redis unavailable
const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit configuration presets
 */
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - strict limits
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 5,             // 5 attempts
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    blockDuration: 15 * 60 * 1000
  },

  // Communication endpoints - prevent spam
  communication: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 10,            // 10 messages per minute
    message: 'Message rate limit exceeded. Please wait before sending more messages.',
    blockDuration: 5 * 60 * 1000
  },

  // Emergency alert - very strict
  emergencyAlert: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 3,             // 3 alerts per hour
    message: 'Emergency alert rate limit exceeded. Contact system administrator.',
    blockDuration: 60 * 60 * 1000
  },

  // API general - moderate limits
  api: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 100,           // 100 requests per minute
    message: 'API rate limit exceeded. Please slow down your requests.',
    blockDuration: 60 * 1000
  }
};

export type RateLimitConfig = typeof RATE_LIMIT_CONFIGS.auth;

/**
 * Initialize Redis client for distributed rate limiting
 */
export async function initializeRateLimiting(redisUrl?: string): Promise<void> {
  if (!redisUrl) {
    logger.warn('Redis URL not provided. Using in-memory rate limiting (not suitable for production)');
    return;
  }

  try {
    redisClient = createClient({ url: redisUrl });

    redisClient.on('error', (err) => {
      logger.error('Redis rate limiting error', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis rate limiting connected');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to initialize Redis rate limiting', error);
    redisClient = null;
  }
}

/**
 * Get rate limit key for request
 * Uses IP + user ID for authenticated requests
 */
function getRateLimitKey(
  request: Request,
  identifier: string
): string {
  const userId = (request.auth.credentials as any)?.userId;
  const ip = request.info.remoteAddress;

  // Use userId if authenticated, otherwise use IP
  const userIdentifier = userId || ip;

  return `ratelimit:${identifier}:${userIdentifier}`;
}

/**
 * Create rate limiting middleware for specific route
 */
export function createRateLimiter(
  identifier: string,
  config: RateLimitConfig
) {
  return async (request: Request, h: ResponseToolkit) => {
    const key = getRateLimitKey(request, identifier);

    try {
      // For now, we'll use in-memory store (Redis implementation can be added later)
      const now = Date.now();
      const record = inMemoryStore.get(key);

      // No record or expired window
      if (!record || record.resetAt < now) {
        inMemoryStore.set(key, { count: 1, resetAt: now + config.windowMs });
        return h.continue;
      }

      // Increment count
      record.count++;

      const remaining = Math.max(0, config.maxRequests - record.count);

      // Add rate limit headers to response
      const response = request.response as any;
      if (response && !response.isBoom) {
        response.header('X-RateLimit-Limit', String(config.maxRequests));
        response.header('X-RateLimit-Remaining', String(remaining));
        response.header('X-RateLimit-Reset', new Date(record.resetAt).toISOString());
      }

      if (record.count > config.maxRequests) {
        logger.warn('Rate limit exceeded', {
          identifier,
          userId: (request.auth.credentials as any)?.userId,
          ip: request.info.remoteAddress,
          path: request.path
        });

        // Return 429 Too Many Requests
        throw Boom.tooManyRequests(config.message, {
          retryAfter: Math.ceil((record.resetAt - Date.now()) / 1000)
        });
      }

      return h.continue;
    } catch (error) {
      if (Boom.isBoom(error)) {
        throw error;
      }

      logger.error('Rate limiting check failed', error);
      // Fail open on errors (allow request)
      return h.continue;
    }
  };
}

/**
 * Apply rate limiting to specific routes
 * Use in route configuration
 */
export function applyRateLimit(
  identifier: string,
  config: RateLimitConfig
) {
  return {
    assign: 'rateLimit',
    method: createRateLimiter(identifier, config)
  };
}

export default {
  RATE_LIMIT_CONFIGS,
  initializeRateLimiting,
  createRateLimiter,
  applyRateLimit
};