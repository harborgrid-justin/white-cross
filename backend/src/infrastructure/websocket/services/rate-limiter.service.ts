/**
 * Rate Limiter Service
 *
 * Implements token bucket algorithm for WebSocket rate limiting to prevent spam
 * and abuse. Provides configurable per-user, per-event rate limiting.
 *
 * Key Features:
 * - Token bucket algorithm for burst handling
 * - Per-user, per-event rate limiting
 * - Configurable limits and refill rates
 * - Automatic cleanup of stale entries
 * - Memory-efficient implementation
 *
 * Algorithm:
 * - Each user has a bucket of tokens for each event type
 * - Tokens refill at a steady rate
 * - Each action consumes one token
 * - If no tokens available, action is rate-limited
 *
 * Usage:
 * ```typescript
 * const allowed = await rateLimiter.checkLimit(userId, 'message:send');
 * if (!allowed) {
 *   throw new WsException('Rate limit exceeded');
 * }
 * ```
 *
 * @class RateLimiterService
 */
import { Injectable, Logger } from '@nestjs/common';

import { BaseService } from '../../../common/base';
/**
 * Rate limit configuration for a specific event type
 */
interface RateLimitConfig {
  /**
   * Maximum number of tokens in the bucket
   */
  maxTokens: number;

  /**
   * Number of tokens to refill per interval
   */
  refillRate: number;

  /**
   * Refill interval in milliseconds
   */
  refillInterval: number;
}

/**
 * Token bucket state for a user and event
 */
interface TokenBucket {
  /**
   * Current number of available tokens
   */
  tokens: number;

  /**
   * Timestamp of last token refill
   */
  lastRefill: number;

  /**
   * Timestamp of last access (for cleanup)
   */
  lastAccess: number;
}

@Injectable()
export class RateLimiterService extends BaseService {
  /**
   * Storage for token buckets
   * Key format: `${userId}:${eventType}`
   */
  private readonly buckets = new Map<string, TokenBucket>();

  /**
   * Rate limit configurations per event type
   */
  private readonly configs = new Map<string, RateLimitConfig>();

  /**
   * Cleanup interval for stale entries (5 minutes)
   */
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000;

  /**
   * Entry TTL - remove entries not accessed for 30 minutes
   */
  private readonly ENTRY_TTL = 30 * 60 * 1000;

  constructor() {
    // Initialize default rate limit configurations
    this.initializeConfigs();

    // Start periodic cleanup
    this.startCleanup();
  }

  /**
   * Checks if an action is allowed under rate limiting
   * Implements token bucket algorithm
   *
   * @param userId - The user ID to check
   * @param eventType - The event type to check
   * @returns True if action is allowed, false if rate limited
   */
  async checkLimit(userId: string, eventType: string): Promise<boolean> {
    const key = this.getBucketKey(userId, eventType);
    const config = this.getConfig(eventType);

    if (!config) {
      // No rate limit configured for this event type
      this.logWarning(`No rate limit config for event type: ${eventType}`);
      return true;
    }

    // Get or create bucket
    let bucket = this.buckets.get(key);

    if (!bucket) {
      // Initialize new bucket with full tokens
      bucket = {
        tokens: config.maxTokens,
        lastRefill: Date.now(),
        lastAccess: Date.now(),
      };
      this.buckets.set(key, bucket);
    }

    // Refill tokens based on elapsed time
    this.refillTokens(bucket, config);

    // Update last access time
    bucket.lastAccess = Date.now();

    // Check if tokens available
    if (bucket.tokens >= 1) {
      // Consume one token
      bucket.tokens -= 1;
      return true;
    } else {
      // Rate limited
      this.logWarning(
        `Rate limit exceeded for user ${userId} on event ${eventType}`,
      );
      return false;
    }
  }

