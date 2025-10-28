/**
 * Authenticated Socket Interface
 *
 * Extends the Socket.io Socket interface to include authenticated user data.
 * Used throughout the WebSocket infrastructure for type-safe access to user information.
 *
 * @interface AuthenticatedSocket
 */
import { Socket } from 'socket.io';
import { AuthPayload } from './auth-payload.interface';

/**
 * Extended Socket interface with user authentication data
 */
export interface AuthenticatedSocket extends Socket {
  /**
   * Authenticated user data from JWT token
   */
  user?: AuthPayload;
}
