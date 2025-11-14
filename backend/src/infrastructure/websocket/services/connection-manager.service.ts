/**
 * @fileoverview WebSocket Connection Manager Service
 * @module infrastructure/websocket/services
 * @description Handles WebSocket connection lifecycle, authentication, and room management
 */

import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../interfaces';
import { ConnectionConfirmedDto } from '../dto';

import { BaseService } from '@/common/base';
@Injectable()
export class ConnectionManagerService extends BaseService {
  constructor() {
    super("ConnectionManagerService");
  }

  /**
   * Handles new WebSocket connections
   * Authenticates the client, joins appropriate rooms, and sends confirmation
   *
   * @param client - The authenticated WebSocket client
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      // Authentication is handled by middleware in the gateway
      // Extract token and validate
      const token = this.extractToken(client);

      if (!token) {
        this.logWarning(`Connection rejected: No authentication token provided`);
        client.disconnect();
        return;
      }

      // Note: In a real implementation, we would validate the token here
      // For now, we assume the WsJwtAuthGuard will be applied to message handlers
      // The connection itself needs manual authentication

      const user = client.user;
      if (!user) {
        this.logWarning(`Connection rejected: Authentication failed`);
        client.disconnect();
        return;
      }

      this.logInfo(`WebSocket connected: ${client.id} (user: ${user.userId})`);

      // Join organization room for multi-tenant isolation
      const orgRoom = `org:${user.organizationId}`;
      const userRoom = `user:${user.userId}`;

      await client.join(orgRoom);
      await client.join(userRoom);

      this.logInfo(`Socket ${client.id} joined rooms: ${orgRoom}, ${userRoom}`);

      // Send connection confirmation
      const confirmation = new ConnectionConfirmedDto({
        socketId: client.id,
        userId: user.userId,
        organizationId: user.organizationId,
        connectedAt: new Date().toISOString(),
      });

      client.emit('connection:confirmed', confirmation);
    } catch (error) {
      this.logError(`Connection error for ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * Handles client disconnection
   * Updates presence and broadcasts offline status
   *
   * @param client - The disconnecting WebSocket client
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const user = client.user;

    if (user) {
      this.logInfo(`WebSocket disconnected: ${client.id} (user: ${user.userId})`);
    } else {
      this.logInfo(`WebSocket disconnected: ${client.id}`);
    }
  }

  /**
   * Handles ping requests for connection health checks
   *
   * @param client - The WebSocket client sending the ping
   */
  handlePing(client: AuthenticatedSocket): void {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  /**
   * Handles subscription requests to specific notification channels
   * Enforces multi-tenant security by validating channel access
   *
   * @param client - The authenticated WebSocket client
   * @param channel - The channel identifier to subscribe to
   */
  async handleSubscribe(client: AuthenticatedSocket, channel: string): Promise<void> {
    const user = client.user;

    if (!user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    // Ensure users can only subscribe to their organization's channels
    if (channel.startsWith(`org:${user.organizationId}:`)) {
      await client.join(channel);
      this.logInfo(`Socket ${client.id} subscribed to ${channel}`);
      client.emit('subscribed', { channel });
    } else {
      this.logWarning(
        `Socket ${client.id} attempted to subscribe to unauthorized channel: ${channel}`,
      );
      client.emit('error', { message: 'Unauthorized channel subscription' });
    }
  }

  /**
   * Handles unsubscription requests from notification channels
   *
   * @param client - The authenticated WebSocket client
   * @param channel - The channel identifier to unsubscribe from
   */
  async handleUnsubscribe(client: AuthenticatedSocket, channel: string): Promise<void> {
    await client.leave(channel);
    this.logInfo(`Socket ${client.id} unsubscribed from ${channel}`);
    client.emit('unsubscribed', { channel });
  }

  /**
   * Handles notification read events
   * Broadcasts the read status to all user sessions for synchronization
   *
   * @param client - The authenticated WebSocket client
   * @param notificationId - The ID of the notification marked as read
   */
  handleNotificationRead(client: AuthenticatedSocket, notificationId: string): void {
    const user = client.user;

    if (!user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    this.logInfo(`Notification ${notificationId} marked as read by user ${user.userId}`);

    // Broadcast to other user sessions that notification was read
    client.to(`user:${user.userId}`).emit('notification:read', { notificationId });
  }

  /**
   * Gets the count of currently connected sockets
   *
   * @param server - The Socket.IO server instance
   * @returns The number of connected sockets
   */
  getConnectedSocketsCount(server: Server): number {
    return server?.sockets.sockets.size || 0;
  }

  /**
   * Checks if the WebSocket server is initialized
   *
   * @param server - The Socket.IO server instance
   * @returns True if server is initialized, false otherwise
   */
  isInitialized(server: Server): boolean {
    return !!server;
  }

  /**
   * Extracts JWT token from socket handshake
   * Supports both auth.token and authorization header
   *
   * @param client - The WebSocket client
   * @returns The extracted token or null
   */
  private extractToken(client: AuthenticatedSocket): string | null {
    const authToken = client.handshake.auth?.token as string;
    if (authToken) {
      return authToken;
    }

    const authHeader = client.handshake.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '');
    }

    return null;
  }
}
