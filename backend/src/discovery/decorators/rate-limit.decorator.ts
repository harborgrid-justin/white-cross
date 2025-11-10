import { SetMetadata } from '@nestjs/common';

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const RATE_LIMIT_KEY = 'rate-limit';
export const RateLimit = (config: RateLimitConfig) =>
  SetMetadata(RATE_LIMIT_KEY, config);

// Convenience decorators for common rate limits
export const RateLimitStrict = () => RateLimit({ limit: 10, windowMs: 60000 }); // 10/min
export const RateLimitModerate = () =>
  RateLimit({ limit: 50, windowMs: 60000 }); // 50/min
export const RateLimitLenient = () =>
  RateLimit({ limit: 100, windowMs: 60000 }); // 100/min
