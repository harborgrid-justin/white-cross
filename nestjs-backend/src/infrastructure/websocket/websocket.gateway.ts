/**
 * WebSocket Gateway
 *
 * Handles real-time WebSocket communication for the White Cross platform.
 * Provides connection management, authentication, and event handling for clients.
 *
 * Key Features:
 * - JWT-based authentication for secure connections
 * - Room-based messaging for multi-tenant isolation
 * - Automatic subscription to organization and user rooms
 * - Health check (ping/pong) support
 * - Channel subscription management
 *
 * Event Handlers:
 * - connection: New client connection with authentication
 * - disconnect: Client disconnection cleanup
 * - ping: Health check request
 * - subscribe: Subscribe to notification channels
 * - unsubscribe: Unsubscribe from notification channels
 * - notification:read: Mark notification as read
 *
 * @class WebSocketGateway
 */
import {
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './interfaces';
import { ConnectionConfirmedDto } from './dto';
import { WsJwtAuthGuard } from './guards';

@NestWebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class WebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

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
        this.logger.warn(`Connection rejected: No authentication token provided`);
        client.disconnect();
        return;
      }

      // Note: In a real implementation, we would validate the token here
      // For now, we assume the WsJwtAuthGuard will be applied to message handlers
      // The connection itself needs manual authentication

      const user = client.user;
      if (!user) {
        this.logger.warn(`Connection rejected: Authentication failed`);
        client.disconnect();
        return;
      }

      this.logger.log(`WebSocket connected: ${client.id} (user: ${user.userId})`);

      // Join organization room for multi-tenant isolation
      const orgRoom = `org:${user.organizationId}`;
      const userRoom = `user:${user.userId}`;

      await client.join(orgRoom);
      await client.join(userRoom);

      this.logger.log(`Socket ${client.id} joined rooms: ${orgRoom}, ${userRoom}`);

      // Send connection confirmation
      const confirmation = new ConnectionConfirmedDto({
        socketId: client.id,
        userId: user.userId,
        organizationId: user.organizationId,
        connectedAt: new Date().toISOString(),
      });

      client.emit('connection:confirmed', confirmation);
    } catch (error) {
      this.logger.error(`Connection error for ${client.id}:`, error);
      client.disconnect();
    }
  }

  /**
   * Handles client disconnection
   * Logs the disconnection for monitoring purposes
   *
   * @param client - The disconnecting WebSocket client
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    this.logger.log(`WebSocket disconnected: ${client.id}`);
  }

  /**
   * Handles ping requests for connection health checks
   *
   * @param client - The WebSocket client sending the ping
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): void {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  /**
   * Handles subscription requests to specific notification channels
   * Enforces multi-tenant security by validating channel access
   *
   * @param client - The authenticated WebSocket client
   * @param channel - The channel identifier to subscribe to
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() channel: string,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    // Ensure users can only subscribe to their organization's channels
    if (channel.startsWith(`org:${user.organizationId}:`)) {
      await client.join(channel);
      this.logger.log(`Socket ${client.id} subscribed to ${channel}`);
      client.emit('subscribed', { channel });
    } else {
      this.logger.warn(
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
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() channel: string,
  ): Promise<void> {
    await client.leave(channel);
    this.logger.log(`Socket ${client.id} unsubscribed from ${channel}`);
    client.emit('unsubscribed', { channel });
  }

  /**
   * Handles notification read events
   * Broadcasts the read status to all user sessions for synchronization
   *
   * @param client - The authenticated WebSocket client
   * @param notificationId - The ID of the notification marked as read
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('notification:read')
  handleNotificationRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() notificationId: string,
  ): void {
    const user = client.user;

    if (!user) {
      client.emit('error', { message: 'Authentication required' });
      return;
    }

    this.logger.log(`Notification ${notificationId} marked as read by user ${user.userId}`);

    // Broadcast to other user sessions that notification was read
    client.to(`user:${user.userId}`).emit('notification:read', { notificationId });
  }

  /**
   * Gets the count of currently connected sockets
   *
   * @returns The number of connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.server?.sockets.sockets.size || 0;
  }

  /**
   * Checks if the WebSocket server is initialized
   *
   * @returns True if server is initialized, false otherwise
   */
  isInitialized(): boolean {
    return !!this.server;
  }

  /**
   * Extracts JWT token from socket handshake
   * Supports both auth.token and authorization header
   *
   * @param client - The WebSocket client
   * @returns The extracted token or null
   */
  private extractToken(client: AuthenticatedSocket): string | null {
    const authToken = client.handshake.auth?.token;
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
