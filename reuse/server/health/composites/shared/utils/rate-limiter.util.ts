/**
 * LOC: HLTH-SHARED-UTILS-001
 * File: /reuse/server/health/composites/shared/utils/rate-limiter.util.ts
 * PURPOSE: Token bucket rate limiting for external API calls
 * CRITICAL: Prevents API throttling and service disruptions
 */

import { Logger } from '@nestjs/common';

export interface RateLimiterConfig {
  maxRequests: number; // Maximum requests per window
  windowMs: number; // Time window in milliseconds
  burstSize?: number; // Optional burst capacity
  minTime?: number; // Minimum time between requests (ms)
}

export class RateLimiter {
  private readonly logger = new Logger(`RateLimiter:${this.name}`);
  private tokens: number;
  private lastRefill: number;
  private queue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
    timestamp: number;
  }> = [];
  private processing = false;

  constructor(
    private readonly name: string,
    private readonly config: RateLimiterConfig,
  ) {
    this.tokens = config.burstSize || config.maxRequests;
    this.lastRefill = Date.now();
    this.startRefillTimer();
  }

  /**
   * Acquire a token, waiting if necessary
   */
  async acquire(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, timestamp: Date.now() });
      this.processQueue();
    });
  }

  /**
   * Try to acquire a token without waiting
   */
  tryAcquire(): boolean {
    this.refillTokens();

    if (this.tokens > 0) {
      this.tokens--;
      this.logger.debug(`Token acquired (${this.tokens} remaining)`);
      return true;
    }

    this.logger.debug(`Token acquisition failed (rate limit reached)`);
    return false;
  }

  /**
   * Execute function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    return await fn();
  }

  /**
   * Get current rate limiter status
   */
  getStatus(): {
    availableTokens: number;
    queueLength: number;
    requestsPerSecond: number;
  } {
    this.refillTokens();
    return {
      availableTokens: this.tokens,
      queueLength: this.queue.length,
      requestsPerSecond: (this.config.maxRequests / this.config.windowMs) * 1000,
    };
  }

  /**
   * Reset rate limiter state
   */
  reset(): void {
    this.tokens = this.config.burstSize || this.config.maxRequests;
    this.queue = [];
    this.lastRefill = Date.now();
    this.logger.log('Rate limiter reset');
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private processQueue(): void {
    if (this.processing) return;
    this.processing = true;

    const processNext = () => {
      if (this.queue.length === 0) {
        this.processing = false;
        return;
      }

      this.refillTokens();

      if (this.tokens > 0) {
        this.tokens--;
        const request = this.queue.shift()!;

        // Check if request has timed out (optional)
        const age = Date.now() - request.timestamp;
        if (age > 30000) { // 30 second timeout
          request.reject(new Error('Rate limiter queue timeout'));
          setImmediate(processNext);
          return;
        }

        request.resolve();

        // Apply minimum time between requests if configured
        if (this.config.minTime) {
          setTimeout(processNext, this.config.minTime);
        } else {
          setImmediate(processNext);
        }
      } else {
        // Wait for next refill
        const waitTime = this.getTimeUntilNextRefill();
        setTimeout(processNext, waitTime);
      }
    };

    processNext();
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const refillAmount = (timePassed / this.config.windowMs) * this.config.maxRequests;

    if (refillAmount >= 1) {
      const maxTokens = this.config.burstSize || this.config.maxRequests;
      this.tokens = Math.min(this.tokens + Math.floor(refillAmount), maxTokens);
      this.lastRefill = now;

      if (refillAmount >= 1) {
        this.logger.debug(`Tokens refilled: ${this.tokens}/${maxTokens}`);
      }
    }
  }

  private getTimeUntilNextRefill(): number {
    const timePassed = Date.now() - this.lastRefill;
    const timePerToken = this.config.windowMs / this.config.maxRequests;
    const timeUntilNext = Math.max(timePerToken - timePassed, 0);
    return timeUntilNext;
  }

  private startRefillTimer(): void {
    // Periodically refill tokens
    setInterval(() => {
      this.refillTokens();
    }, Math.min(this.config.windowMs / 10, 1000)); // Check every second or 1/10 window
  }
}

/**
 * Rate limiter factory for common healthcare API services
 */
export class RateLimiterFactory {
  private static limiters = new Map<string, RateLimiter>();

  /**
   * HIE Network rate limiter (CommonWell/Carequality)
   * Rate: 10 req/sec with burst of 20
   */
  static getHIELimiter(): RateLimiter {
    return this.getOrCreate('HIE', {
      maxRequests: 10,
      windowMs: 1000,
      burstSize: 20,
      minTime: 50, // 50ms between requests
    });
  }

  /**
   * Insurance clearinghouse rate limiter
   * Rate: 15 req/min
   */
  static getInsuranceLimiter(): RateLimiter {
    return this.getOrCreate('Insurance', {
      maxRequests: 15,
      windowMs: 60000,
      minTime: 100,
    });
  }

  /**
   * Epic EHR rate limiter
   * Rate: 600 req/min (10 req/sec)
   */
  static getEpicLimiter(): RateLimiter {
    return this.getOrCreate('Epic', {
      maxRequests: 600,
      windowMs: 60000,
      burstSize: 20,
      minTime: 100,
    });
  }

  /**
   * Cerner Millennium rate limiter
   * Rate: 120 req/min (2 req/sec)
   */
  static getCernerLimiter(): RateLimiter {
    return this.getOrCreate('Cerner', {
      maxRequests: 120,
      windowMs: 60000,
      burstSize: 10,
      minTime: 500,
    });
  }

  /**
   * Athenahealth rate limiter
   * Rate: 300 req/min (5 req/sec)
   */
  static getAthenaLimiter(): RateLimiter {
    return this.getOrCreate('Athena', {
      maxRequests: 300,
      windowMs: 60000,
      burstSize: 15,
      minTime: 200,
    });
  }

  /**
   * Laboratory interface rate limiter
   * Rate: Configurable per lab
   */
  static getLabLimiter(labName: string, maxRequests = 60, windowMs = 60000): RateLimiter {
    return this.getOrCreate(`Lab:${labName}`, {
      maxRequests,
      windowMs,
      minTime: 100,
    });
  }

  /**
   * Get or create rate limiter
   */
  private static getOrCreate(name: string, config: RateLimiterConfig): RateLimiter {
    if (!this.limiters.has(name)) {
      this.limiters.set(name, new RateLimiter(name, config));
    }
    return this.limiters.get(name)!;
  }

  /**
   * Get all rate limiter statuses (for monitoring)
   */
  static getAllStatuses(): Record<string, any> {
    const statuses: Record<string, any> = {};
    this.limiters.forEach((limiter, name) => {
      statuses[name] = limiter.getStatus();
    });
    return statuses;
  }

  /**
   * Reset all rate limiters
   */
  static resetAll(): void {
    this.limiters.forEach((limiter) => limiter.reset());
  }
}

/**
 * Rate limiter decorator for methods
 */
export function RateLimited(limiterFactory: () => RateLimiter): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const limiter = limiterFactory();
      await limiter.acquire();
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
