/**
 * JWT Authentication Guard
 * Ensures requests have valid JWT tokens
 */

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const error = err || new UnauthorizedException('Authentication required');

      // Log authentication failure
      const request = context.switchToHttp().getRequest();
      console.error('Authentication failed:', {
        path: request.url,
        method: request.method,
        ip: request.ip,
        error: info?.message || err?.message,
      });

      throw error;
    }

    return user;
  }
}

export default JwtAuthGuard;
