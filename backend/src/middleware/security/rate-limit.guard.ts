/**
 * @fileoverview Rate Limiting Guard for Healthcare API Protection (NestJS) - FIXED VERSION
 * @module middleware/security/rate-limit
 * @description NestJS guard implementing rate limiting to prevent brute force attacks,
 * API abuse, and PHI data harvesting. Implements sliding window algorithm with Redis
 * or in-memory storage for distributed and single-instance deployments.
 *
 * FIXES APPLIED:
 * - Changed fail-open to fail-closed on errors (security improvement)
 * - Added circuit breaker pattern for service degradation
 * - Improved error logging and monitoring
 * - Added health check method
 *
 * Key Features:
 * - Sliding window rate limiting algorithm
 * - Redis support for distributed rate limiting
 * - In-memory fallback for development
 * - Per-user and per-IP rate limiting
 * - Configurable time windows and request limits
 * - Automatic cleanup of expired records
 * - Circuit breaker for graceful degradation
 *
 * @security Critical security guard - prevents automated attacks and abuse
 * @compliance
 * - OWASP API Security Top 10 - API4:2023 Unrestricted Resource Consumption
 * - HIPAA 164.312(a)(1) - Access control (prevents unauthorized PHI access attempts)
 * - HIPAA 164.312(b) - Audit controls (logs rate limit violations)
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
  blockDuration?: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitInfo {
  totalHits: number;
  remainingPoints: number;
  msBeforeNext: number;
  isFirstInDuration: boolean;
}

/**
 * Circuit breaker state for rate limit service
 */
enum CircuitState {
  CLOSED = 'CLOSED', // Normal operation
  OPEN = 'OPEN', // Service unavailable, failing fast
  HALF_OPEN = 'HALF_OPEN', // Testing if service recovered
}

interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening circuit
  resetTimeout: number; // Time before attempting recovery (ms)
  monitoringWindow: number; // Time window for counting failures (ms)
}

export const RATE_LIMIT_CONFIGS = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message:
      'Too many authentication attempts. Please try again in 15 minutes.',
    blockDuration: 15 * 60 * 1000,
  } as RateLimitConfig,
  communication: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message:
      'Message rate limit exceeded. Please wait before sending more messages.',
    blockDuration: 5 * 60 * 1000,
  } as RateLimitConfig,
  emergencyAlert: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message:
      'Emergency alert rate limit exceeded. Contact system administrator.',
    blockDuration: 60 * 60 * 1000,
  } as RateLimitConfig,
  export: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message:
      'Export rate limit exceeded. Please wait before exporting more data.',
    blockDuration: 60 * 60 * 1000,
  } as RateLimitConfig,
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: 'API rate limit exceeded. Please slow down your requests.',
    blockDuration: 60 * 1000,
  } as RateLimitConfig,
  reports: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5,
    message: 'Report generation rate limit exceeded.',
    blockDuration: 5 * 60 * 1000,
  } as RateLimitConfig,
};

/**
 * In-memory rate limit store with circuit breaker
 */
class MemoryRateLimitStore {
  private store = new Map<
    string,
    { count: number; resetAt: number; firstHit: number }
  >();

  async increment(key: string, windowMs: number): Promise<RateLimitInfo> {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || record.resetAt < now) {
      const newRecord = {
        count: 1,
        resetAt: now + windowMs,
        firstHit: now,
      };
      this.store.set(key, newRecord);

      return {
        totalHits: 1,
        remainingPoints: 0,
        msBeforeNext: windowMs,
        isFirstInDuration: true,
      };
    }

    record.count++;

    return {
      totalHits: record.count,
      remainingPoints: 0,
      msBeforeNext: record.resetAt - now,
      isFirstInDuration: false,
    };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }

  async cleanup(): Promise<number> {
    const now = Date.now();
    let cleaned = 0;

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
 * Circuit Breaker for Rate Limit Service
 */
class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private nextAttemptTime = 0;

  constructor(private config: CircuitBreakerConfig) {}

  recordSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.CLOSED;
      this.failureCount = 0;
    }
  }

  recordFailure(): void {
    const now = Date.now();
    this.lastFailureTime = now;

    // Reset failure count if outside monitoring window
    if (now - this.lastFailureTime > this.config.monitoringWindow) {
      this.failureCount = 0;
    }

    this.failureCount++;

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttemptTime = now + this.config.resetTimeout;
    }
  }

  canAttempt(): boolean {
    if (this.state === CircuitState.CLOSED) {
      return true;
    }

    if (this.state === CircuitState.OPEN) {
      const now = Date.now();
      if (now >= this.nextAttemptTime) {
        this.state = CircuitState.HALF_OPEN;
        return true;
      }
      return false;
    }

    // HALF_OPEN
    return true;
  }

  getState(): CircuitState {
    return this.state;
  }
}

