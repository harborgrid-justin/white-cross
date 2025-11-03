import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract client IP address from request
 * Handles X-Forwarded-For header and direct connection IP
 *
 * @example
 * async logAction(@IpAddress() ipAddress: string) {
 *   this.auditService.log({ ipAddress, ... });
 * }
 */
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  },
);
