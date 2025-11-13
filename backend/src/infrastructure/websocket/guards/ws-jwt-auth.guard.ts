/**
 * WebSocket JWT Authentication Guard
 *
 * Validates JWT tokens for WebSocket connections and attaches user data to the socket.
 * Implements middleware-style authentication for Socket.io connections.
 *
 * Key Features:
 * - JWT token validation from auth header or handshake auth
 * - Token blacklist verification
 * - User-level token invalidation support
 * - User data attachment to socket instance
 * - Type-safe user payload structure
 * - Graceful error handling with connection rejection
 * - Comprehensive audit logging
 *
 * @class WsJwtAuthGuard
 */
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket, AuthPayload } from '../interfaces';
import { TokenBlacklistService } from '../../../services/auth';


/**
 * JWT payload structure
 */
interface JwtPayload {
  sub?: string;
  userId?: string;
  id?: string;
  organizationId?: string;
  schoolId?: string;
  districtId?: string;
  role?: string;
  email?: string;
  [key: string]: unknown;
}

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  /**
   * Validates the WebSocket connection by verifying the JWT token
   *
   * Implements same security checks as JwtAuthGuard:
   * 1. Extract JWT token from handshake
   * 2. Verify token signature and expiry
   * 3. Check if token is blacklisted
   * 4. Check if user's tokens are invalidated
   * 5. Attach user data to socket
   *
   * @param context - Execution context containing the WebSocket client
   * @returns Promise resolving to true if authenticated, throws WsException otherwise
   * @throws WsException if authentication fails
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: AuthenticatedSocket = context.switchToWs().getClient();

    try {
      // Extract token from handshake
      const token = this.extractToken(client);

      if (!token) {
        this.logger.warn('WebSocket connection attempt without token', {
          socketId: client.id,
          remoteAddress: client.handshake.address,
        });

        throw new WsException('Authentication token required');
      }

      // Verify and decode the JWT token
      const payload = await this.verifyToken(token);

      // Check if token is blacklisted
      const isBlacklisted =
        await this.tokenBlacklistService.isTokenBlacklisted(token);

      if (isBlacklisted) {
        this.logger.warn('Blacklisted token attempted WebSocket connection', {
          socketId: client.id,
          userId: payload.sub || payload.userId,
          remoteAddress: client.handshake.address,
        });

        throw new WsException('Token has been revoked');
      }

      // Check if user's all tokens are invalidated
      const userId = payload.sub || payload.userId || payload.id;
      if (userId && payload.iat) {
        const userTokensBlacklisted =
          await this.tokenBlacklistService.areUserTokensBlacklisted(
            userId,
            payload.iat,
          );

        if (userTokensBlacklisted) {
          this.logger.warn(
            'User tokens invalidated - WebSocket connection denied',
            {
              socketId: client.id,
              userId,
              tokenIssuedAt: new Date(payload.iat * 1000).toISOString(),
              remoteAddress: client.handshake.address,
            },
          );

          throw new WsException('Session invalidated. Please login again.');
        }
      }

      // Attach user data to socket for use in handlers
      client.user = this.mapToAuthPayload(payload);

      // Log successful authentication
      this.logger.log(`WebSocket authenticated successfully`, {
        socketId: client.id,
        userId: client.user.userId,
        organizationId: client.user.organizationId,
        role: client.user.role,
        remoteAddress: client.handshake.address,
      });

      return true;
    } catch (error) {
      // Log authentication failure
      this.logger.error('WebSocket authentication failed', {
        socketId: client.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        remoteAddress: client.handshake.address,
        errorType: error?.constructor?.name,
      });

      // Disconnect socket on authentication failure
      client.disconnect(true);

      // Throw appropriate exception
      if (error instanceof WsException) {
        throw error;
      }

      throw new WsException(
        error instanceof Error ? error.message : 'Authentication failed',
      );
    }
  }

  /**
   * Extracts the JWT token from the socket handshake
   * Supports both auth.token and authorization header formats
   *
   * @param client - The WebSocket client socket
   * @returns The extracted token or null if not found
   */
  private extractToken(client: AuthenticatedSocket): string | null {
    // Try auth.token first (Socket.io handshake.auth)
    const authToken = client.handshake.auth?.token;
    if (authToken) {
      return authToken;
    }

    // Try authorization header (Bearer token)
    const authHeader = client.handshake.headers?.authorization;
    if (authHeader) {
      if (authHeader.startsWith('Bearer ')) {
        return authHeader.replace('Bearer ', '');
      }
      // Handle array case (should not happen but be defensive)
      if (Array.isArray(authHeader) && authHeader[0]?.startsWith('Bearer ')) {
        return authHeader[0].replace('Bearer ', '');
      }
    }

    // Try query parameter (less secure, but sometimes needed)
    const queryToken = client.handshake.query?.token;
    if (queryToken) {
      this.logger.warn('Token provided via query parameter (less secure)', {
        socketId: client.id,
        remoteAddress: client.handshake.address,
      });
      return typeof queryToken === 'string' ? queryToken : (Array.isArray(queryToken) && queryToken.length > 0 ? queryToken[0] : null) || null;
    }

    return null;
  }

  /**
   * Verifies the JWT token using the configured secret
   *
   * @param token - The JWT token to verify
   * @returns The decoded token payload
   * @throws Error if token verification fails
   */
  private async verifyToken(token: string): Promise<any> {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      this.logger.error(
        'JWT_SECRET not configured - cannot verify WebSocket tokens',
      );
      throw new Error('JWT_SECRET not configured');
    }

    try {
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      this.logger.warn('JWT token verification failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name,
      });

      if (error instanceof Error) {
        // Provide more specific error messages
        if (error.name === 'TokenExpiredError') {
          throw new Error('Token has expired');
        } else if (error.name === 'JsonWebTokenError') {
          throw new Error('Invalid token');
        } else if (error.name === 'NotBeforeError') {
          throw new Error('Token not yet valid');
        }
      }

      throw new Error('Token verification failed');
    }
  }

  /**
   * Maps the JWT payload to the WebSocket AuthPayload structure
   * Handles different payload formats for compatibility
   *
   * @param payload - The decoded JWT payload
   * @returns Structured AuthPayload for WebSocket use
   */
  private mapToAuthPayload(payload: JwtPayload): AuthPayload {
    const userId = payload.sub || payload.userId || payload.id;
    if (!userId) {
      throw new Error('User ID not found in token payload');
    }

    return {
      userId,
      organizationId:
        payload.organizationId || payload.schoolId || payload.districtId || '',
      role: payload.role || 'user',
      email: payload.email || '',
    };
  }
}
