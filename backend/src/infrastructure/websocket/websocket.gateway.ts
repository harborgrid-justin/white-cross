/**
 * @fileoverview WebSocket Gateway
 * @module infrastructure/websocket
 * @description Main WebSocket gateway that delegates to specialized service handlers
 *
 * This is a refactored version that has been broken down into smaller,
 * more focused services for better maintainability.
 *
 * Key Features:
 * - JWT-based authentication for secure connections
 * - Room-based messaging for multi-tenant isolation
 * - Real-time messaging with delivery confirmations
 * - Typing indicators and read receipts
 * - Presence tracking (online/offline/typing)
 * - Rate limiting to prevent spam
 * - Conversation room management
 */
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway as NestWebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import type { AuthenticatedSocket } from './interfaces';
import {
  ConversationEventDto,
  MessageDeliveryDto,
  MessageEventDto,
  ReadReceiptDto,
  TypingIndicatorDto,
} from './dto';
import { WsJwtAuthGuard } from './guards';
import { WsExceptionFilter } from './filters/ws-exception.filter';
import { ConnectionManagerService } from '@/services/connection-manager.service';
import { MessageHandlerService } from '@/services/message-handler.service';
import { ConversationHandlerService } from '@/services/conversation-handler.service';
import { PresenceManagerService } from '@/services/presence-manager.service';
import type { PresenceStatus } from '@/services/presence-manager.service';

@UseFilters(new WsExceptionFilter())
@NestWebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // TODO: Use ConfigService for CORS_ORIGIN
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
  server!: Server;

  private readonly logger = new Logger(WebSocketGateway.name);

  constructor(
    private readonly connectionManager: ConnectionManagerService,
    private readonly messageHandler: MessageHandlerService,
    private readonly conversationHandler: ConversationHandlerService,
    private readonly presenceManager: PresenceManagerService,
  ) {}

  /**
   * Handles new WebSocket connections
   * Authenticates the client, joins appropriate rooms, and sends confirmation
   *
   * @param client - The authenticated WebSocket client
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      await this.connectionManager.handleConnection(client);

      const user = client.user;
      if (user) {
        // Set user presence to online
        this.presenceManager.setUserOnline(user.userId, this.server, user.organizationId);
      }
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
      this.presenceManager.setUserOffline(user.userId, this.server, user.organizationId);
    }

    this.connectionManager.handleDisconnect(client);
  }

  /**
   * Handles ping requests for connection health checks
   *
   * @param client - The WebSocket client sending the ping
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): void {
    this.connectionManager.handlePing(client);
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
    await this.connectionManager.handleSubscribe(client, channel);
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
    await this.connectionManager.handleUnsubscribe(client, channel);
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
    this.connectionManager.handleNotificationRead(client, notificationId);
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
    await this.messageHandler.handleMessageSend(client, this.server, data);
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
    await this.messageHandler.handleMessageEdit(client, this.server, data);
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
    await this.messageHandler.handleMessageDelete(client, this.server, data);
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
    this.messageHandler.handleMessageDelivered(client, this.server, data);
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
    this.messageHandler.handleMessageRead(client, this.server, data);
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
    await this.messageHandler.handleTypingIndicator(client, data);
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
    await this.conversationHandler.handleConversationJoin(client, data);
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
    await this.conversationHandler.handleConversationLeave(client, data);
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
    this.presenceManager.handlePresenceUpdate(client, this.server, status);
  }

  /**
   * Gets the count of currently connected sockets
   *
   * @returns The number of connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.connectionManager.getConnectedSocketsCount(this.server);
  }

  /**
   * Checks if the WebSocket server is initialized
   *
   * @returns True if server is initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.connectionManager.isInitialized(this.server);
  }

  /**
   * Gets user presence status
   *
   * @param userId - The user ID
   * @returns Presence status or null if not found
   */
  getUserPresence(userId: string): PresenceStatus | null {
    return this.presenceManager.getUserPresence(userId);
  }
}
