/**
 * LOC: RLGUARD001
 * File: guards/rate-limit.guard.ts
 * Purpose: Rate limiting guard using Redis for distributed rate limiting
 *
 * SECURITY FIX: Prevents DDoS and brute-force attacks with Redis-backed rate limiting
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
import { Request, Response } from 'express';
import { RedisRateLimiterService, RateLimitConfig } from '../rate-limiting/redis-rate-limiter.service';
import { AuthenticatedRequest } from './jwt-auth.guard';

/**
 * Metadata keys for rate limit configuration
 */
export const RATE_LIMIT_TTL_KEY = 'rateLimitTtl';
export const RATE_LIMIT_MAX_KEY = 'rateLimitMax';

/**
 * Default rate limit configuration
 */
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  ttl: 60, // 1 minute
  limit: 100, // 100 requests per minute
};

/**
 * Rate Limit Guard
 *
 * Enforces rate limiting on endpoints using Redis for distributed tracking.
 * Tracks by user ID (if authenticated) or IP address (if anonymous).
 *
 * @example
 * ```typescript
 * @Controller('api/v1/auth')
 * @UseGuards(RateLimitGuard)
 * export class AuthController {
 *   @Post('login')
 *   @RateLimit(5, 3600) // 5 attempts per hour
 *   login(@Body() dto: LoginDto) {
 *     return this.authService.login(dto);
 *   }
 * }
 * ```
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimiter: RedisRateLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    // Get rate limit configuration from decorator or use defaults
    const ttl = this.reflector.get<number>(RATE_LIMIT_TTL_KEY, context.getHandler())
      || DEFAULT_RATE_LIMIT.ttl;
    const limit = this.reflector.get<number>(RATE_LIMIT_MAX_KEY, context.getHandler())
      || this.getDefaultLimitForUser(request);

    const config: RateLimitConfig = { ttl, limit };

    // Get tracking key (user ID or IP)
    const key = this.getTrackingKey(request);

    // Check rate limit
    const result = await this.rateLimiter.checkRateLimit(key, config);

    // Set rate limit headers
    response.setHeader('X-RateLimit-Limit', result.limit.toString());
    response.setHeader('X-RateLimit-Remaining', result.remaining.toString());
    response.setHeader('X-RateLimit-Reset', result.resetTime.toString());

    if (!result.allowed) {
      response.setHeader('Retry-After', (result.retryAfter || ttl).toString());

      this.logger.warn(
        `Rate limit exceeded for ${key} on ${request.method} ${request.url} ` +
        `(limit: ${limit}, window: ${ttl}s)`
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: result.retryAfter,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  /**
   * Get tracking key based on user or IP
   */
  private getTrackingKey(request: AuthenticatedRequest): string {
    // Track by user ID if authenticated
    if (request.user?.id) {
      return `user:${request.user.id}`;
    }

    // Track by IP for anonymous requests
    const ip = this.getClientIP(request);
    return `ip:${ip}`;
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: Request): string {
    return (
      (request.headers['cf-connecting-ip'] as string) || // Cloudflare
      (request.headers['x-real-ip'] as string) || // Nginx
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }

  /**
   * Get default rate limit based on user authentication status
   */
  private getDefaultLimitForUser(request: AuthenticatedRequest): number {
    if (request.user?.id) {
      // Higher limit for authenticated users
      return 1000; // 1000 requests per minute
    }

    // Lower limit for anonymous users
    return 60; // 60 requests per minute
  }
}

export { RateLimitGuard };
