/**
 * @fileoverview Direct Messages API Service - Person-to-person messaging
 * @module services/modules/communications/directMessagesApi
 * @version 2.0.0
 * @category Services
 *
 * Provides comprehensive direct messaging functionality for secure communication
 * between users. Supports inbox management, message threads, file attachments,
 * and read/unread status tracking.
 *
 * ## Key Features
 *
 * **Direct Messaging** (12 methods):
 * - Send direct messages between users
 * - Manage inbox and sent messages
 * - Thread support with parent message tracking
 * - File attachments with secure storage
 * - Read/unread status management
 *
 * **PHI Compliance**:
 * - HIPAA-compliant message handling
 * - Secure message storage with encryption
 * - Audit logging for all communications
 * - Access control and RBAC enforcement
 *
 * @example
 * ```typescript
 * // Send urgent direct message
 * const message = await directMessagesApi.sendMessage({
 *   subject: 'Student Medication Needed',
 *   body: 'Student needs inhaler - see health record',
 *   recipientId: nurseUserId,
 *   priority: 'URGENT'
 * });
 * ```
 */

import type { ApiClient, ApiResponse, PaginatedResponse } from '../../core/ApiClient';
import { buildUrlParams } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export type MessageStatus = 'DRAFT' | 'SENT' | 'READ' | 'ARCHIVED';
export type MessagePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface Message {
  id: string;
  subject: string;
  body: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  status: MessageStatus;
  priority: MessagePriority;
  isReply: boolean;
  parentMessageId?: string;
  threadId: string;
  hasAttachments: boolean;
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
  }>;
  sentAt?: string;
  readAt?: string;
  archivedAt?: string;
  createdAt: string;
}

export interface CreateMessageRequest {
  subject: string;
  body: string;
  recipientId: string;
  priority?: MessagePriority;
  parentMessageId?: string; // For replies
  attachments?: Array<{
    filename: string;
    data: string; // Base64 encoded
  }>;
}

export interface UpdateMessageRequest {
  subject?: string;
  body?: string;
  status?: MessageStatus;
  priority?: MessagePriority;
}

export interface MessageFilters extends Record<string, unknown> {
  status?: MessageStatus;
  priority?: MessagePriority;
  senderId?: string;
  recipientId?: string;
  threadId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const messageSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  body: z.string().min(1, 'Message body is required').max(5000),
  recipientId: z.string().uuid('Invalid recipient ID'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

// ==========================================
// DIRECT MESSAGES API SERVICE
// ==========================================

/**
 * Direct Messages API Service
 *
 * Provides comprehensive direct messaging functionality including sending,
 * receiving, threading, and status management.
 */
export class DirectMessagesApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all messages with optional filters
   * @endpoint GET /communications/messages
   */
  async getMessages(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<Message>>(
        `/communications/messages${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch messages');
    }
  }

  /**
   * Get inbox messages
   * @endpoint GET /communications/messages/inbox
   */
  async getInbox(page?: number, limit?: number): Promise<PaginatedResponse<Message>> {
    try {
      const params = buildUrlParams({ page, limit });
      const response = await this.client.get<PaginatedResponse<Message>>(
        `/communications/messages/inbox?${params}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inbox');
    }
  }

  /**
   * Get sent messages
   * @endpoint GET /communications/messages/sent
   */
  async getSentMessages(page?: number, limit?: number): Promise<PaginatedResponse<Message>> {
    try {
      const params = buildUrlParams({ page, limit });
      const response = await this.client.get<PaginatedResponse<Message>>(
        `/communications/messages/sent?${params}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch sent messages');
    }
  }

  /**
   * Get single message by ID
   * @endpoint GET /communications/messages/{id}
   */
  async getMessage(id: string): Promise<Message> {
    try {
      const response = await this.client.get<ApiResponse<Message>>(
        `/communications/messages/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch message');
    }
  }

  /**
   * Send new message
   * @endpoint POST /communications/messages
   */
  async sendMessage(data: CreateMessageRequest): Promise<Message> {
    try {
      messageSchema.parse(data);
      const response = await this.client.post<ApiResponse<Message>>(
        '/communications/messages',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Message validation failed', 'message', {}, error);
      }
      throw createApiError(error, 'Failed to send message');
    }
  }

  /**
   * Update message
   * @endpoint PUT /communications/messages/{id}
   */
  async updateMessage(id: string, data: UpdateMessageRequest): Promise<Message> {
    try {
      const response = await this.client.put<ApiResponse<Message>>(
        `/communications/messages/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update message');
    }
  }

  /**
   * Delete message
   * @endpoint DELETE /communications/messages/{id}
   */
  async deleteMessage(id: string): Promise<void> {
    try {
      await this.client.delete(`/communications/messages/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete message');
    }
  }

  /**
   * Reply to message
   * @endpoint POST /communications/messages/{id}/reply
   */
  async replyToMessage(messageId: string, body: string, attachments?: Array<{filename: string; data: string}>): Promise<Message> {
    try {
      const response = await this.client.post<ApiResponse<Message>>(
        `/communications/messages/${messageId}/reply`,
        { body, attachments }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to reply to message');
    }
  }

  /**
   * Mark message as read
   * @helper Convenience method using updateMessage
   */
  async markAsRead(id: string): Promise<Message> {
    return this.updateMessage(id, { status: 'READ' });
  }

  /**
   * Mark message as unread
   * @helper Convenience method using updateMessage
   */
  async markAsUnread(id: string): Promise<Message> {
    return this.updateMessage(id, { status: 'SENT' });
  }

  /**
   * Archive message
   * @helper Convenience method using updateMessage
   */
  async archiveMessage(id: string): Promise<Message> {
    return this.updateMessage(id, { status: 'ARCHIVED' });
  }

  /**
   * Get unread messages count
   * @helper Convenience method filtering inbox
   */
  async getUnreadCount(): Promise<number> {
    try {
      const response = await this.getMessages({ status: 'SENT', limit: 1 });
      return response.pagination?.total || 0;
    } catch (error) {
      throw createApiError(error, 'Failed to get unread count');
    }
  }
}

/**
 * Factory function to create Direct Messages API instance
 */
export function createDirectMessagesApi(client: ApiClient): DirectMessagesApi {
  return new DirectMessagesApi(client);
}
