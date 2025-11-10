/**
 * WebSocket Gateway
 *
 * Handles real-time WebSocket communication for the White Cross platform.
 * Provides connection management, authentication, and event handling for clients.
 *
 * Key Features:
 * - JWT-based authentication for secure connections
 * - Room-based messaging for multi-tenant isolation
 * - Real-time messaging with delivery confirmations
 * - Typing indicators and read receipts
 * - Presence tracking (online/offline/typing)
 * - Rate limiting to prevent spam
 * - Conversation room management
 *
 * Event Handlers:
 * - connection: New client connection with authentication
 * - disconnect: Client disconnection cleanup with presence update
 * - ping: Health check request
 * - subscribe: Subscribe to notification channels
 * - unsubscribe: Unsubscribe from notification channels
 * - notification:read: Mark notification as read
 * - message:send: Send a message to conversation
 * - message:edit: Edit existing message
 * - message:delete: Delete message
 * - message:delivered: Message delivery confirmation
 * - message:read: Message read receipt
 * - message:typing: Typing indicator
 * - conversation:join: Join a conversation room
 * - conversation:leave: Leave a conversation room
 * - presence:update: Update user presence status
 *
 * @class WebSocketGateway
 */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import type { AuthenticatedSocket } from './interfaces';
import {
  ConnectionConfirmedDto,
  ConversationEventDto,
  MessageDeliveryDto,
  MessageEventDto,
  ReadReceiptDto,
  TypingIndicatorDto,
} from './dto';
import { WsJwtAuthGuard } from './guards';
import { RateLimiterService } from './services/rate-limiter.service';
import { WsExceptionFilter } from './filters/ws-exception.filter';

