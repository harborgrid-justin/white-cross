import { Injectable, Logger } from '@nestjs/common';

/**
 * Rate limiter configuration
 */
export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Rate limiter status
 */
export interface RateLimiterStatus {
  current: number;
  max: number;
  window: number;
  remaining: number;
}

/**
 * Rate Limiter Service
 * Implements sliding window rate limiting for external API calls
 */
@Injectable()
export class RateLimiterService {
  private readonly logger = new Logger(RateLimiterService.name);
  private readonly limiters = new Map<
    string,
    {
      timestamps: number[];
      config: RateLimiterConfig;
    }
  >();

  /**
   * Initialize a rate limiter for a specific service
   */
  initialize(
    serviceName: string,
    config: Partial<RateLimiterConfig> = {},
  ): void {
    const defaultConfig: RateLimiterConfig = {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    };

    this.limiters.set(serviceName, {
      timestamps: [],
      config: { ...defaultConfig, ...config },
    });

    this.logger.log(
      `Rate limiter initialized for ${serviceName}: ${defaultConfig.maxRequests} requests per ${defaultConfig.windowMs}ms`,
    );
  }

  /**
   * Check and record a request
   * Throws error if rate limit is exceeded
   */
  checkLimit(serviceName: string): void {
    if (!this.limiters.has(serviceName)) {
      this.initialize(serviceName);
    }

    const limiter = this.limiters.get(serviceName)!;
    const now = Date.now();
    const windowStart = now - limiter.config.windowMs;

    // Remove old timestamps
    limiter.timestamps = limiter.timestamps.filter((ts) => ts > windowStart);

    // Check if limit exceeded
    if (limiter.timestamps.length >= limiter.config.maxRequests) {
      const oldestTimestamp = limiter.timestamps[0];
      if (oldestTimestamp !== undefined) {
        const waitTime = oldestTimestamp + limiter.config.windowMs - now;

        this.logger.warn(
          `Rate limit exceeded for ${serviceName}. Wait ${waitTime}ms`,
        );

        throw new Error(
          `Rate limit exceeded for ${serviceName}. ` +
            `Max ${limiter.config.maxRequests} requests per ${limiter.config.windowMs}ms. ` +
            `Try again in ${Math.ceil(waitTime / 1000)}s.`,
        );
      }
    }

    // Record this request
    limiter.timestamps.push(now);
  }

  /**
   * Get rate limiter status
   */
  getStatus(serviceName: string): RateLimiterStatus | null {
    const limiter = this.limiters.get(serviceName);
    if (!limiter) return null;

    const now = Date.now();
    const windowStart = now - limiter.config.windowMs;
    const currentRequests = limiter.timestamps.filter(
      (ts) => ts > windowStart,
    ).length;

    return {
      current: currentRequests,
      max: limiter.config.maxRequests,
      window: limiter.config.windowMs,
      remaining: limiter.config.maxRequests - currentRequests,
    };
  }

  /**
   * Reset rate limiter (for testing or manual intervention)
   */
  reset(serviceName: string): void {
    const limiter = this.limiters.get(serviceName);
    if (!limiter) return;

    limiter.timestamps = [];
    this.logger.log(`${serviceName} rate limiter reset`);
  }
}
