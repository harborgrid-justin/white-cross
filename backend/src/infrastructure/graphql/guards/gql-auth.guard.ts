/**
 * GraphQL Authentication Guard - ENHANCED WITH TOKEN BLACKLIST
 *
 * Enforces JWT authentication for GraphQL resolvers.
 * Extracts and validates JWT tokens from GraphQL context.
 *
 * SECURITY FEATURES:
 * - JWT token validation via Passport strategy
 * - Token blacklist checking (revoked tokens)
 * - User-level token invalidation (after password change)
 * - Public route support via @Public() decorator
 * - Comprehensive audit logging
 */
import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../services/auth/decorators';
import { TokenBlacklistService } from '../../../services/auth';


/**
 * Passport user structure
 */
interface PassportUser {
  userId: string;
  organizationId: string;
  role: string;
  email: string;
  [key: string]: unknown;
}

/**
 * Incoming request structure
 */
interface IncomingRequest {
  headers?: {
    authorization?: string;
    [key: string]: string | string[] | undefined;
  };
  cookies?: Record<string, string>;
  query?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * JWT payload structure
 */
interface JwtPayload {
  sub?: string;
  userId?: string;
  organizationId?: string;
  role?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * GraphQL JWT Authentication Guard with Token Blacklist Support
 *
 * Extends Passport JWT strategy for GraphQL context.
 * Automatically extracts user from request and adds to context.
 * Validates token against blacklist and user invalidation.
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(
    private reflector: Reflector,
    private tokenBlacklistService: TokenBlacklistService,
  ) {
    super();
  }

  /**
   * Get request from GraphQL execution context
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  /**
   * Main guard activation logic
   *
   * Implements comprehensive security checks:
   * 1. Check if route is marked as @Public()
   * 2. Validate JWT token via Passport strategy
   * 3. Check if token is blacklisted (revoked)
   * 4. Check if user's tokens are invalidated
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public GraphQL resolver - skipping authentication');
      return true;
    }

    try {
      // Call parent canActivate (Passport's JWT strategy)
      const result = await super.canActivate(context);

      if (!result) {
        return false;
      }

      // Additional security check: verify token is not blacklisted
      const request = this.getRequest(context);
      const token = this.extractTokenFromRequest(request);

      if (token) {
        // Check individual token blacklist
        const isBlacklisted =
          await this.tokenBlacklistService.isTokenBlacklisted(token);

        if (isBlacklisted) {
          this.logger.warn('Blacklisted token attempted GraphQL access', {
            query: request.body?.query?.substring(0, 100),
            variables: Object.keys(request.body?.variables || {}),
          });

          throw new UnauthorizedException('Token has been revoked');
        }

        // Check if user's all tokens are blacklisted (e.g., after password change)
        const user = request.user;
        if (user && user.id) {
          const tokenPayload = this.decodeToken(token);
          if (tokenPayload && tokenPayload.iat) {
            const userTokensBlacklisted =
              await this.tokenBlacklistService.areUserTokensBlacklisted(
                user.id,
                tokenPayload.iat,
              );

            if (userTokensBlacklisted) {
              this.logger.warn(
                'User tokens invalidated - GraphQL access denied',
                {
                  userId: user.id,
                  tokenIssuedAt: new Date(
                    tokenPayload.iat * 1000,
                  ).toISOString(),
                },
              );

              throw new UnauthorizedException(
                'Session invalidated. Please login again.',
              );
            }
          }
        }

        this.logger.debug('GraphQL authentication successful', {
          userId: user?.id,
          query: request.body?.query?.substring(0, 100),
        });
      }

      return true;
    } catch (error) {
      // Log authentication failures
      if (error instanceof UnauthorizedException) {
        this.logger.warn('GraphQL authentication failed', {
          error: error.message,
          query: context.getArgs()[3]?.fieldName, // GraphQL field name
        });
      } else {
        this.logger.error('Unexpected error in GraphQL authentication', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
      }

      throw error;
    }
  }

  /**
   * Handle request after authentication
   *
   * Adds authenticated user to GraphQL context
   */
  handleRequest<TUser = any>(
    err: Error | null,
    user: PassportUser | null,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      const request = this.getRequest(context);

      this.logger.warn('GraphQL authentication handleRequest failed', {
        error: err?.message,
        info: info?.message,
        query: request?.body?.query?.substring(0, 100),
      });

      throw (
        err || new UnauthorizedException('Authentication required for GraphQL')
      );
    }

    return user;
  }

  /**
   * Extract JWT token from request
   */
  private extractTokenFromRequest(request: IncomingRequest): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Decode JWT token without verification (for reading payload)
   */
  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString();
      return JSON.parse(payload);
    } catch (error) {
      this.logger.error('Failed to decode JWT token', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }
}
