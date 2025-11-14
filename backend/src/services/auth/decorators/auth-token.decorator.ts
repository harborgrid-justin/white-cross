import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract JWT token from Authorization header
 * Removes 'Bearer ' prefix if present
 *
 * @example
 * async logout(@AuthToken() token: string) {
 *   await this.tokenBlacklistService.blacklistToken(token);
 * }
 */
export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return null;
    }

    return authHeader.replace(/^Bearer\s+/i, '');
  },
);