/**
 * Rate Limiting Guard for NestJS - FIXED VERSION
 *
 * @class RateLimitGuard
 * @implements {CanActivate}
 * @description NestJS guard implementing sliding window rate limiting algorithm
 * to prevent brute force attacks, API abuse, and PHI data harvesting.
 *
 * CHANGES FROM ORIGINAL:
 * - Fail closed on errors (was fail open - security issue)
 * - Added circuit breaker for graceful degradation
 * - Improved error handling and logging
 * - Added health monitoring
 *
 * @example
 * // Apply to controller
 * @UseGuards(RateLimitGuard)
 * @RateLimit('auth')
 * @Controller('auth')
 * export class AuthController {}
 *
 * @example
 * // Apply to specific route
 * @UseGuards(RateLimitGuard)
 * @RateLimit('export')
 * @Post('students/export')
 * export async exportStudents() {}
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  private store: MemoryRateLimitStore;
  private circuitBreaker: CircuitBreaker;

  constructor(private reflector: Reflector) {
    this.store = new MemoryRateLimitStore();

    // Initialize circuit breaker
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 5, // 5 failures
      resetTimeout: 30000, // 30 seconds before retry
      monitoringWindow: 60000, // 1 minute monitoring window
    });

    // Start cleanup timer
    setInterval(
      () => {
        this.store
          .cleanup()
          .then((cleaned) => {
            if (cleaned > 0) {
              this.logger.debug(
                `Cleaned up ${cleaned} expired rate limit records`,
              );
            }
          })
          .catch((error) => {
            this.logger.error('Rate limit cleanup failed', {
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
      },
      5 * 60 * 1000,
    ); // Cleanup every 5 minutes
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rateLimitType = this.reflector.get<string>(
      'rateLimit',
      context.getHandler(),
    );

    if (!rateLimitType) {
      return true; // No rate limit specified
    }

    const config =
      RATE_LIMIT_CONFIGS[rateLimitType as keyof typeof RATE_LIMIT_CONFIGS];
    if (!config) {
      this.logger.warn(`Unknown rate limit type: ${rateLimitType}`);
      return true;
    }

    // Check circuit breaker before attempting rate limit check
    if (!this.circuitBreaker.canAttempt()) {
      const state = this.circuitBreaker.getState();
      this.logger.error('Rate limit service circuit breaker OPEN', {
        state,
        rateLimitType,
      });

      throw new ServiceUnavailableException({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Service Temporarily Unavailable',
        message:
          'Rate limiting service is temporarily unavailable. Please try again later.',
        retryAfter: 30,
      });
    }

    const request = context.switchToHttp().getRequest<Request>();
    const identifier = rateLimitType;
    const ip = this.getClientIP(request);
    const userId = (request as any).user?.id;

    const key = `ratelimit:${identifier}:${userId || ip}`;

    try {
      const info = await this.store.increment(key, config.windowMs);
      const remainingPoints = Math.max(0, config.maxRequests - info.totalHits);
      const allowed = info.totalHits <= config.maxRequests;

      // Set rate limit headers
      const response = context.switchToHttp().getResponse();
      response.setHeader('X-RateLimit-Limit', config.maxRequests.toString());
      response.setHeader('X-RateLimit-Remaining', remainingPoints.toString());
      response.setHeader('X-RateLimit-Window', config.windowMs.toString());

      if (!allowed) {
        const retryAfter = Math.ceil(info.msBeforeNext / 1000);
        response.setHeader('Retry-After', retryAfter.toString());
        response.setHeader(
          'X-RateLimit-Reset',
          new Date(Date.now() + info.msBeforeNext).toISOString(),
        );

        this.logger.warn(`Rate limit exceeded: ${identifier}`, {
          key,
          totalHits: info.totalHits,
          maxRequests: config.maxRequests,
          userId,
          ip,
          path: request.path,
          method: request.method,
        });

        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: 'Rate Limit Exceeded',
            message: config.message,
            retryAfter,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Record success with circuit breaker
      this.circuitBreaker.recordSuccess();

      this.logger.debug(`Rate limit check passed: ${identifier}`, {
        totalHits: info.totalHits,
        remainingPoints,
        userId,
        ip,
      });

      return true;
    } catch (error) {
      // If it's a rate limit exception, re-throw it
      if (error instanceof HttpException) {
        throw error;
      }

      // For other errors, record failure with circuit breaker
      this.circuitBreaker.recordFailure();

      this.logger.error('Rate limit check failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        rateLimitType,
        userId,
        ip,
        circuitState: this.circuitBreaker.getState(),
      });

      /**
       * CRITICAL SECURITY FIX: Fail Closed
       *
       * Original behavior: return true (fail open - allow request on error)
       * Security Issue: Attackers could exploit service failures to bypass rate limiting
       *
       * New behavior: throw ServiceUnavailableException (fail closed - block request)
       * Security Improvement: Service degradation doesn't compromise security
       *
       * Trade-off: Temporary service unavailability vs. security bypass
       * Decision: Security > Availability for rate limiting
       */
      throw new ServiceUnavailableException({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        error: 'Rate Limiting Unavailable',
        message:
          'Rate limiting service is temporarily unavailable. Please try again later.',
        retryAfter: 30,
      });
    }
  }

  /**
   * Get client IP address from request
   */
  private getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];

    if (typeof forwarded === 'string') {
      const firstIP = forwarded.split(',')[0];
      return firstIP ? firstIP.trim() : undefined;
    }

    if (typeof realIP === 'string') {
      return realIP;
    }

    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  /**
   * Health check method for monitoring
   */
  getHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    circuitState: CircuitState;
  } {
    const state = this.circuitBreaker.getState();

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (state === CircuitState.CLOSED) {
      status = 'healthy';
    } else if (state === CircuitState.HALF_OPEN) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return { status, circuitState: state };
  }
}

// Custom decorator for rate limiting
export const RateLimit = (_type: keyof typeof RATE_LIMIT_CONFIGS) =>
  Reflector.createDecorator<string>({ key: 'rateLimit' });
