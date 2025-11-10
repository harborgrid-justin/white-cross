/**
 * LOC: RATELIMIT001
 * File: rate-limiting/redis-rate-limiter.service.ts
 * Purpose: Redis-based distributed rate limiting for horizontal scaling
 *
 * SECURITY FIX: Replaces in-memory rate limiting with Redis-backed distributed solution
 * that works across multiple server instances.
 */

import { Injectable, Logger } from '@nestjs/common';

/**
 * Redis client interface
 */
export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<string | null>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  del(key: string): Promise<number>;
  ttl(key: string): Promise<number>;
}

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  ttl: number; // Time window in seconds
  limit: number; // Max requests per window
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number; // Unix timestamp when limit resets
  retryAfter?: number; // Seconds until can retry
}

/**
 * Mock Redis client for development/testing
 */
class MockRedisClient implements IRedisClient {
  private store: Map<string, { value: string; expiry: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, options?: { EX?: number; NX?: boolean }): Promise<string | null> {
    if (options?.NX && this.store.has(key)) {
      return null; // Key already exists
    }

    const expiry = options?.EX
      ? Date.now() + options.EX * 1000
      : Date.now() + 3600000; // 1 hour default

    this.store.set(key, { value, expiry });
    return 'OK';
  }

  async incr(key: string): Promise<number> {
    const current = await this.get(key);
    const newValue = current ? parseInt(current, 10) + 1 : 1;
    await this.set(key, newValue.toString());
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return 0;

    entry.expiry = Date.now() + seconds * 1000;
    return 1;
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (!entry) return -2;

    const remaining = Math.floor((entry.expiry - Date.now()) / 1000);
    return remaining > 0 ? remaining : -1;
  }
}

/**
 * Redis Rate Limiter Service
 *
 * Provides distributed rate limiting using Redis for multi-instance deployments.
 * Uses sliding window counter algorithm for accurate rate limiting.
 *
 * @example
 * ```typescript
 * const limiter = new RedisRateLimiterService();
 * const result = await limiter.checkRateLimit('user:123', { ttl: 60, limit: 100 });
 * if (!result.allowed) {
 *   throw new TooManyRequestsException('Rate limit exceeded');
 * }
 * ```
 */
@Injectable()
export class RedisRateLimiterService {
  private readonly logger = new Logger(RedisRateLimiterService.name);
  private redis: IRedisClient;

  constructor(redisClient?: IRedisClient) {
    if (redisClient) {
      this.redis = redisClient;
    } else {
      // Use mock Redis for development
      this.redis = new MockRedisClient();
      this.logger.warn('⚠️  Using MockRedisClient - replace with real Redis in production');
    }
  }

  /**
   * Check rate limit for a key
   *
   * @param key - Unique identifier (user ID, IP, etc.)
   * @param config - Rate limit configuration
   * @returns Rate limit result
   */
  async checkRateLimit(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const redisKey = `ratelimit:${key}`;
    const now = Date.now();

    try {
      // Get current count
      const currentStr = await this.redis.get(redisKey);
      let current = currentStr ? parseInt(currentStr, 10) : 0;

      // Check if limit exceeded
      if (current >= config.limit) {
        const ttl = await this.redis.ttl(redisKey);
        const resetTime = now + (ttl * 1000);

        return {
          allowed: false,
          limit: config.limit,
          remaining: 0,
          resetTime,
          retryAfter: ttl > 0 ? ttl : config.ttl,
        };
      }

      // Increment counter
      const newCount = await this.redis.incr(redisKey);

      // Set expiry if this is the first request in window
      if (newCount === 1) {
        await this.redis.expire(redisKey, config.ttl);
      }

      const ttl = await this.redis.ttl(redisKey);
      const resetTime = now + (ttl * 1000);

      return {
        allowed: true,
        limit: config.limit,
        remaining: Math.max(0, config.limit - newCount),
        resetTime,
      };
    } catch (error) {
      this.logger.error(`Rate limit check failed for key ${key}:`, error);

      // Fail open - allow request if rate limiting fails
      return {
        allowed: true,
        limit: config.limit,
        remaining: config.limit,
        resetTime: now + config.ttl * 1000,
      };
    }
  }

  /**
   * Reset rate limit for a key
   */
  async resetRateLimit(key: string): Promise<void> {
    const redisKey = `ratelimit:${key}`;
    try {
      await this.redis.del(redisKey);
      this.logger.debug(`Rate limit reset for key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to reset rate limit for ${key}:`, error);
    }
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus(key: string, limit: number): Promise<{
    current: number;
    remaining: number;
    ttl: number;
  }> {
    const redisKey = `ratelimit:${key}`;

    try {
      const currentStr = await this.redis.get(redisKey);
      const current = currentStr ? parseInt(currentStr, 10) : 0;
      const ttl = await this.redis.ttl(redisKey);

      return {
        current,
        remaining: Math.max(0, limit - current),
        ttl: ttl > 0 ? ttl : 0,
      };
    } catch (error) {
      this.logger.error(`Failed to get rate limit status for ${key}:`, error);
      return { current: 0, remaining: limit, ttl: 0 };
    }
  }

  /**
   * Apply rate limit with multiple tiers (short, medium, long)
   */
  async checkMultiTierRateLimit(
    key: string,
    tiers: Array<{ name: string; config: RateLimitConfig }>,
  ): Promise<RateLimitResult> {
    // Check all tiers, return first violation
    for (const tier of tiers) {
      const tierKey = `${key}:${tier.name}`;
      const result = await this.checkRateLimit(tierKey, tier.config);

      if (!result.allowed) {
        this.logger.warn(`Rate limit exceeded for ${key} on tier ${tier.name}`);
        return result;
      }
    }

    // All tiers passed
    const primaryTier = tiers[0];
    const primaryResult = await this.checkRateLimit(key, primaryTier.config);

    return primaryResult;
  }
}

export { RedisRateLimiterService };
