/**
 * Message API Service
 *
 * REST API client for message operations
 * Extends BaseApiService for consistent CRUD patterns
 */

import { BaseApiService } from '../core/BaseApiService';
import { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core';
import type {
  MessageDto,
  CreateMessageDto,
  UpdateMessageDto,
  MessageSearchParams,
} from './types';
import { z } from 'zod';

// Validation schemas
const createMessageSchema = z.object({
  conversationId: z.string().min(1),
  content: z.string().min(1).max(10000),
  type: z.enum(['text', 'image', 'file']).optional(),
  replyTo: z.string().optional(),
  metadata: z
    .object({
      fileName: z.string().optional(),
      fileSize: z.number().optional(),
      fileUrl: z.string().url().optional(),
    })
    .optional(),
});

const updateMessageSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']).optional(),
});

export class MessageApi extends BaseApiService<
  MessageDto,
  CreateMessageDto,
  UpdateMessageDto
> {
  constructor(client: ApiClient) {
    super(client, '/messaging/messages', {
      createSchema: createMessageSchema,
      updateSchema: updateMessageSchema,
    });
  }

  /**
   * Get messages for a specific conversation
   */
  async getByConversation(
    conversationId: string,
    params?: {
      before?: string; // Message ID for pagination
      limit?: number;
    }
  ): Promise<{ messages: MessageDto[]; hasMore: boolean; nextCursor?: string }> {
    const queryParams = new URLSearchParams();
    if (params?.before) queryParams.append('before', params.before);
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${this.baseEndpoint}/conversation/${conversationId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    return this.get(url);
  }

  /**
   * Search messages
   */
  async searchMessages(params: MessageSearchParams): Promise<{
    messages: MessageDto[];
    total: number;
    page: number;
  }> {
    return this.get(`${this.baseEndpoint}/search`, params);
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<MessageDto> {
    return this.patch(messageId, { status: 'read' });
  }

  /**
   * Mark multiple messages as read
   */
  async markMultipleAsRead(messageIds: string[]): Promise<void> {
    return this.post(`${this.baseEndpoint}/mark-read`, { messageIds });
  }

  /**
   * Delete message for current user
   */
  async deleteForMe(messageId: string): Promise<void> {
    return this.deleteRequest(`${this.baseEndpoint}/${messageId}/for-me`);
  }

  /**
   * Delete message for everyone
   */
  async deleteForEveryone(messageId: string): Promise<void> {
    return this.delete(messageId);
  }

  /**
   * React to a message
   */
  async addReaction(
    messageId: string,
    emoji: string
  ): Promise<{ reactions: Array<{ emoji: string; userId: string; count: number }> }> {
    return this.post(`${this.baseEndpoint}/${messageId}/reactions`, { emoji });
  }

  /**
   * Remove reaction from message
   */
  async removeReaction(messageId: string, emoji: string): Promise<void> {
    return this.deleteRequest(`${this.baseEndpoint}/${messageId}/reactions/${emoji}`);
  }

  /**
   * Forward message to conversation
   */
  async forwardMessage(
    messageId: string,
    targetConversationId: string
  ): Promise<MessageDto> {
    return this.post(`${this.baseEndpoint}/${messageId}/forward`, {
      targetConversationId,
    });
  }

  /**
   * Edit message content
   */
  async editMessage(messageId: string, content: string): Promise<MessageDto> {
    return this.patch(messageId, { content });
  }
}

// Export singleton instance
export const messageApi = new MessageApi(apiClient);
