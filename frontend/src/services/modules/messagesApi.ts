/**
 * MIGRATION STATUS: DEPRECATED
 *
 * This service module has been replaced by Next.js Server Actions for improved
 * performance, security, and Next.js App Router compatibility.
 *
 * **New Implementation:**
 * - Server Components: import from '@/lib/actions/messages.actions'
 * - Client Components: Use Server Actions with useActionState or React Query
 *
 * **Migration Guide:**
 *
 * OLD (Client API):
 * ```typescript
 * import { messagesApi } from '@/services/modules/messagesApi';
 *
 * // Send urgent message
 * const message = await messagesApi.create({
 *   subject: 'Student Needs Immediate Attention',
 *   body: 'Please come to classroom 305 immediately.',
 *   recipientId: nurseUserId,
 *   priority: 'URGENT'
 * });
 *
 * // Get inbox
 * const inbox = await messagesApi.getInbox({ unreadOnly: true });
 *
 * // Reply to message
 * const reply = await messagesApi.reply(messageId, { body: 'On my way.' });
 * ```
 *
 * NEW (Server Actions):
 * ```typescript
 * import {
 *   createMessageAction,
 *   sendMessageAction,
 *   markMessageReadAction,
 *   getMessages
 * } from '@/lib/actions/messages.actions';
 *
 * // In Server Components - direct call
 * const messages = await getMessages();
 *
 * // In Client Components - with useActionState
 * 'use client';
 * import { useActionState } from 'react';
 *
 * function MessageForm() {
 *   const [state, formAction, isPending] = useActionState(
 *     createMessageAction,
 *     { errors: {} }
 *   );
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 *
 * **Available Server Actions:**
 * - Messaging: createMessageAction, updateMessageAction, sendMessageAction, markMessageReadAction
 * - Cached Data: getMessage, getMessages, getMessageThread, getMessageThreads
 * - Templates: createMessageTemplateAction, getMessageTemplates
 * - Statistics: getMessagesStats, getMessagesDashboardData
 * - Utilities: messageExists, getMessageCount, getUnreadMessageCount
 *
 * **See Also:**
 * - @see {@link /lib/actions/messages.actions.ts} for all available Server Actions
 * - @see {@link /lib/actions/messages.send.ts} for messaging operations
 * - @see {@link /lib/actions/messages.templates.ts} for template operations
 * - @see {@link /lib/actions/messages.cache.ts} for cached data operations
 * - @see {@link /lib/actions/communications.actions.ts} for unified communications API
 * - @see {@link /lib/api/client} for client-side utilities if needed
 *
 * @deprecated Use Server Actions from @/lib/actions/messages.actions instead
 * @module services/modules/messagesApi
 * @category Services
 */

import type { ApiClient } from '@/services/core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';

/**
 * Messages API interfaces
 */
export interface Message {
  id: string;
  subject: string;
  body: string;
  senderId: string;
  senderName?: string;
  recipientId: string;
  recipientName?: string;
  status: 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
  }>;
  readAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageRequest {
  subject: string;
  body: string;
  recipientId: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  attachments?: string[];
  templateId?: string;
}

export interface UpdateMessageRequest {
  subject?: string;
  body?: string;
  status?: 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  body: string;
  category?: string;
  variables?: string[];
}

export interface DeliveryStatus {
  messageId: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  deliveredAt?: string;
  failureReason?: string;
  attempts: number;
  lastAttempt: string;
}

export interface MessageStatistics {
  totalSent: number;
  totalReceived: number;
  unreadCount: number;
  deliveryRate: number;
  averageResponseTime: number;
  byPriority: Record<string, number>;
}

export interface MessageFilters {
  status?: string;
  priority?: string;
  senderId?: string;
  recipientId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Messages API Service
 * Handles all messaging related API calls
 */
export class MessagesApi {
  private client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client;
  }

  /**
   * Get all messages with filters
   */
  async getAll(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    const params = buildPaginationParams(filters?.page, filters?.limit);
    const allParams = filters ? Object.assign({}, params, filters) : params;
    const response = await this.client.get<PaginatedResponse<Message>>(
      '/communications/messages',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get message by ID
   */
  async getById(messageId: string): Promise<Message> {
    const response = await this.client.get<ApiResponse<Message>>(
      `/communications/messages/${messageId}`
    );
    return response.data.data!;
  }

  /**
   * Create new message
   */
  async create(messageData: CreateMessageRequest): Promise<Message> {
    const response = await this.client.post<ApiResponse<Message>>(
      '/communications/messages',
      messageData
    );
    return response.data.data!;
  }

  /**
   * Update message
   */
  async update(messageId: string, messageData: UpdateMessageRequest): Promise<Message> {
    const response = await this.client.put<ApiResponse<Message>>(
      `/communications/messages/${messageId}`,
      messageData
    );
    return response.data.data!;
  }

  /**
   * Delete message
   */
  async delete(messageId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/communications/messages/${messageId}`
    );
    return response.data.data!;
  }

  /**
   * Reply to message
   */
  async reply(messageId: string, replyData: {
    body: string;
    attachments?: string[];
  }): Promise<Message> {
    const response = await this.client.post<ApiResponse<Message>>(
      `/communications/messages/${messageId}/reply`,
      replyData
    );
    return response.data.data!;
  }

  /**
   * Get inbox messages
   */
  async getInbox(params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<PaginatedResponse<Message>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await this.client.get<PaginatedResponse<Message>>(
      '/communications/messages/inbox',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get sent messages
   */
  async getSent(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Message>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const response = await this.client.get<PaginatedResponse<Message>>(
      '/communications/messages/sent',
      { params: paginationParams }
    );
    return response.data;
  }

  /**
   * Get message templates
   */
  async getTemplates(params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<MessageTemplate>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const allParams = params ? Object.assign({}, paginationParams, params) : paginationParams;
    const response = await this.client.get<PaginatedResponse<MessageTemplate>>(
      '/communications/templates',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create message template
   */
  async createTemplate(templateData: CreateTemplateRequest): Promise<MessageTemplate> {
    const response = await this.client.post<ApiResponse<MessageTemplate>>(
      '/communications/templates',
      templateData
    );
    return response.data.data!;
  }

  /**
   * Get delivery status
   */
  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    const response = await this.client.get<ApiResponse<DeliveryStatus>>(
      `/communications/delivery-status/${messageId}`
    );
    return response.data.data!;
  }

  /**
   * Get message statistics
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<MessageStatistics> {
    const response = await this.client.get<ApiResponse<MessageStatistics>>(
      '/communications/statistics',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<Message> {
    return this.update(messageId, { status: 'READ' });
  }

  /**
   * Mark message as unread
   */
  async markAsUnread(messageId: string): Promise<Message> {
    return this.update(messageId, { status: 'DELIVERED' });
  }
}

// Factory function for creating MessagesApi instances
export function createMessagesApi(client: ApiClient): MessagesApi {
  return new MessagesApi(client);
}

// Export singleton instance for registry
import { apiClient } from '../core';
export const messagesApi = createMessagesApi(apiClient);
