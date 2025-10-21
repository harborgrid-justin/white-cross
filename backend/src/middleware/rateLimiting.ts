/**
 * LOC: E7ADCB7204
 * WC-MID-RTL-048 | Redis-Based Rate Limiting & API Abuse Prevention Middleware
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-MID-RTL-048 | Redis-Based Rate Limiting & API Abuse Prevention Middleware
 * Purpose: OWASP API security, brute force protection, PHI harvesting prevention
 * Upstream: utils/logger, Redis client, OWASP security guidelines
 * Downstream: Auth routes, communication, exports | Called by: Hapi pre-handlers
 * Related: middleware/security.ts, config/redis.ts, routes/auth.ts protection
 * Exports: rateLimitingPlugin, createRateLimiter, RATE_LIMIT_CONFIGS, clearRateLimit
 * Last Updated: 2025-10-18 | Dependencies: @hapi/hapi, redis, @hapi/boom
 * Critical Path: Request → User identification → Rate check → Block/Allow decision
 * LLM Context: HIPAA compliance, prevents data harvesting, sliding window algorithm
 */

/**
 * Rate Limiting Middleware
 * Prevents brute force attacks and API abuse
 *
 * Security: OWASP API Security Top 10 - API4:2023 Unrestricted Resource Consumption
 * HIPAA: Protects against PHI data harvesting attacks
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { createClient } from 'redis';
import { logger } from '../utils/logger';
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

  // PHI export - strict limits
  export: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 10,            // 10 exports per hour
    message: 'Export rate limit exceeded. Please wait before exporting more data.',
    blockDuration: 60 * 60 * 1000
  },

  // API general - moderate limits
  api: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 100,           // 100 requests per minute
    message: 'API rate limit exceeded. Please slow down your requests.',
    blockDuration: 60 * 1000
  },

  // Report generation - CPU intensive
  reports: {
    windowMs: 5 * 60 * 1000,   // 5 minutes
    maxRequests: 5,             // 5 reports per 5 minutes
    message: 'Report generation rate limit exceeded.',
    blockDuration: 5 * 60 * 1000
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
      logger.error('Redis rate limiting error', { error: err.message });
    });

    redisClient.on('connect', () => {
      logger.info('Redis rate limiting connected');
    });

    await redisClient.connect();
  } catch (error) {
    logger.error('Failed to initialize Redis rate limiting', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
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
 * Check rate limit using Redis
 */
async function checkRateLimitRedis(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }

  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Use Redis sorted set for sliding window
    const multi = redisClient.multi();

    // Remove old entries outside window
    multi.zRemRangeByScore(key, 0, windowStart);

    // Count requests in current window
    multi.zCard(key);

    // Add current request
    multi.zAdd(key, { score: now, value: `${now}-${Math.random()}` });

    // Set expiration
    multi.expire(key, Math.ceil(config.windowMs / 1000));

    const results = await multi.exec();
    const countResult = results && Array.isArray(results) ? results[1] : null;
    const count = (countResult && typeof countResult === 'object' && 'reply' in countResult) 
      ? (typeof countResult.reply === 'number' ? countResult.reply : 0) 
      : 0;

    const remaining = Math.max(0, config.maxRequests - count);
    const resetAt = now + config.windowMs;

    return {
      allowed: count < config.maxRequests,
      remaining,
      resetAt
    };
  } catch (error) {
    logger.error('Redis rate limit check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      key
    });
    // Fallback to allowing request on Redis failure
    return { allowed: true, remaining: config.maxRequests, resetAt: now + config.windowMs };
  }
}

/**
 * Check rate limit using in-memory store
 * Fallback when Redis unavailable
 */
