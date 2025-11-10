/**
 * LOC: RLDEC001
 * File: decorators/rate-limit.decorator.ts
 * Purpose: Rate limit decorator for custom rate limiting configuration
 */

import { SetMetadata } from '@nestjs/common';
import { RATE_LIMIT_TTL_KEY, RATE_LIMIT_MAX_KEY } from '../guards/rate-limit.guard';

/**
 * RateLimit decorator
 *
 * Configures custom rate limiting for an endpoint.
 *
 * @param limit - Maximum number of requests
 * @param ttl - Time window in seconds
 *
 * @example
 * ```typescript
 * @Post('login')
 * @RateLimit(5, 3600) // 5 attempts per hour
 * login(@Body() dto: LoginDto) {
 *   return this.authService.login(dto);
 * }
 * ```
 */
export const RateLimit = (limit: number, ttl: number = 60) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    SetMetadata(RATE_LIMIT_MAX_KEY, limit)(target, propertyKey, descriptor);
    SetMetadata(RATE_LIMIT_TTL_KEY, ttl)(target, propertyKey, descriptor);
  };
};
