/**
 * @fileoverview Refactored WebSocket Gateway
 * @module infrastructure/websocket
 * @description Main WebSocket gateway that delegates to specialized service handlers
 *
 * This is a refactored version of the original WebSocket Gateway that has been
 * broken down into smaller, more focused services for better maintainability.
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
import { ConnectionManagerService } from './services/connection-manager.service';
import { MessageHandlerService } from './services/message-handler.service';
import { ConversationHandlerService } from './services/conversation-handler.service';
import { PresenceManagerService } from './services/presence-manager.service';

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
   * Delegates to ConnectionManagerService
   */
  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    await this.connectionManager.handleConnection(client);

    // Set user presence to online
    const user = client.user;
    if (user) {
      this.presenceManager.setUserOnline(user.userId, this.server, user.organizationId);
    }
  }

  /**
   * Handles client disconnection
   * Delegates to ConnectionManagerService and PresenceManagerService
   */
  handleDisconnect(client: AuthenticatedSocket): void {
    const user = client.user;

    // Set user presence to offline
    if (user) {
      this.presenceManager.setUserOffline(user.userId, this.server, user.organizationId);
    }

    this.connectionManager.handleDisconnect(client);
  }

  /**
   * Handles ping requests for connection health checks
   */
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket): void {
    this.connectionManager.handlePing(client);
  }

  /**
   * Handles subscription requests to specific notification channels
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
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:delivered')
  handleMessageDelivered(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<MessageDeliveryDto>,
  ): void {
    this.messageHandler.handleMessageDelivered(client, this.server, data);
  }

  /**
   * Handles message read receipts
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('message:read')
  handleMessageRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: Partial<ReadReceiptDto>,
  ): void {
    this.messageHandler.handleMessageRead(client, this.server, data);
  }

  /**
   * Handles typing indicator events
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
   */
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('presence:update')
  handlePresenceUpdate(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() status: 'online' | 'offline' | 'away',
  ): void {
    this.presenceManager.handlePresenceUpdate(client, this.server, status);
  }

  /**
   * Gets the count of currently connected sockets
   */
  getConnectedSocketsCount(): number {
    return this.connectionManager.getConnectedSocketsCount(this.server);
  }

  /**
   * Checks if the WebSocket server is initialized
   */
  isInitialized(): boolean {
    return this.connectionManager.isInitialized(this.server);
  }

  /**
   * Gets user presence status
   */
  getUserPresence(userId: string): { status: string; lastSeen: string } | null {
    return this.presenceManager.getUserPresence(userId);
  }

  /**
   * Gets presence statistics
   */
  getPresenceStats(): {
    total: number;
    online: number;
    offline: number;
    away: number;
  } {
    return this.presenceManager.getPresenceStats();
  }
}
