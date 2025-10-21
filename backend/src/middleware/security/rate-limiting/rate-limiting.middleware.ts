/**
 * LOC: E7ADCB7204
 * WC-MID-RTL-048 | Framework-Agnostic Rate Limiting & API Abuse Prevention Middleware
 *
 * UPSTREAM (imports from):
 *   - utils/logger (logging utilities)
 *
 * DOWNSTREAM (imported by):
 *   - adapters/hapi/rate-limiting.adapter.ts
 *   - adapters/express/rate-limiting.adapter.ts
 */

/**
 * WC-MID-RTL-048 | Framework-Agnostic Rate Limiting & API Abuse Prevention Middleware
 * Purpose: OWASP API security, brute force protection, PHI harvesting prevention
 * Upstream: utils/logger, Redis client, OWASP security guidelines
 * Downstream: Auth routes, communication, exports | Called by: Framework adapters
 * Related: security/headers/*, monitoring/audit/*, healthcare compliance
 * Exports: RateLimitingMiddleware class, rate limit configs | Key Services: Rate limiting, abuse prevention
 * Last Updated: 2025-10-21 | Dependencies: Framework-agnostic with Redis support
 * Critical Path: Request → User identification → Rate check → Block/Allow decision
 * LLM Context: HIPAA compliance, prevents data harvesting, sliding window algorithm
 */

/**
 * Framework-agnostic Rate Limiting Middleware
 * Prevents brute force attacks and API abuse
 *
 * Security: OWASP API Security Top 10 - API4:2023 Unrestricted Resource Consumption
 * HIPAA: Protects against PHI data harvesting attacks
 */

import { logger } from '../../../utils/logger';

/**
 * Rate limit configuration interface
 */
export interface RateLimitConfig {
  windowMs: number;           // Time window in milliseconds
  maxRequests: number;        // Maximum requests per window
  message: string;            // Error message when limit exceeded
  blockDuration?: number;     // Additional block duration after limit exceeded
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean;     // Don't count failed requests
  keyGenerator?: (identifier: string, ip: string, userId?: string) => string;
  onLimitReached?: (key: string, info: RateLimitInfo) => void;
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  totalHits: number;
  remainingPoints: number;
  msBeforeNext: number;
  isFirstInDuration: boolean;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  totalHits: number;
  remainingPoints: number;
  msBeforeNext: number;
  retryAfter?: number;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Rate limit store interface
 */
export interface RateLimitStore {
  increment(key: string, windowMs: number): Promise<RateLimitInfo>;
  reset(key: string): Promise<void>;
  get(key: string): Promise<RateLimitInfo | null>;
  cleanup(): Promise<number>;
}

/**
 * Request context interface
 */
export interface RequestContext {
  ip: string;
  userId?: string;
  userAgent?: string;
  path: string;
  method: string;
  timestamp?: number;
}

/**
 * Rate limit configuration presets for healthcare platform
 */
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - strict limits
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 5,             // 5 attempts
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    blockDuration: 15 * 60 * 1000
  } as RateLimitConfig,

  // Communication endpoints - prevent spam
  communication: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 10,            // 10 messages per minute
    message: 'Message rate limit exceeded. Please wait before sending more messages.',
    blockDuration: 5 * 60 * 1000
  } as RateLimitConfig,

  // Emergency alert - very strict
  emergencyAlert: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 3,             // 3 alerts per hour
    message: 'Emergency alert rate limit exceeded. Contact system administrator.',
    blockDuration: 60 * 60 * 1000
  } as RateLimitConfig,

  // PHI export - strict limits
  export: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 10,            // 10 exports per hour
    message: 'Export rate limit exceeded. Please wait before exporting more data.',
    blockDuration: 60 * 60 * 1000
  } as RateLimitConfig,

  // API general - moderate limits
  api: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 100,           // 100 requests per minute
    message: 'API rate limit exceeded. Please slow down your requests.',
    blockDuration: 60 * 1000
  } as RateLimitConfig,

  // Report generation - CPU intensive
  reports: {
    windowMs: 5 * 60 * 1000,   // 5 minutes
    maxRequests: 5,             // 5 reports per 5 minutes
    message: 'Report generation rate limit exceeded.',
    blockDuration: 5 * 60 * 1000
  } as RateLimitConfig,

  // File upload - bandwidth protection
  upload: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 20,            // 20 uploads per minute
    message: 'Upload rate limit exceeded. Please wait before uploading more files.',
    blockDuration: 2 * 60 * 1000
  } as RateLimitConfig,

  // Password reset - security critical
  passwordReset: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 3,             // 3 attempts per hour
    message: 'Password reset rate limit exceeded. Please try again later.',
    blockDuration: 60 * 60 * 1000
  } as RateLimitConfig
};

