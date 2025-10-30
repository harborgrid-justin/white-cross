/**
 * Conversation API Service
 *
 * REST API client for conversation operations
 */

import { BaseApiService } from '../core/BaseApiService';
import { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core';
import type {
  ConversationDto,
  CreateConversationDto,
  UpdateConversationDto,
  ConversationFilters,
  UnreadCountResponse,
} from './types';
import { z } from 'zod';

// Validation schemas
const createConversationSchema = z.object({
  type: z.enum(['direct', 'group', 'channel']),
  name: z.string().min(1).max(100).optional(),
  participantIds: z.array(z.string()).min(1),
  metadata: z
    .object({
      description: z.string().optional(),
      avatar: z.string().url().optional(),
      encryptionEnabled: z.boolean().optional(),
    })
    .optional(),
});

const updateConversationSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isPinned: z.boolean().optional(),
  isMuted: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  metadata: z
    .object({
      description: z.string().optional(),
      avatar: z.string().url().optional(),
    })
    .optional(),
});

export class ConversationApi extends BaseApiService<
  ConversationDto,
  CreateConversationDto,
  UpdateConversationDto
> {
  constructor(client: ApiClient) {
    super(client, '/messaging/conversations', {
      createSchema: createConversationSchema,
      updateSchema: updateConversationSchema,
    });
  }

  /**
   * Get conversations with filters
   */
  async getConversations(
    filters?: ConversationFilters
  ): Promise<{ conversations: ConversationDto[]; total: number; page: number }> {
    return this.get(this.baseEndpoint, filters);
  }

  /**
   * Get or create direct conversation with user
   */
  async getOrCreateDirect(participantId: string): Promise<ConversationDto> {
    return this.post(`${this.baseEndpoint}/direct`, { participantId });
  }

  /**
   * Add participant to conversation
   */
  async addParticipant(
    conversationId: string,
    userId: string
  ): Promise<ConversationDto> {
    return this.post(`${this.baseEndpoint}/${conversationId}/participants`, { userId });
  }

  /**
   * Remove participant from conversation
   */
  async removeParticipant(
    conversationId: string,
    userId: string
  ): Promise<ConversationDto> {
    return this.deleteRequest(
      `${this.baseEndpoint}/${conversationId}/participants/${userId}`
    );
  }

  /**
   * Leave conversation
   */
  async leaveConversation(conversationId: string): Promise<void> {
    return this.post(`${this.baseEndpoint}/${conversationId}/leave`, {});
  }

  /**
   * Pin conversation
   */
  async pinConversation(conversationId: string): Promise<ConversationDto> {
    return this.patch(conversationId, { isPinned: true });
  }

  /**
   * Unpin conversation
   */
  async unpinConversation(conversationId: string): Promise<ConversationDto> {
    return this.patch(conversationId, { isPinned: false });
  }

  /**
   * Mute conversation
   */
  async muteConversation(conversationId: string): Promise<ConversationDto> {
    return this.patch(conversationId, { isMuted: true });
  }

  /**
   * Unmute conversation
   */
  async unmuteConversation(conversationId: string): Promise<ConversationDto> {
    return this.patch(conversationId, { isMuted: false });
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: string): Promise<ConversationDto> {
    return this.patch(conversationId, { isArchived: true });
  }

  /**
   * Unarchive conversation
   */
  async unarchiveConversation(conversationId: string): Promise<ConversationDto> {
    return this.patch(conversationId, { isArchived: false });
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    return this.post(`${this.baseEndpoint}/${conversationId}/read`, {});
  }

  /**
   * Get unread count
   */
  async getUnreadCount(): Promise<UnreadCountResponse> {
    return this.get(`${this.baseEndpoint}/unread-count`);
  }

  /**
   * Clear conversation history
   */
  async clearHistory(conversationId: string): Promise<void> {
    return this.deleteRequest(`${this.baseEndpoint}/${conversationId}/history`);
  }
}

// Export singleton instance
export const conversationApi = new ConversationApi(apiClient);
