import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract User-Agent header from request
 *
 * @example
 * async trackActivity(@UserAgent() userAgent: string) {
 *   this.analytics.track({ userAgent, ... });
 * }
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'] || 'unknown';
  },
);