/**
 * In-memory rate limit store implementation
 * Use for development or single-instance deployments
 */
export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetAt: number; firstHit: number }>();

  async increment(key: string, windowMs: number): Promise<RateLimitInfo> {
    const now = Date.now();
    const record = this.store.get(key);

    // No record or expired window
    if (!record || record.resetAt < now) {
      const newRecord = {
        count: 1,
        resetAt: now + windowMs,
        firstHit: now
      };
      this.store.set(key, newRecord);

      return {
        totalHits: 1,
        remainingPoints: Math.max(0, Infinity - 1), // Will be calculated by middleware
        msBeforeNext: windowMs,
        isFirstInDuration: true
      };
    }

    // Increment count
    record.count++;

    return {
      totalHits: record.count,
      remainingPoints: Math.max(0, Infinity - record.count), // Will be calculated by middleware
      msBeforeNext: record.resetAt - now,
      isFirstInDuration: false
    };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  async get(key: string): Promise<RateLimitInfo | null> {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt < now) {
      return null;
    }

    return {
      totalHits: record.count,
      remainingPoints: 0, // Will be calculated by middleware
      msBeforeNext: record.resetAt - now,
      isFirstInDuration: false
    };
  }

  async cleanup(): Promise<number> {
    const now = Date.now();
    let cleaned = 0;

    // Use Array.from to handle iterator compatibility
    const entries = Array.from(this.store.entries());
    for (const [key, record] of entries) {
      if (record.resetAt < now) {
        this.store.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

/**
 * Redis-based rate limit store implementation
 * Use for production and multi-instance deployments
 */
export class RedisRateLimitStore implements RateLimitStore {
  private redisClient: any; // Redis client instance

  constructor(redisClient: any) {
    this.redisClient = redisClient;
  }

  async increment(key: string, windowMs: number): Promise<RateLimitInfo> {
    try {
      const now = Date.now();
      const windowStart = now - windowMs;

      // Use Redis sorted set for sliding window
      const multi = this.redisClient.multi();

      // Remove old entries outside window
      multi.zRemRangeByScore(key, 0, windowStart);

      // Count requests in current window
      multi.zCard(key);

      // Add current request
      multi.zAdd(key, { score: now, value: `${now}-${Math.random()}` });

      // Set expiration
      multi.expire(key, Math.ceil(windowMs / 1000));

      const results = await multi.exec();
      const countResult = results && Array.isArray(results) ? results[1] : null;
      const count = (countResult && typeof countResult === 'object' && 'reply' in countResult) 
        ? (typeof countResult.reply === 'number' ? countResult.reply : 0) 
        : 0;

      const resetAt = now + windowMs;

      return {
        totalHits: count + 1, // +1 for the request we just added
        remainingPoints: 0, // Will be calculated by middleware
        msBeforeNext: resetAt - now,
        isFirstInDuration: count === 0
      };
    } catch (error) {
      logger.error('Redis rate limit increment failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        key
      });
      
      // Fallback to allowing request on Redis failure
      return {
        totalHits: 1,
        remainingPoints: Infinity,
        msBeforeNext: windowMs,
        isFirstInDuration: true
      };
    }
  }

  async reset(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      logger.error('Redis rate limit reset failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        key
      });
    }
  }

  async get(key: string): Promise<RateLimitInfo | null> {
    try {
      const count = await this.redisClient.zCard(key);
      const ttl = await this.redisClient.ttl(key);

      if (typeof count !== 'number' || count === 0) {
        return null;
      }

      const ttlMs = typeof ttl === 'number' ? ttl * 1000 : 0;

      return {
        totalHits: count,
        remainingPoints: 0, // Will be calculated by middleware
        msBeforeNext: ttlMs,
        isFirstInDuration: false
      };
    } catch (error) {
      logger.error('Redis rate limit get failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        key
      });
      return null;
    }
  }

  async cleanup(): Promise<number> {
    // Redis handles cleanup automatically with TTL
    return 0;
  }
}

