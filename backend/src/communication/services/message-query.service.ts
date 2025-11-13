import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, WhereOptions } from 'sequelize';
import { Message } from '../../database/models/message.model';
import { MessageRead } from '../../database/models/message-read.model';
import { ConversationParticipant } from '../../database/models/conversation-participant.model';
import { MessagePaginationDto } from '../dto/message-pagination.dto';
import { SearchMessagesDto } from '../dto/search-messages.dto';
import { MarkAsReadDto } from '../dto/mark-as-read.dto';
import { MarkConversationAsReadDto } from '../dto/mark-as-read.dto';
import {
  MessageHistoryResponse,
  SearchMessagesResponse,
  MarkConversationAsReadResponse,
} from '../types/message-response.types';
import { MarkAsReadResult, UnreadCountResult } from '../types/index';

import { BaseService } from '@/common/base';
/**
 * MessageQueryService
 *
 * Handles message querying operations like history, search, and read status.
 *
 * Responsibilities:
 * - Get message history with pagination
 * - Search messages with full-text search
 * - Mark messages as read
 * - Get unread message counts
 * - Handle participant validation for queries
 */
@Injectable()
export class MessageQueryService extends BaseService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(MessageRead) private messageReadModel: typeof MessageRead,
    @InjectModel(ConversationParticipant)
    private participantModel: typeof ConversationParticipant,
  ) {}

  /**
   * Get message history with pagination
   */
  async getMessageHistory(
    dto: MessagePaginationDto,
    userId: string,
  ): Promise<MessageHistoryResponse> {
    // Build base where clause
    const where = await this.buildMessageWhereClause(dto, userId);

    const offset = ((dto.page || 1) - 1) * (dto.limit || 20);
    const limit = dto.limit || 20;

    // Query messages
    const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', dto.sortOrder || 'DESC']],
      include: [
        {
          model: this.messageReadModel,
          where: { userId },
          required: false,
        },
      ],
    });

    return {
      messages: messages.map((m) => m.toJSON()),
      pagination: {
        page: dto.page || 1,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search messages with full-text search
   */
  async searchMessages(dto: SearchMessagesDto, userId: string): Promise<SearchMessagesResponse> {
    // Build base where clause with search criteria
    const where = await this.buildMessageWhereClause(dto, userId, {
      content: {
        [Op.iLike]: `%${dto.query}%`, // Case-insensitive search
      },
      ...(dto.senderId && { senderId: dto.senderId }),
      ...(dto.hasAttachments && { attachments: { [Op.ne]: [] } }),
    });

    const offset = ((dto.page || 1) - 1) * (dto.limit || 20);
    const limit = dto.limit || 20;

    // Query messages
    const { rows: messages, count: total } = await this.messageModel.findAndCountAll({
      where,
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      messages: messages.map((m) => m.toJSON()),
      pagination: {
        page: dto.page || 1,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      query: dto.query,
    };
  }

  /**
   * Build common where clause for message queries
   */
  private async buildMessageWhereClause(
    dto: MessagePaginationDto | SearchMessagesDto,
    userId: string,
    additionalWhere: WhereOptions = {},
  ): Promise<WhereOptions> {
    const where: WhereOptions = { ...additionalWhere };

    // Handle conversation filtering
    if ('conversationId' in dto && dto.conversationId) {
      // Verify user is a participant for single conversation queries
      const isParticipant = await this.isConversationParticipant(dto.conversationId, userId);
      if (!isParticipant) {
        throw new BadRequestException('You are not a participant in this conversation');
      }
      where.conversationId = dto.conversationId;
    } else if ('conversationIds' in dto && dto.conversationIds && dto.conversationIds.length > 0) {
      where.conversationId = { [Op.in]: dto.conversationIds };
    } else {
      // For queries without specific conversation, only show messages from user's conversations
      const participantConversations = await this.participantModel.findAll({
        where: { userId },
        attributes: ['conversationId'],
      });
      const conversationIds = participantConversations.map((p) => p.conversationId);
      where.conversationId = { [Op.in]: conversationIds };
    }

    // Handle thread filtering
    if ('threadId' in dto && dto.threadId) {
      where.threadId = dto.threadId;
    }

    // Handle date filtering
    if (dto.dateFrom) {
      where.createdAt = {
        ...(where.createdAt as any),
        [Op.gte]: new Date(dto.dateFrom),
      };
    }

    if (dto.dateTo) {
      where.createdAt = {
        ...(where.createdAt as any),
        [Op.lte]: new Date(dto.dateTo),
      };
    }

    return where;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(dto: MarkAsReadDto, userId: string): Promise<MarkAsReadResult> {
    this.logInfo(`Marking ${dto.messageIds.length} messages as read for user ${userId}`);

    const readPromises = dto.messageIds.map((messageId) =>
      this.messageReadModel.findOrCreate({
        where: { messageId, userId },
        defaults: {
          messageId,
          userId,
          readAt: new Date(),
        },
      }),
    );

    const results = await Promise.all(readPromises);
    const newReads = results.filter(([, created]) => created).length;

    // Update participant's lastReadAt timestamp
    await this.updateParticipantReadTimestamp(dto.messageIds, userId);

    return {
      markedAsRead: newReads,
      total: dto.messageIds.length,
    };
  }

  /**
   * Mark all messages in a conversation as read
   */
  async markConversationAsRead(
    dto: MarkConversationAsReadDto,
    userId: string,
  ): Promise<MarkConversationAsReadResponse> {
    this.logInfo(`Marking conversation ${dto.conversationId} as read for user ${userId}`);

    // Get all unread messages in the conversation
    const messages = await this.messageModel.findAll({
      where: {
        conversationId: dto.conversationId,
        senderId: { [Op.ne]: userId }, // Exclude own messages
      },
      include: [
        {
          model: this.messageReadModel,
          where: { userId },
          required: false,
        },
      ],
    });

    // Filter messages that haven't been read yet
    const unreadMessages = messages.filter(
      (m: Message) => !m.messageReads || m.messageReads.length === 0,
    );

    // Mark all as read
    const readPromises = unreadMessages.map((message) =>
      this.messageReadModel.create({
        messageId: message.id,
        userId,
        readAt: new Date(),
      }),
    );

    await Promise.all(readPromises);

    // Update participant's lastReadAt
    await this.participantModel.update(
      { lastReadAt: new Date() },
      {
        where: {
          conversationId: dto.conversationId,
          userId,
        },
      },
    );

    return {
      markedAsRead: unreadMessages.length,
    };
  }

  /**
   * Get unread message count for a user
   */
  async getUnreadCount(userId: string, conversationId?: string): Promise<UnreadCountResult> {
    this.logInfo(`Getting unread count for user ${userId}`);

    const where: WhereOptions = {
      senderId: { [Op.ne]: userId }, // Exclude own messages
    };

    if (conversationId) {
      where.conversationId = conversationId;
    } else {
      // Get all conversations user is part of
      const participantConversations = await this.participantModel.findAll({
        where: { userId },
        attributes: ['conversationId'],
      });

      const conversationIds = participantConversations.map((p) => p.conversationId);
      where.conversationId = { [Op.in]: conversationIds };
    }

    // Get messages not marked as read
    const messages = await this.messageModel.findAll({
      where,
      attributes: ['id', 'conversationId'],
      include: [
        {
          model: this.messageReadModel,
          where: { userId },
          required: false,
        },
      ],
    });

    // Count unread messages by conversation
    const unreadByConversation: Record<string, number> = {};
    let totalUnread = 0;

    messages.forEach((message: Message & { messageReads?: unknown[] }) => {
      const isRead = message.messageReads && message.messageReads.length > 0;
      if (!isRead) {
        const convId = message.conversationId;
        unreadByConversation[convId] = (unreadByConversation[convId] || 0) + 1;
        totalUnread++;
      }
    });

    return {
      total: totalUnread,
      byConversation: unreadByConversation,
    };
  }

  /**
   * Check if user is a participant in a conversation
   */
  private async isConversationParticipant(
    conversationId: string,
    userId: string,
  ): Promise<boolean> {
    const participant = await this.participantModel.findOne({
      where: { conversationId, userId },
    });
    return !!participant;
  }

  /**
   * Update participant's last read timestamp
   */
  private async updateParticipantReadTimestamp(
    messageIds: string[],
    userId: string,
  ): Promise<void> {
    // Get conversations for these messages
    const messages = await this.messageModel.findAll({
      where: { id: { [Op.in]: messageIds } },
      attributes: ['conversationId'],
    });

    const conversationIds = [...new Set(messages.map((m) => m.conversationId))].filter(Boolean);

    // Update lastReadAt for all relevant conversations
    await this.participantModel.update(
      { lastReadAt: new Date() },
      {
        where: {
          conversationId: { [Op.in]: conversationIds },
          userId,
        },
      },
    );
  }
}