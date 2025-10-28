/**
 * WebSocket JWT Authentication Guard
 *
 * Validates JWT tokens for WebSocket connections and attaches user data to the socket.
 * Implements middleware-style authentication for Socket.io connections.
 *
 * Key Features:
 * - JWT token validation from auth header or handshake auth
 * - User data attachment to socket instance
 * - Type-safe user payload structure
 * - Graceful error handling with connection rejection
 *
 * @class WsJwtAuthGuard
 */
import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket, AuthPayload } from '../interfaces';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates the WebSocket connection by verifying the JWT token
   *
   * @param context - Execution context containing the WebSocket client
   * @returns Promise resolving to true if authenticated, throws WsException otherwise
   * @throws WsException if authentication fails
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: AuthenticatedSocket = context.switchToWs().getClient();
      const token = this.extractToken(client);

      if (!token) {
        throw new WsException('Authentication token required');
      }

      // Verify and decode the JWT token
      const payload = await this.verifyToken(token);

      // Attach user data to socket for use in handlers
      client.user = this.mapToAuthPayload(payload);

      this.logger.log(
        `WebSocket authenticated: userId=${client.user.userId}, org=${client.user.organizationId}`,
      );

      return true;
    } catch (error) {
      this.logger.error('WebSocket authentication failed', error);
      throw new WsException(error.message || 'Authentication failed');
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
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '');
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
    const secret = this.configService.get<string>('JWT_SECRET') || 'default-secret-change-in-production';

    return this.jwtService.verify(token, { secret });
  }

  /**
   * Maps the JWT payload to the WebSocket AuthPayload structure
   * Handles different payload formats for compatibility
   *
   * @param payload - The decoded JWT payload
   * @returns Structured AuthPayload for WebSocket use
   */
  private mapToAuthPayload(payload: any): AuthPayload {
    return {
      userId: payload.sub || payload.userId || payload.id,
      organizationId: payload.organizationId || payload.schoolId || payload.districtId || '',
      role: payload.role || 'user',
      email: payload.email || '',
    };
  }
}