function checkRateLimitMemory(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = inMemoryStore.get(key);

  // No record or expired window
  if (!record || record.resetAt < now) {
    inMemoryStore.set(key, { count: 1, resetAt: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs
    };
  }

  // Increment count
  record.count++;

  const remaining = Math.max(0, config.maxRequests - record.count);

  return {
    allowed: record.count <= config.maxRequests,
    remaining,
    resetAt: record.resetAt
  };
}

/**
 * Check rate limit (uses Redis or in-memory fallback)
 */
async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  if (redisClient) {
    return await checkRateLimitRedis(key, config);
  } else {
    return checkRateLimitMemory(key, config);
  }
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
      const { allowed, remaining, resetAt } = await checkRateLimit(key, config);

      // Add rate limit headers to response
      const response = request.response as any;
      if (response && !response.isBoom) {
        response.header('X-RateLimit-Limit', String(config.maxRequests));
        response.header('X-RateLimit-Remaining', String(remaining));
        response.header('X-RateLimit-Reset', new Date(resetAt).toISOString());
      }

      if (!allowed) {
        logger.warn('Rate limit exceeded', {
          identifier,
          userId: (request.auth.credentials as any)?.userId,
          ip: request.info.remoteAddress,
          path: request.path
        });

        // Return 429 Too Many Requests
        throw Boom.tooManyRequests(config.message, {
          retryAfter: Math.ceil((resetAt - Date.now()) / 1000)
        });
      }

      return h.continue;
    } catch (error) {
      if (Boom.isBoom(error)) {
        throw error;
      }

      logger.error('Rate limiting check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        identifier
      });

      // Fail open on errors (allow request)
      return h.continue;
    }
  };
}

/**
 * Hapi.js plugin for global rate limiting
 */
export const rateLimitingPlugin = {
  name: 'rate-limiting',
  version: '1.0.0',

  register: async (server: any, options: { redisUrl?: string }) => {
    // Initialize Redis
    if (options.redisUrl) {
      await initializeRateLimiting(options.redisUrl);
    }

    // Apply general API rate limit to all routes
    server.ext('onPostAuth', createRateLimiter('api', RATE_LIMIT_CONFIGS.api));

    logger.info('Rate limiting plugin registered');
  }
};

/**
 * Apply rate limiting to specific routes
 * Use in route configuration
 *
 * @example
 * {
 *   method: 'POST',
 *   path: '/api/auth/login',
 *   options: {
 *     pre: [{ method: applyRateLimit('auth', RATE_LIMIT_CONFIGS.auth) }]
 *   }
 * }
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

/**
 * Clear rate limit for a user (admin function)
 * Use after resetting password or on user request
 */
export async function clearRateLimit(
  identifier: string,
  userId: string
): Promise<void> {
  const key = `ratelimit:${identifier}:${userId}`;

  try {
    if (redisClient) {
      await redisClient.del(key);
      logger.info('Rate limit cleared (Redis)', { identifier, userId });
    } else {
      inMemoryStore.delete(key);
      logger.info('Rate limit cleared (memory)', { identifier, userId });
    }
  } catch (error) {
    logger.error('Failed to clear rate limit', {
      error: error instanceof Error ? error.message : 'Unknown error',
      identifier,
      userId
    });
  }
}

/**
 * Get current rate limit status for user
 */
export async function getRateLimitStatus(
  identifier: string,
  userId: string
): Promise<{ count: number; remaining: number; resetAt: Date } | null> {
  const key = `ratelimit:${identifier}:${userId}`;

  try {
    if (redisClient) {
      const count = await redisClient.zCard(key);
      const ttl = await redisClient.ttl(key);

      const config = (RATE_LIMIT_CONFIGS as any)[identifier] || RATE_LIMIT_CONFIGS.api;
      const ttlMs = typeof ttl === 'number' ? ttl * 1000 : 0;
      const countNumber = typeof count === 'number' ? count : 0;

      return {
        count: countNumber,
        remaining: Math.max(0, config.maxRequests - countNumber),
        resetAt: new Date(Date.now() + ttlMs)
      };
    } else {
      const record = inMemoryStore.get(key);
      if (!record) return null;

      const config = (RATE_LIMIT_CONFIGS as any)[identifier] || RATE_LIMIT_CONFIGS.api;

      return {
        count: record.count,
        remaining: Math.max(0, config.maxRequests - record.count),
        resetAt: new Date(record.resetAt)
      };
    }
  } catch (error) {
    logger.error('Failed to get rate limit status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      identifier,
      userId
    });
    return null;
  }
}

/**
 * Cleanup in-memory store (call periodically)
 * Not needed for Redis (has TTL)
 */
export function cleanupInMemoryStore(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, record] of inMemoryStore.entries()) {
    if (record.resetAt < now) {
      inMemoryStore.delete(key);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    logger.debug('Cleaned up expired rate limit records', { count: cleaned });
  }

  return cleaned;
}

// Cleanup every 5 minutes
setInterval(cleanupInMemoryStore, 5 * 60 * 1000);

export default rateLimitingPlugin;
