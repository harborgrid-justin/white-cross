import { Injectable, Logger } from '@nestjs/common';
import { MessageSenderService } from './message-sender.service';
import { MessageManagementService } from './message-management.service';
import { MessageQueryService } from './message-query.service';
import { SendDirectMessageDto } from '../dto/send-direct-message.dto';
import { SendGroupMessageDto } from '../dto/send-group-message.dto';
import { EditMessageDto } from '../dto/edit-message.dto';
import { MessagePaginationDto } from '../dto/message-pagination.dto';
import { SearchMessagesDto } from '../dto/search-messages.dto';
import { MarkAsReadDto, MarkConversationAsReadDto } from '../dto/mark-as-read.dto';
import {
  SendDirectMessageResponse,
  SendGroupMessageResponse,
  EditMessageResponse,
  MessageHistoryResponse,
  SearchMessagesResponse,
  MarkConversationAsReadResponse,
} from '../types/message-response.types';
import { MarkAsReadResult, UnreadCountResult } from '../types/index';

import { BaseService } from '../../common/base';
/**
 * EnhancedMessageService
 *
 * Facade service that orchestrates message operations across specialized services.
 *
 * This service delegates to focused services:
 * - MessageSenderService: Handles sending messages
 * - MessageManagementService: Handles editing/deleting messages
 * - MessageQueryService: Handles querying and read status
 *
 * Provides a unified API while maintaining separation of concerns.
 */
@Injectable()
export class EnhancedMessageService extends BaseService {
  constructor(
    private readonly messageSender: MessageSenderService,
    private readonly messageManagement: MessageManagementService,
    private readonly messageQuery: MessageQueryService,
  ) {}

  // ===== Message Sending =====

  async sendDirectMessage(
    dto: SendDirectMessageDto,
    senderId: string,
    tenantId: string,
  ): Promise<SendDirectMessageResponse> {
    return this.messageSender.sendDirectMessage(dto, senderId, tenantId);
  }

  async sendGroupMessage(
    dto: SendGroupMessageDto,
    senderId: string,
    tenantId: string,
  ): Promise<SendGroupMessageResponse> {
    return this.messageSender.sendGroupMessage(dto, senderId, tenantId);
  }

  // ===== Message Management =====

  async editMessage(
    messageId: string,
    dto: EditMessageDto,
    userId: string,
  ): Promise<EditMessageResponse> {
    return this.messageManagement.editMessage(messageId, dto, userId);
  }

  async deleteMessage(messageId: string, userId: string): Promise<void> {
    return this.messageManagement.deleteMessage(messageId, userId);
  }

  // ===== Message Querying =====

  async getMessageHistory(
    dto: MessagePaginationDto,
    userId: string,
    tenantId: string,
  ): Promise<MessageHistoryResponse> {
    return this.messageQuery.getMessageHistory(dto, userId);
  }

  async searchMessages(
    dto: SearchMessagesDto,
    userId: string,
    tenantId: string,
  ): Promise<SearchMessagesResponse> {
    return this.messageQuery.searchMessages(dto, userId);
  }

  async markMessagesAsRead(dto: MarkAsReadDto, userId: string): Promise<MarkAsReadResult> {
    return this.messageQuery.markMessagesAsRead(dto, userId);
  }

  async markConversationAsRead(
    dto: MarkConversationAsReadDto,
    userId: string,
  ): Promise<MarkConversationAsReadResponse> {
    return this.messageQuery.markConversationAsRead(dto, userId);
  }

  async getUnreadCount(userId: string, conversationId?: string): Promise<UnreadCountResult> {
    return this.messageQuery.getUnreadCount(userId, conversationId);
  }
}
