import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Call parent canActivate (Passport's JWT strategy)
    const result = await super.canActivate(context);

    if (!result) {
      return false;
    }

    // Additional security check: verify token is not blacklisted
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);

      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      // Check if user's all tokens are blacklisted (e.g., after password change)
      const user = request.user;
      if (user && user.id) {
        const tokenPayload = this.decodeToken(token);
        if (tokenPayload && tokenPayload.iat) {
          const userTokensBlacklisted = await this.tokenBlacklistService.areUserTokensBlacklisted(
            user.id,
            tokenPayload.iat
          );

          if (userTokensBlacklisted) {
            throw new UnauthorizedException('Session invalidated. Please login again.');
          }
        }
      }
    }

    return true;
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }
    return user;
  }

  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  private decodeToken(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString();
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }
}