@UseFilters(new WsExceptionFilter())
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
export class WebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

  /**
   * In-memory presence tracking
   * Maps userId to presence status
   */
  private readonly presenceMap = new Map<
    string,
    { status: 'online' | 'offline' | 'away'; lastSeen: string }
  >();

  constructor(private readonly rateLimiter: RateLimiterService) {}

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
        this.logger.warn(
          `Connection rejected: No authentication token provided`,
        );
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

      this.logger.log(
        `WebSocket connected: ${client.id} (user: ${user.userId})`,
      );

      // Join organization room for multi-tenant isolation
      const orgRoom = `org:${user.organizationId}`;
      const userRoom = `user:${user.userId}`;

      await client.join(orgRoom);
      await client.join(userRoom);

      this.logger.log(
        `Socket ${client.id} joined rooms: ${orgRoom}, ${userRoom}`,
      );

      // Send connection confirmation
      const confirmation = new ConnectionConfirmedDto({
        socketId: client.id,
        userId: user.userId,
        organizationId: user.organizationId,
        connectedAt: new Date().toISOString(),
      });

      client.emit('connection:confirmed', confirmation);

      // Set user presence to online
      this.updatePresence(user.userId, 'online');
      this.broadcastPresenceUpdate(user.userId, user.organizationId, 'online');
    } catch (error) {
      this.logger.error(`Connection error for ${client.id}:`, error);
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
      // Set user presence to offline
      this.updatePresence(user.userId, 'offline');
      this.broadcastPresenceUpdate(user.userId, user.organizationId, 'offline');
    }

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

    this.logger.log(
      `Notification ${notificationId} marked as read by user ${user.userId}`,
    );

    // Broadcast to other user sessions that notification was read
    client
      .to(`user:${user.userId}`)
      .emit('notification:read', { notificationId });
  }

  /**
   * Handles message send events
   * Validates, rate limits, and broadcasts messages to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param data - Message event data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:send')
  async handleMessageSend(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<MessageEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(
      user.userId,
      'message:send',
    );
    if (!allowed) {
      client.emit('error', {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Message rate limit exceeded. Please slow down.',
      });
      return;
    }

    try {
      // Create and validate DTO
      const messageDto = new MessageEventDto({
        ...data,
        type: 'send',
        senderId: user.userId,
        organizationId: user.organizationId,
      });

      // Validate sender and organization
      if (!messageDto.validateSender(user.userId)) {
        throw new WsException('Invalid sender');
      }

      if (!messageDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      this.logger.log(
        `Message sent: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`,
      );

      // Broadcast to conversation room
      const room = `conversation:${messageDto.conversationId}`;
      this.server.to(room).emit('message:send', messageDto.toPayload());

      // Send delivery confirmation to sender
      const deliveryDto = new MessageDeliveryDto({
        messageId: messageDto.messageId,
        conversationId: messageDto.conversationId,
        recipientId: user.userId,
        senderId: user.userId,
        organizationId: user.organizationId,
        status: 'sent',
      });

      client.emit('message:delivered', deliveryDto.toPayload());
    } catch (error) {
      this.logger.error(`Message send error for user ${user.userId}:`, error);
      client.emit('error', {
        type: 'MESSAGE_SEND_FAILED',
        message: (error as Error).message || 'Failed to send message',
      });
    }
  }

  /**
   * Handles message edit events
   * Validates ownership and broadcasts edits to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param data - Message event data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:edit')
  async handleMessageEdit(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<MessageEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(
      user.userId,
      'message:edit',
    );
    if (!allowed) {
      client.emit('error', {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Edit rate limit exceeded. Please slow down.',
      });
      return;
    }

    try {
      // Create and validate DTO
      const messageDto = new MessageEventDto({
        ...data,
        type: 'edit',
        senderId: user.userId,
        organizationId: user.organizationId,
      });

      // Validate sender and organization
      if (!messageDto.validateSender(user.userId)) {
        throw new WsException('You can only edit your own messages');
      }

      if (!messageDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      this.logger.log(
        `Message edited: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`,
      );

      // Broadcast to conversation room
      const room = `conversation:${messageDto.conversationId}`;
      this.server.to(room).emit('message:edit', messageDto.toPayload());
    } catch (error) {
      this.logger.error(`Message edit error for user ${user.userId}:`, error);
      client.emit('error', {
        type: 'MESSAGE_EDIT_FAILED',
        message: (error as Error).message || 'Failed to edit message',
      });
    }
  }

  /**
   * Handles message delete events
   * Validates ownership and broadcasts deletion to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param data - Message event data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:delete')
  async handleMessageDelete(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<MessageEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(
      user.userId,
      'message:delete',
    );
    if (!allowed) {
      client.emit('error', {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Delete rate limit exceeded. Please slow down.',
      });
      return;
    }

    try {
      // Create and validate DTO
      const messageDto = new MessageEventDto({
        ...data,
        type: 'delete',
        senderId: user.userId,
        organizationId: user.organizationId,
        content: '', // Content not required for delete
      });

      // Validate sender and organization
      if (!messageDto.validateSender(user.userId)) {
        throw new WsException('You can only delete your own messages');
      }

      if (!messageDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      this.logger.log(
        `Message deleted: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`,
      );

      // Broadcast to conversation room
      const room = `conversation:${messageDto.conversationId}`;
      this.server.to(room).emit('message:delete', {
        messageId: messageDto.messageId,
        conversationId: messageDto.conversationId,
        timestamp: messageDto.timestamp,
      });
    } catch (error) {
      this.logger.error(`Message delete error for user ${user.userId}:`, error);
      client.emit('error', {
        type: 'MESSAGE_DELETE_FAILED',
        message: (error as Error).message || 'Failed to delete message',
      });
    }
  }

  /**
   * Handles message delivery confirmations
   * Broadcasts delivery status to message sender
   *
   * @param client - The authenticated WebSocket client
   * @param data - Delivery confirmation data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:delivered')
  async handleMessageDelivered(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<MessageDeliveryDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    try {
      // Create and validate DTO
      const deliveryDto = new MessageDeliveryDto({
        ...data,
        recipientId: user.userId,
        organizationId: user.organizationId,
        status: 'delivered',
      });

      if (!deliveryDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      this.logger.debug(
        `Message ${deliveryDto.messageId} delivered to user ${user.userId}`,
      );

      // Notify the sender
      const senderRoom = `user:${deliveryDto.senderId}`;
      this.server
        .to(senderRoom)
        .emit('message:delivered', deliveryDto.toPayload());
    } catch (error) {
      this.logger.error(
        `Delivery confirmation error for user ${user.userId}:`,
        error,
      );
    }
  }

  /**
   * Handles message read receipts
   * Broadcasts read status to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param data - Read receipt data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:read')
  async handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<ReadReceiptDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    try {
      // Create and validate DTO
      const readReceiptDto = new ReadReceiptDto({
        ...data,
        userId: user.userId,
        organizationId: user.organizationId,
      });

      if (!readReceiptDto.validateUser(user.userId)) {
        throw new WsException('Invalid user');
      }

      if (!readReceiptDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      this.logger.debug(
        `Message ${readReceiptDto.messageId} read by user ${user.userId}`,
      );

      // Broadcast to conversation room
      const room = `conversation:${readReceiptDto.conversationId}`;
      this.server.to(room).emit('message:read', readReceiptDto.toPayload());
    } catch (error) {
      this.logger.error(`Read receipt error for user ${user.userId}:`, error);
    }
  }

  /**
   * Handles typing indicator events
   * Broadcasts typing status to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param data - Typing indicator data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:typing')
  async handleTypingIndicator(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<TypingIndicatorDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(
      user.userId,
      'message:typing',
    );
    if (!allowed) {
      // Silently ignore rate-limited typing indicators
      return;
    }

    try {
      // Create and validate DTO
      const typingDto = new TypingIndicatorDto({
        ...data,
        userId: user.userId,
        organizationId: user.organizationId,
      });

      if (!typingDto.validateUser(user.userId)) {
        throw new WsException('Invalid user');
      }

      if (!typingDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      // Broadcast to conversation room (excluding sender)
      const room = `conversation:${typingDto.conversationId}`;
      client.to(room).emit('message:typing', typingDto.toPayload());
    } catch (error) {
      this.logger.error(
        `Typing indicator error for user ${user.userId}:`,
        error,
      );
    }
  }

  /**
   * Handles conversation join events
   * Validates access and adds user to conversation room
   *
   * @param client - The authenticated WebSocket client
   * @param data - Conversation event data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('conversation:join')
  async handleConversationJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<ConversationEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(
      user.userId,
      'conversation:join',
    );
    if (!allowed) {
      client.emit('error', {
        type: 'RATE_LIMIT_EXCEEDED',
        message: 'Join rate limit exceeded. Please slow down.',
      });
      return;
    }

    try {
      // Create and validate DTO
      const conversationDto = new ConversationEventDto({
        ...data,
        action: 'join',
        userId: user.userId,
        organizationId: user.organizationId,
      });

      if (!conversationDto.validateUser(user.userId)) {
        throw new WsException('Invalid user');
      }

      if (!conversationDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      // TODO: In production, validate that user has access to this conversation
      // by checking conversation membership from database

      const room = conversationDto.getRoomId();
      await client.join(room);

      this.logger.log(
        `User ${user.userId} joined conversation ${conversationDto.conversationId}`,
      );

      // Notify other participants in the room
      client.to(room).emit('conversation:join', conversationDto.toPayload());

      // Send confirmation to the joining user
      client.emit('conversation:joined', {
        conversationId: conversationDto.conversationId,
        timestamp: conversationDto.timestamp,
      });
    } catch (error) {
      this.logger.error(
        `Conversation join error for user ${user.userId}:`,
        error,
      );
      client.emit('error', {
        type: 'CONVERSATION_JOIN_FAILED',
        message: (error as Error).message || 'Failed to join conversation',
      });
    }
  }

  /**
   * Handles conversation leave events
   * Removes user from conversation room
   *
   * @param client - The authenticated WebSocket client
   * @param data - Conversation event data
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('conversation:leave')
  async handleConversationLeave(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<ConversationEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    try {
      // Create and validate DTO
      const conversationDto = new ConversationEventDto({
        ...data,
        action: 'leave',
        userId: user.userId,
        organizationId: user.organizationId,
      });

      if (!conversationDto.validateUser(user.userId)) {
        throw new WsException('Invalid user');
      }

      if (!conversationDto.validateOrganization(user.organizationId)) {
        throw new WsException('Invalid organization');
      }

      const room = conversationDto.getRoomId();

      // Notify other participants before leaving
      client.to(room).emit('conversation:leave', conversationDto.toPayload());

      await client.leave(room);

      this.logger.log(
        `User ${user.userId} left conversation ${conversationDto.conversationId}`,
      );

      // Send confirmation to the leaving user
      client.emit('conversation:left', {
        conversationId: conversationDto.conversationId,
        timestamp: conversationDto.timestamp,
      });
    } catch (error) {
      this.logger.error(
        `Conversation leave error for user ${user.userId}:`,
        error,
      );
      client.emit('error', {
        type: 'CONVERSATION_LEAVE_FAILED',
        message: (error as Error).message || 'Failed to leave conversation',
      });
    }
  }

  /**
   * Handles presence update events
   * Updates and broadcasts user presence status
   *
   * @param client - The authenticated WebSocket client
   * @param status - Presence status (online, offline, away)
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('presence:update')
  async handlePresenceUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() status: 'online' | 'offline' | 'away',
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    try {
      // Validate status
      if (!['online', 'offline', 'away'].includes(status)) {
        throw new WsException('Invalid presence status');
      }

      this.updatePresence(user.userId, status);
      this.broadcastPresenceUpdate(user.userId, user.organizationId, status);

      this.logger.debug(`User ${user.userId} presence updated to ${status}`);
    } catch (error) {
      this.logger.error(
        `Presence update error for user ${user.userId}:`,
        error,
      );
    }
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
   * Updates user presence status in memory
   *
   * @param userId - The user ID
   * @param status - The presence status
   */
  private updatePresence(
    userId: string,
    status: 'online' | 'offline' | 'away',
  ): void {
    this.presenceMap.set(userId, {
      status,
      lastSeen: new Date().toISOString(),
    });
  }

  /**
   * Broadcasts presence update to organization
   *
   * @param userId - The user ID
   * @param organizationId - The organization ID
   * @param status - The presence status
   */
  private broadcastPresenceUpdate(
    userId: string,
    organizationId: string,
    status: 'online' | 'offline' | 'away',
  ): void {
    const orgRoom = `org:${organizationId}`;
    this.server.to(orgRoom).emit('presence:update', {
      userId,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Gets user presence status
   *
   * @param userId - The user ID
   * @returns Presence status or null if not found
   */
  getUserPresence(userId: string): { status: string; lastSeen: string } | null {
    return this.presenceMap.get(userId) || null;
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
