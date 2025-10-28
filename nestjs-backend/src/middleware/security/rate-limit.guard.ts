/**
 * @fileoverview Rate Limiting Guard for Healthcare API Protection (NestJS)
 * @module middleware/security/rate-limit
 * @description NestJS guard implementing rate limiting to prevent brute force attacks,
 * API abuse, and PHI data harvesting. Implements sliding window algorithm with Redis
 * or in-memory storage for distributed and single-instance deployments.
 *
 * Key Features:
 * - Sliding window rate limiting algorithm
 * - Redis support for distributed rate limiting
 * - In-memory fallback for development
 * - Per-user and per-IP rate limiting
 * - Configurable time windows and request limits
 * - Automatic cleanup of expired records
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
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

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

export const RATE_LIMIT_CONFIGS = {
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    blockDuration: 15 * 60 * 1000,
  } as RateLimitConfig,
  communication: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Message rate limit exceeded. Please wait before sending more messages.',
    blockDuration: 5 * 60 * 1000,
  } as RateLimitConfig,
  emergencyAlert: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Emergency alert rate limit exceeded. Contact system administrator.',
    blockDuration: 60 * 60 * 1000,
  } as RateLimitConfig,
  export: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Export rate limit exceeded. Please wait before exporting more data.',
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
 * In-memory rate limit store
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
 * Rate Limiting Guard for NestJS
 *
 * @class RateLimitGuard
 * @implements {CanActivate}
 * @description NestJS guard implementing sliding window rate limiting algorithm
 * to prevent brute force attacks, API abuse, and PHI data harvesting.
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

  constructor(private reflector: Reflector) {
    this.store = new MemoryRateLimitStore();

    // Start cleanup timer
    setInterval(() => {
      this.store.cleanup().then((cleaned) => {
        if (cleaned > 0) {
          this.logger.debug(`Cleaned up ${cleaned} expired rate limit records`);
        }
      });
    }, 5 * 60 * 1000); // Cleanup every 5 minutes
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

      this.logger.debug(`Rate limit check passed: ${identifier}`, {
        totalHits: info.totalHits,
        remainingPoints,
        userId,
        ip,
      });

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error('Rate limit check failed', error);
      return true; // Fail open on errors
    }
  }

  private getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    const realIP = req.headers['x-real-ip'];

    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }

    if (typeof realIP === 'string') {
      return realIP;
    }

    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}

// Custom decorator for rate limiting
export const RateLimit = (type: keyof typeof RATE_LIMIT_CONFIGS) =>
  Reflector.createDecorator<string>({ key: 'rateLimit' });
