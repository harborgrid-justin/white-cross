/**
 * @fileoverview WebSocket Message Handler Service
 * @module infrastructure/websocket/services
 * @description Handles message-related WebSocket events including send, edit, delete, delivery, and read receipts
 */

import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../interfaces';
import { MessageEventDto, MessageDeliveryDto, ReadReceiptDto, TypingIndicatorDto } from '../dto';
import { RateLimiterService } from './rate-limiter.service';
import { WebSocketUtilities } from '../shared/websocket-utilities';

import { BaseService } from '@/common/base';
@Injectable()
export class MessageHandlerService extends BaseService {
  constructor(private readonly rateLimiter: RateLimiterService) {
    super("MessageHandlerService");}

  /**
   * Handles message send events
   * Validates, rate limits, and broadcasts messages to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param server - The Socket.IO server instance
   * @param data - Message event data
   */
  async handleMessageSend(
    client: AuthenticatedSocket,
    server: Server,
    data: Partial<MessageEventDto>,
  ): Promise<void> {
    await WebSocketUtilities.executeWithCommonHandling({
      client,
      rateLimiter: this.rateLimiter,
      logger: this.logger,
      action: 'message:send',
      createDto: () => new MessageEventDto({
        ...data,
        type: 'send',
        senderId: client.user.userId,
        organizationId: client.user.organizationId,
      }),
      validate: (dto, userId, organizationId) => {
        return WebSocketUtilities.validateDto(dto, userId, organizationId, client, this.logger, 'message send');
      },
      execute: async (messageDto) => {
        // Broadcast to conversation room
        const room = WebSocketUtilities.getConversationRoom(messageDto.conversationId);
        server.to(room).emit('message:send', messageDto.toPayload());

        // Send delivery confirmation to sender
        const deliveryDto = new MessageDeliveryDto({
          messageId: messageDto.messageId,
          conversationId: messageDto.conversationId,
          recipientId: client.user.userId,
          senderId: client.user.userId,
          organizationId: client.user.organizationId,
          status: 'sent',
        });

        client.emit('message:delivered', deliveryDto.toPayload());

        return { messageId: messageDto.messageId, conversationId: messageDto.conversationId };
      },
      onSuccess: (result, dto) => {
        WebSocketUtilities.logAction(this.logger, 'Message sent', client.user.userId, {
          messageId: result.messageId,
          conversationId: result.conversationId,
        });
      },
    });
  }

  /**
   * Handles message edit events
   * Validates ownership and broadcasts edits to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param server - The Socket.IO server instance
   * @param data - Message event data
   */
  async handleMessageEdit(
    client: AuthenticatedSocket,
    server: Server,
    data: Partial<MessageEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:edit');
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

      this.logInfo(
        `Message edited: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`,
      );

      // Broadcast to conversation room
      const room = `conversation:${messageDto.conversationId}`;
      server.to(room).emit('message:edit', messageDto.toPayload());
    } catch (error) {
      this.logError(`Message edit error for user ${user.userId}:`, error);
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
   * @param server - The Socket.IO server instance
   * @param data - Message event data
   */
  async handleMessageDelete(
    client: AuthenticatedSocket,
    server: Server,
    data: Partial<MessageEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:delete');
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

      this.logInfo(
        `Message deleted: ${messageDto.messageId} in conversation ${messageDto.conversationId} by user ${user.userId}`,
      );

      // Broadcast to conversation room
      const room = `conversation:${messageDto.conversationId}`;
      server.to(room).emit('message:delete', {
        messageId: messageDto.messageId,
        conversationId: messageDto.conversationId,
        timestamp: messageDto.timestamp,
      });
    } catch (error) {
      this.logError(`Message delete error for user ${user.userId}:`, error);
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
   * @param server - The Socket.IO server instance
   * @param data - Delivery confirmation data
   */
  handleMessageDelivered(
    client: AuthenticatedSocket,
    server: Server,
    data: Partial<MessageDeliveryDto>,
  ): void {
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

      this.logDebug(`Message ${deliveryDto.messageId} delivered to user ${user.userId}`);

      // Notify the sender
      const senderRoom = `user:${deliveryDto.senderId}`;
      server.to(senderRoom).emit('message:delivered', deliveryDto.toPayload());
    } catch (error) {
      this.logError(`Delivery confirmation error for user ${user.userId}:`, error);
    }
  }

  /**
   * Handles message read receipts
   * Broadcasts read status to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param server - The Socket.IO server instance
   * @param data - Read receipt data
   */
  handleMessageRead(
    client: AuthenticatedSocket,
    server: Server,
    data: Partial<ReadReceiptDto>,
  ): void {
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

      this.logDebug(`Message ${readReceiptDto.messageId} read by user ${user.userId}`);

      // Broadcast to conversation room
      const room = `conversation:${readReceiptDto.conversationId}`;
      server.to(room).emit('message:read', readReceiptDto.toPayload());
    } catch (error) {
      this.logError(`Read receipt error for user ${user.userId}:`, error);
    }
  }

  /**
   * Handles typing indicator events
   * Broadcasts typing status to conversation participants
   *
   * @param client - The authenticated WebSocket client
   * @param data - Typing indicator data
   */
  async handleTypingIndicator(
    client: AuthenticatedSocket,
    data: Partial<TypingIndicatorDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'message:typing');
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
      this.logError(`Typing indicator error for user ${user.userId}:`, error);
    }
  }
}
