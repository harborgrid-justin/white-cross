/**
 * @fileoverview WebSocket Conversation Handler Service
 * @module infrastructure/websocket/services
 * @description Handles conversation-related WebSocket events including join and leave operations
 */

import { Injectable, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../interfaces';
import { ConversationEventDto } from '../dto';
import { RateLimiterService } from './rate-limiter.service';

@Injectable()
export class ConversationHandlerService {
  private readonly logger = new Logger(ConversationHandlerService.name);

  constructor(private readonly rateLimiter: RateLimiterService) {}

  /**
   * Handles conversation join events
   * Validates access and adds user to conversation room
   *
   * @param client - The authenticated WebSocket client
   * @param data - Conversation event data
   */
  async handleConversationJoin(
    client: AuthenticatedSocket,
    data: Partial<ConversationEventDto>,
  ): Promise<void> {
    const user = client.user;

    if (!user) {
      throw new WsException('Authentication required');
    }

    // Rate limiting check
    const allowed = await this.rateLimiter.checkLimit(user.userId, 'conversation:join');
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

      this.logger.log(`User ${user.userId} joined conversation ${conversationDto.conversationId}`);

      // Notify other participants in the room
      client.to(room).emit('conversation:join', conversationDto.toPayload());

      // Send confirmation to the joining user
      client.emit('conversation:joined', {
        conversationId: conversationDto.conversationId,
        timestamp: conversationDto.timestamp,
      });
    } catch (error) {
      this.logger.error(`Conversation join error for user ${user.userId}:`, error);
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
  async handleConversationLeave(
    client: AuthenticatedSocket,
    data: Partial<ConversationEventDto>,
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

      this.logger.log(`User ${user.userId} left conversation ${conversationDto.conversationId}`);

      // Send confirmation to the leaving user
      client.emit('conversation:left', {
        conversationId: conversationDto.conversationId,
        timestamp: conversationDto.timestamp,
      });
    } catch (error) {
      this.logger.error(`Conversation leave error for user ${user.userId}:`, error);
      client.emit('error', {
        type: 'CONVERSATION_LEAVE_FAILED',
        message: (error as Error).message || 'Failed to leave conversation',
      });
    }
  }
}