/**
 * Rate Limiting Middleware Class
 */
export class RateLimitingMiddleware {
  private store: RateLimitStore;
  private defaultKeyGenerator: (identifier: string, ip: string, userId?: string) => string;

  constructor(store?: RateLimitStore) {
    this.store = store || new MemoryRateLimitStore();
    this.defaultKeyGenerator = (identifier, ip, userId) => {
      const userIdentifier = userId || ip;
      return `ratelimit:${identifier}:${userIdentifier}`;
    };

    // Start cleanup timer for memory store
    if (this.store instanceof MemoryRateLimitStore) {
      setInterval(() => {
        this.store.cleanup().then(cleaned => {
          if (cleaned > 0) {
            logger.debug('Cleaned up expired rate limit records', { count: cleaned });
          }
        });
      }, 5 * 60 * 1000); // Cleanup every 5 minutes
    }
  }

  /**
   * Check rate limit for a request
   */
  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig,
    context: RequestContext
  ): Promise<RateLimitResult> {
    try {
      const keyGenerator = config.keyGenerator || this.defaultKeyGenerator;
      const key = keyGenerator(identifier, context.ip, context.userId);

      // Get current rate limit info
      const info = await this.store.increment(key, config.windowMs);

      // Calculate remaining points
      const remainingPoints = Math.max(0, config.maxRequests - info.totalHits);
      const allowed = info.totalHits <= config.maxRequests;

      // Update info with calculated values
      info.remainingPoints = remainingPoints;

      // Log rate limit check
      if (!allowed) {
        logger.warn('Rate limit exceeded', {
          identifier,
          key,
          totalHits: info.totalHits,
          maxRequests: config.maxRequests,
          userId: context.userId,
          ip: context.ip,
          path: context.path,
          method: context.method
        });

        // Call onLimitReached callback if provided
        if (config.onLimitReached) {
          config.onLimitReached(key, info);
        }
      } else {
        logger.debug('Rate limit check passed', {
          identifier,
          totalHits: info.totalHits,
          remainingPoints,
          userId: context.userId,
          ip: context.ip
        });
      }

      if (!allowed) {
        return {
          allowed: false,
          totalHits: info.totalHits,
          remainingPoints: 0,
          msBeforeNext: info.msBeforeNext,
          retryAfter: Math.ceil(info.msBeforeNext / 1000),
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: config.message
          }
        };
      }

      return {
        allowed: true,
        totalHits: info.totalHits,
        remainingPoints,
        msBeforeNext: info.msBeforeNext
      };

    } catch (error) {
      logger.error('Rate limit check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        identifier,
        context
      });

      // Fail open on errors (allow request)
      return {
        allowed: true,
        totalHits: 0,
        remainingPoints: config.maxRequests,
        msBeforeNext: config.windowMs
      };
    }
  }

  /**
   * Create rate limiter function for specific identifier and config
   */
  createRateLimiter(identifier: string, config: RateLimitConfig) {
    return async (context: RequestContext): Promise<RateLimitResult> => {
      return this.checkRateLimit(identifier, config, context);
    };
  }

  /**
   * Clear rate limit for a specific key
   */
  async clearRateLimit(identifier: string, ip: string, userId?: string): Promise<void> {
    const key = this.defaultKeyGenerator(identifier, ip, userId);
    
    try {
      await this.store.reset(key);
      logger.info('Rate limit cleared', { identifier, ip, userId });
    } catch (error) {
      logger.error('Failed to clear rate limit', {
        error: error instanceof Error ? error.message : 'Unknown error',
        identifier,
        ip,
        userId
      });
    }
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(
    identifier: string,
    config: RateLimitConfig,
    ip: string,
    userId?: string
  ): Promise<RateLimitInfo | null> {
    const key = this.defaultKeyGenerator(identifier, ip, userId);
    
    try {
      const info = await this.store.get(key);
      if (info) {
        info.remainingPoints = Math.max(0, config.maxRequests - info.totalHits);
      }
      return info;
    } catch (error) {
      logger.error('Failed to get rate limit status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        identifier,
        ip,
        userId
      });
      return null;
    }
  }

  /**
   * Create multiple rate limiters with different configs
   */
  createMultiRateLimiter(configs: Record<string, RateLimitConfig>) {
    const limiters = Object.entries(configs).map(([identifier, config]) => ({
      identifier,
      limiter: this.createRateLimiter(identifier, config)
    }));

    return async (context: RequestContext): Promise<RateLimitResult[]> => {
      const results = await Promise.all(
        limiters.map(async ({ identifier, limiter }) => ({
          identifier,
          result: await limiter(context)
        }))
      );

      return results.map(({ result }) => result);
    };
  }

  /**
   * Get rate limiting headers for HTTP responses
   */
  getRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'X-RateLimit-Limit': String(config.maxRequests),
      'X-RateLimit-Remaining': String(result.remainingPoints),
      'X-RateLimit-Window': String(config.windowMs)
    };

    if (result.retryAfter) {
      headers['Retry-After'] = String(result.retryAfter);
      headers['X-RateLimit-Reset'] = new Date(Date.now() + result.msBeforeNext).toISOString();
    }

    return headers;
  }

  /**
   * Create factory method
   */
  static create(store?: RateLimitStore): RateLimitingMiddleware {
    return new RateLimitingMiddleware(store);
  }

  /**
   * Create with Redis store
   */
  static createWithRedis(redisClient: any): RateLimitingMiddleware {
    const store = new RedisRateLimitStore(redisClient);
    return new RateLimitingMiddleware(store);
  }

  /**
   * Create with memory store
   */
  static createWithMemory(): RateLimitingMiddleware {
    const store = new MemoryRateLimitStore();
    return new RateLimitingMiddleware(store);
  }
}

/**
 * Factory functions
 */
export function createRateLimitingMiddleware(store?: RateLimitStore): RateLimitingMiddleware {
  return RateLimitingMiddleware.create(store);
}

export function createRedisRateLimiting(redisClient: any): RateLimitingMiddleware {
  return RateLimitingMiddleware.createWithRedis(redisClient);
}

export function createMemoryRateLimiting(): RateLimitingMiddleware {
  return RateLimitingMiddleware.createWithMemory();
}

/**
 * Convenience function to create rate limiter with preset config
 */
export function createPresetRateLimiter(
  preset: keyof typeof RATE_LIMIT_CONFIGS,
  store?: RateLimitStore
): (context: RequestContext) => Promise<RateLimitResult> {
  const middleware = new RateLimitingMiddleware(store);
  const config = RATE_LIMIT_CONFIGS[preset];
  
  return middleware.createRateLimiter(preset, config);
}

/**
 * Default export
 */
export default RateLimitingMiddleware;
