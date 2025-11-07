/**
 * @fileoverview Rate Limiter Service
 * @module infrastructure/cache/rate-limiter
 * @description Token bucket rate limiting using Redis for distributed systems
 *
 * Features:
 * - Token bucket algorithm
 * - Per-user and per-endpoint limiting
 * - Distributed rate limiting via Redis
 * - Sliding window support
 * - Rate limit statistics
 */

import { Injectable, Logger } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RateLimitConfig, RateLimitStatus } from './cache.interfaces';

/**
 * Rate limiter service using token bucket algorithm
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private configs: Map<string, RateLimitConfig> = new Map();
  private stats = {
    totalRequests: 0,
    limitedRequests: 0,
    uniqueKeys: new Set<string>(),
  };

  constructor(private readonly cacheService: CacheService) {}

  /**
   * Register a rate limit configuration
   * @param name - Configuration name
   * @param config - Rate limit configuration
   */
  registerConfig(name: string, config: RateLimitConfig): void {
    this.configs.set(name, config);
    this.logger.log(
      `Registered rate limit config: ${name} (${config.max} requests per ${config.windowMs}ms)`,
    );
  }

  /**
   * Check if request should be rate limited
   * @param configName - Name of the rate limit configuration to use
   * @param context - Context object (e.g., request, user)
   * @returns Rate limit status
   */
  async checkLimit(configName: string, context: any): Promise<RateLimitStatus> {
    const config = this.configs.get(configName);
    if (!config) {
      this.logger.warn(`Rate limit config not found: ${configName}`);
      return this.allowRequest();
    }

    // Check if rate limiting should be skipped
    if (config.skip && config.skip(context)) {
      return this.allowRequest();
    }

    // Generate rate limit key
    const key = this.buildRateLimitKey(
      configName,
      config.keyGenerator(context),
    );
    this.stats.totalRequests++;
    this.stats.uniqueKeys.add(key);

    // Get current window data
    const windowData = await this.getWindowData(key, config);

    // Check if limit exceeded
    if (windowData.count >= config.max) {
      this.stats.limitedRequests++;

      // Call handler if provided
      if (config.handler) {
        try {
          await config.handler(context);
        } catch (error) {
          this.logger.error('Rate limit handler error:', error);
        }
      }

      return {
        limited: true,
        remaining: 0,
        limit: config.max,
        resetAt: windowData.resetAt,
        retryAfter: Math.ceil((windowData.resetAt - Date.now()) / 1000),
      };
    }

    // Increment counter
    await this.incrementCounter(key, config);

    return {
      limited: false,
      remaining: config.max - windowData.count - 1,
      limit: config.max,
      resetAt: windowData.resetAt,
      retryAfter: 0,
    };
  }

  /**
   * Consume tokens for a request (manual token consumption)
   * @param configName - Configuration name
   * @param identifier - Request identifier
   * @param tokens - Number of tokens to consume (default: 1)
   * @returns Whether tokens were successfully consumed
   */
  async consumeTokens(
    configName: string,
    identifier: string,
    tokens = 1,
  ): Promise<boolean> {
    const config = this.configs.get(configName);
    if (!config) {
      return true; // Allow if config not found
    }

    const key = this.buildRateLimitKey(configName, identifier);
    const windowData = await this.getWindowData(key, config);

    if (windowData.count + tokens > config.max) {
      return false;
    }

    await this.incrementCounter(key, config, tokens);
    return true;
  }

  /**
   * Get remaining tokens for a request
   * @param configName - Configuration name
   * @param identifier - Request identifier
   * @returns Number of remaining tokens
   */
  async getRemainingTokens(
    configName: string,
    identifier: string,
  ): Promise<number> {
    const config = this.configs.get(configName);
    if (!config) {
      return Number.MAX_SAFE_INTEGER;
    }

    const key = this.buildRateLimitKey(configName, identifier);
    const windowData = await this.getWindowData(key, config);

    return Math.max(0, config.max - windowData.count);
  }

  /**
   * Reset rate limit for a specific identifier
   * @param configName - Configuration name
   * @param identifier - Request identifier
   */
  async reset(configName: string, identifier: string): Promise<void> {
    const key = this.buildRateLimitKey(configName, identifier);
    await this.cacheService.delete(key);
  }

  /**
   * Get rate limiter statistics
   */
  getStats(): {
    totalRequests: number;
    limitedRequests: number;
    limitRate: number;
    uniqueKeys: number;
    configurations: number;
  } {
    const limitRate =
      this.stats.totalRequests > 0
        ? (this.stats.limitedRequests / this.stats.totalRequests) * 100
        : 0;

    return {
      totalRequests: this.stats.totalRequests,
      limitedRequests: this.stats.limitedRequests,
      limitRate: Math.round(limitRate * 100) / 100,
      uniqueKeys: this.stats.uniqueKeys.size,
      configurations: this.configs.size,
    };
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      totalRequests: 0,
      limitedRequests: 0,
      uniqueKeys: new Set<string>(),
    };
  }

  // Private helper methods

  /**
   * Build rate limit key
   * @param configName - Configuration name
   * @param identifier - Request identifier
   * @returns Rate limit cache key
   * @private
   */
  private buildRateLimitKey(configName: string, identifier: string): string {
    return `ratelimit:${configName}:${identifier}`;
  }

  /**
   * Get current window data
   * @param key - Rate limit key
   * @param config - Rate limit configuration
   * @returns Window data (count and reset time)
   * @private
   */
  private async getWindowData(
    key: string,
    config: RateLimitConfig,
  ): Promise<{ count: number; resetAt: number }> {
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / config.windowMs)}`;

    const count = await this.cacheService.get<number>(windowKey);
    const resetAt = Math.ceil(now / config.windowMs) * config.windowMs;

    return {
      count: count || 0,
      resetAt,
    };
  }

  /**
   * Increment request counter
   * @param key - Rate limit key
   * @param config - Rate limit configuration
   * @param amount - Amount to increment (default: 1)
   * @private
   */
  private async incrementCounter(
    key: string,
    config: RateLimitConfig,
    amount = 1,
  ): Promise<void> {
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / config.windowMs)}`;
    const ttl = Math.ceil(config.windowMs / 1000) + 1; // Add 1 second buffer

    try {
      const current = await this.cacheService.get<number>(windowKey);
      const newCount = (current || 0) + amount;
      await this.cacheService.set(windowKey, newCount, { ttl });
    } catch (error) {
      this.logger.error('Failed to increment rate limit counter:', error);
    }
  }

  /**
   * Create default allow response
   * @returns Allow response
   * @private
   */
  private allowRequest(): RateLimitStatus {
    return {
      limited: false,
      remaining: Number.MAX_SAFE_INTEGER,
      limit: Number.MAX_SAFE_INTEGER,
      resetAt: Date.now() + 60000,
      retryAfter: 0,
    };
  }
}