  /**
   * Gets the current token count for a user and event
   *
   * @param userId - The user ID
   * @param eventType - The event type
   * @returns Current token count
   */
  getTokenCount(userId: string, eventType: string): number {
    const key = this.getBucketKey(userId, eventType);
    const bucket = this.buckets.get(key);

    if (!bucket) {
      const config = this.getConfig(eventType);
      return config?.maxTokens || 0;
    }

    const config = this.getConfig(eventType);
    if (config) {
      this.refillTokens(bucket, config);
    }

    return Math.floor(bucket.tokens);
  }

  /**
   * Resets rate limits for a user
   * Useful for testing or admin overrides
   *
   * @param userId - The user ID to reset
   */
  reset(userId: string): void {
    const keysToDelete: string[] = [];

    for (const key of this.buckets.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.buckets.delete(key));

    this.logInfo(`Rate limits reset for user ${userId}`);
  }

  /**
   * Gets rate limit configuration for an event type
   *
   * @param eventType - The event type
   * @returns Rate limit configuration or undefined
   */
  private getConfig(eventType: string): RateLimitConfig | undefined {
    return this.configs.get(eventType);
  }

  /**
   * Refills tokens in a bucket based on elapsed time
   * Implements the token bucket refill logic
   *
   * @param bucket - The token bucket to refill
   * @param config - The rate limit configuration
   */
  private refillTokens(bucket: TokenBucket, config: RateLimitConfig): void {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;

    // Calculate how many refill intervals have passed
    const intervals = Math.floor(elapsed / config.refillInterval);

    if (intervals > 0) {
      // Add tokens based on refill rate
      const tokensToAdd = intervals * config.refillRate;
      bucket.tokens = Math.min(bucket.tokens + tokensToAdd, config.maxTokens);
      bucket.lastRefill = now;
    }
  }

  /**
   * Generates a bucket key for a user and event type
   *
   * @param userId - The user ID
   * @param eventType - The event type
   * @returns Bucket key string
   */
  private getBucketKey(userId: string, eventType: string): string {
    return `${userId}:${eventType}`;
  }

  /**
   * Initializes default rate limit configurations
   * Configures limits for different event types
   */
  private initializeConfigs(): void {
    // message:send - 10 messages per minute (burst of 10, refill 1 every 6 seconds)
    this.configs.set('message:send', {
      maxTokens: 10,
      refillRate: 1,
      refillInterval: 6000, // 6 seconds
    });

    // message:typing - 5 updates per 10 seconds (burst of 5, refill 1 every 2 seconds)
    this.configs.set('message:typing', {
      maxTokens: 5,
      refillRate: 1,
      refillInterval: 2000, // 2 seconds
    });

    // message:edit - 3 edits per minute (burst of 3, refill 1 every 20 seconds)
    this.configs.set('message:edit', {
      maxTokens: 3,
      refillRate: 1,
      refillInterval: 20000, // 20 seconds
    });

    // message:delete - 3 deletes per minute (burst of 3, refill 1 every 20 seconds)
    this.configs.set('message:delete', {
      maxTokens: 3,
      refillRate: 1,
      refillInterval: 20000, // 20 seconds
    });

    // conversation:join - 20 joins per minute (burst of 20, refill 1 every 3 seconds)
    this.configs.set('conversation:join', {
      maxTokens: 20,
      refillRate: 1,
      refillInterval: 3000, // 3 seconds
    });

    this.logInfo('Rate limit configurations initialized');
  }

  /**
   * Starts periodic cleanup of stale entries
   * Removes buckets that haven't been accessed recently
   */
  private startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);

    this.logInfo('Rate limiter cleanup scheduler started');
  }

  /**
   * Cleans up stale bucket entries
   * Removes entries that haven't been accessed within TTL
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastAccess > this.ENTRY_TTL) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => this.buckets.delete(key));

    if (keysToDelete.length > 0) {
      this.logDebug(
        `Cleaned up ${keysToDelete.length} stale rate limit entries`,
      );
    }
  }

  /**
   * Gets statistics about rate limiter state
   *
   * @returns Statistics object
   */
  getStats(): { totalBuckets: number; eventTypes: string[] } {
    return {
      totalBuckets: this.buckets.size,
      eventTypes: Array.from(this.configs.keys()),
    };
  }
}
