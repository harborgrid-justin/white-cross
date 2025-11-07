/**
 * WebSocket Authentication Middleware
 *
 * Middleware that authenticates WebSocket connections at the connection level.
 * This runs BEFORE any message handlers and validates the initial handshake.
 *
 * Key Features:
 * - Connection-level authentication
 * - JWT token validation from handshake
 * - User data attachment to socket
 * - Automatic disconnection on auth failure
 *
 * Usage:
 * Apply in gateway using OnGatewayInit:
 * ```typescript
 * afterInit(server: Server) {
 *   server.use(createWsAuthMiddleware(this.jwtService, this.configService));
 * }
 * ```
 *
 * @module WsAuthMiddleware
 */
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { AuthenticatedSocket } from '../interfaces';
import { AuthPayload } from '../interfaces/auth-payload.interface';


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

const logger = new Logger('WsAuthMiddleware');

/**
 * Creates WebSocket authentication middleware
 *
 * @param jwtService - JWT service for token verification
 * @param configService - Config service for JWT secret
 * @returns Middleware function
 */
export function createWsAuthMiddleware(
  jwtService: JwtService,
  configService: ConfigService,
) {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      // Extract token from handshake
      const token = extractToken(socket);

      if (!token) {
        logger.warn(
          `Connection rejected: No token provided (socket: ${socket.id})`,
        );
        return next(new Error('Authentication token required'));
      }

      // Verify token
      const secret = configService.get<string>('JWT_SECRET');
      if (!secret) {
        logger.error('JWT_SECRET not configured');
        return next(new Error('Server configuration error'));
      }

      const payload = jwtService.verify(token, { secret });

      // Attach user data to socket
      (socket as AuthenticatedSocket).user = mapToAuthPayload(payload);

      logger.log(
        `Socket authenticated: ${socket.id} (user: ${(socket as AuthenticatedSocket).user?.userId})`,
      );

      next();
    } catch (error) {
      logger.warn(
        `Authentication failed for socket ${socket.id}: ${error.message}`,
      );
      next(new Error('Invalid authentication token'));
    }
  };
}

/**
 * Extracts JWT token from socket handshake
 *
 * @param socket - The socket connection
 * @returns Extracted token or null
 */
function extractToken(socket: Socket): string | null {
  // Try auth.token first (Socket.io handshake.auth)
  const authToken = socket.handshake.auth?.token;
  if (authToken) {
    return authToken;
  }

  // Try authorization header
  const authHeader = socket.handshake.headers?.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try query parameter (fallback, less secure)
  const queryToken = socket.handshake.query?.token;
  if (typeof queryToken === 'string') {
    return queryToken;
  }

  return null;
}

/**
 * Maps JWT payload to AuthPayload interface
 *
 * @param payload - The decoded JWT payload
 * @returns Structured AuthPayload
 */
function mapToAuthPayload(payload: JwtPayload): AuthPayload {
  return {
    userId: payload.sub || payload.userId || payload.id,
    organizationId:
      payload.organizationId || payload.schoolId || payload.districtId || '',
    role: payload.role || 'user',
    email: payload.email || '',
  };
}
