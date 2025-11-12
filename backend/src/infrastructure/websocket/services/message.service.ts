/**
 * @fileoverview Message Service
 * @module infrastructure/websocket/services
 * @description Service for handling WebSocket messaging (conversations, typing, receipts)
 */

import { Injectable, Logger } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { MessageEventDto, MessageDeliveryDto, ReadReceiptDto, TypingIndicatorDto } from '../types/websocket.types';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly broadcastService: BroadcastService) {}

  /**
   * Sends a message to a conversation room
   */
  async sendMessageToConversation(conversationId: string, message: MessageEventDto): Promise<void> {
    try {
      await this.broadcastService.broadcastToRoom(
        `conversation:${conversationId}`,
        'message:send',
        message.toPayload(),
      );

      this.logger.log(`Message sent to conversation ${conversationId}`, {
        messageId: message.messageId,
        senderId: message.senderId,
      });
    } catch (error) {
      this.logger.error(`Failed to send message to conversation ${conversationId}`, error);
      throw error;
    }
  }

  /**
   * Sends a direct message to specific users
   */
  async sendMessageToUsers(userIds: string[], message: MessageEventDto): Promise<void> {
    try {
      const rooms = userIds.map(userId => `user:${userId}`);

      await this.broadcastService.broadcastToRooms(
        rooms,
        'message:send',
        message.toPayload(),
      );

      this.logger.log(`Direct message sent to ${userIds.length} users`, {
        messageId: message.messageId,
        senderId: message.senderId,
        recipientCount: userIds.length,
      });
    } catch (error) {
      this.logger.error('Failed to send direct message', error);
      throw error;
    }
  }

  /**
   * Broadcasts a typing indicator to conversation participants
   */
  async broadcastTypingIndicator(
    conversationId: string,
    typingIndicator: TypingIndicatorDto,
  ): Promise<void> {
    try {
      await this.broadcastService.broadcastToRoom(
        `conversation:${conversationId}`,
        'message:typing',
        typingIndicator.toPayload(),
      );

      this.logger.debug(`Typing indicator broadcasted to conversation ${conversationId}`, {
        userId: typingIndicator.userId,
        isTyping: typingIndicator.isTyping,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast typing indicator to conversation ${conversationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a read receipt to conversation participants
   */
  async broadcastReadReceipt(conversationId: string, readReceipt: ReadReceiptDto): Promise<void> {
    try {
      await this.broadcastService.broadcastToRoom(
        `conversation:${conversationId}`,
        'message:read',
        readReceipt.toPayload(),
      );

      this.logger.log(`Read receipt broadcasted to conversation ${conversationId}`, {
        messageId: readReceipt.messageId,
        userId: readReceipt.userId,
      });
    } catch (error) {
      this.logger.error(
        `Failed to broadcast read receipt to conversation ${conversationId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Broadcasts a message delivery confirmation
   */
  async broadcastMessageDelivery(senderId: string, delivery: MessageDeliveryDto): Promise<void> {
    try {
      await this.broadcastService.broadcastToUser(
        senderId,
        'message:delivered',
        delivery.toPayload(),
      );

      this.logger.debug(`Delivery confirmation sent to user ${senderId}`, {
        messageId: delivery.messageId,
        status: delivery.status,
      });
    } catch (error) {
      this.logger.error(`Failed to broadcast delivery confirmation to user ${senderId}`, error);
      throw error;
    }
  }
}
