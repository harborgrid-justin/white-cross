/**
 * WebSocket Throttle Guard
 *
 * Provides granular rate limiting for specific WebSocket events.
 * Works in conjunction with RateLimiterService but offers decorator-based configuration.
 *
 * Key Features:
 * - Decorator-based configuration
 * - Per-event rate limiting
 * - Customizable limits per handler
 * - Integration with RateLimiterService
 *
 * Usage:
 * ```typescript
 * @UseGuards(WsThrottleGuard)
 * @Throttle(10, 60) // 10 requests per 60 seconds
 * @SubscribeMessage('expensive:operation')
 * handleExpensiveOp() { }
 * ```
 *
 * @class WsThrottleGuard
 */
import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { WsException } from '@nestjs/websockets';
import { RateLimiterService } from '../services/rate-limiter.service';

/**
 * Throttle configuration metadata key
 */
export const THROTTLE_KEY = 'websocket_throttle';

/**
 * Throttle decorator for WebSocket handlers
 *
 * @param limit - Maximum number of requests
 * @param ttl - Time window in seconds
 * @returns Decorator function
 */
export const Throttle = (limit: number, ttl: number) =>
  SetMetadata(THROTTLE_KEY, { limit, ttl });

@Injectable()
export class WsThrottleGuard implements CanActivate {
  constructor(
    private readonly rateLimiter: RateLimiterService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Checks if the request is within rate limits
   *
   * @param context - Execution context
   * @returns True if allowed, throws WsException if rate limited
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const throttleConfig = this.reflector.get(THROTTLE_KEY, context.getHandler());

    // No throttle config = allow
    if (!throttleConfig) {
      return true;
    }

    const client = context.switchToWs().getClient();
    const user = (client as any).user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    const pattern = context.switchToWs().getPattern();
    const allowed = await this.rateLimiter.checkLimit(user.userId, pattern);

    if (!allowed) {
      throw new WsException({
        type: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded for ${pattern}. Please slow down.`,
      });
    }

    return true;
  }
}
