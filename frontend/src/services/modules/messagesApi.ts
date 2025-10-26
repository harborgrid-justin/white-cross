/**
 * @fileoverview Messages API Module - Direct messaging and communication management
 * @module services/modules/messagesApi
 * @category Services
 *
 * Provides comprehensive direct messaging functionality for secure communication
 * between users in the healthcare platform. Supports inbox management, message
 * threads, file attachments, templates, and delivery tracking.
 *
 * **NOTE**: This module is deprecated in favor of `communicationsApi.ts` which
 * provides a unified API for both broadcasts and direct messaging. This module
 * is maintained for backward compatibility.
 *
 * ## Key Features
 *
 * **Direct Messaging**:
 * - Send secure messages between nurses, staff, administrators, and parents
 * - Thread support for conversation continuity
 * - Read/unread status tracking
 * - Priority levels (LOW, NORMAL, HIGH, URGENT)
 * - File attachments with secure storage
 *
 * **Inbox Management**:
 * - Retrieve inbox and sent messages
 * - Filter by status, priority, sender, recipient
 * - Pagination support for large message volumes
 * - Unread message count tracking
 *
 * **Message Templates**:
 * - Pre-defined templates for common communications
 * - Variable substitution for personalization
 * - Category-based organization
 * - Template usage tracking
 *
 * **Delivery Status**:
 * - Track message delivery across channels
 * - Retry logic for failed deliveries
 * - Delivery confirmation timestamps
 *
 * ## Healthcare-Specific Features
 *
 * **PHI Compliance**:
 * - HIPAA-compliant message encryption
 * - Secure attachment handling
 * - Audit logging for all message operations
 * - Access control enforcement
 * - No PHI in notification previews
 *
 * **Emergency Messaging**:
 * - URGENT priority for time-critical communications
 * - Multi-channel delivery for urgent messages
 * - Delivery confirmation requirements
 * - Escalation workflows
 *
 * **Real-time Updates** (Socket.io):
 * - Event: `message:received` for new messages
 * - Event: `message:read` for read receipts
 * - Live inbox updates
 * - Notification delivery status
 *
 * **TanStack Query Integration**:
 * - Query key: `['messages', 'inbox', filters]`
 * - Cache invalidation on send/receive
 * - Optimistic updates for instant UI
 * - Background refetching
 *
 * @example
 * ```typescript
 * // Send urgent message to nurse
 * const message = await messagesApi.create({
 *   subject: 'Student Needs Immediate Attention',
 *   body: 'Student experiencing severe allergic reaction symptoms. Please come to classroom 305 immediately.',
 *   recipientId: nurseUserId,
 *   priority: 'URGENT'
 * });
 *
 * // Get inbox with unread messages
 * const inbox = await messagesApi.getInbox({
 *   page: 1,
 *   limit: 20,
 *   unreadOnly: true
 * });
 *
 * // Reply to message
 * const reply = await messagesApi.reply(originalMessageId, {
 *   body: 'On my way to classroom 305. ETA 2 minutes.'
 * });
 *
 * // Use with TanStack Query
 * const { data, isLoading } = useQuery({
 *   queryKey: ['messages', 'inbox'],
 *   queryFn: () => messagesApi.getInbox(),
 *   refetchInterval: 30000 // Poll every 30 seconds
 * });
 * ```
 *
 * @see {@link CommunicationsApi} for the unified communications API (recommended)
 * @see {@link notificationsApi} for system notifications
 * @deprecated Use {@link CommunicationsApi} for new implementations
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
      '/api/v1/communications/messages',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get message by ID
   */
  async getById(messageId: string): Promise<Message> {
    const response = await this.client.get<ApiResponse<Message>>(
      `/api/v1/communications/messages/${messageId}`
    );
    return response.data.data!;
  }

  /**
   * Create new message
   */
  async create(messageData: CreateMessageRequest): Promise<Message> {
    const response = await this.client.post<ApiResponse<Message>>(
      '/api/v1/communications/messages',
      messageData
    );
    return response.data.data!;
  }

  /**
   * Update message
   */
  async update(messageId: string, messageData: UpdateMessageRequest): Promise<Message> {
    const response = await this.client.put<ApiResponse<Message>>(
      `/api/v1/communications/messages/${messageId}`,
      messageData
    );
    return response.data.data!;
  }

  /**
   * Delete message
   */
  async delete(messageId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/api/v1/communications/messages/${messageId}`
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
      `/api/v1/communications/messages/${messageId}/reply`,
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
      '/api/v1/communications/messages/inbox',
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
      '/api/v1/communications/messages/sent',
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
      '/api/v1/communications/templates',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create message template
   */
  async createTemplate(templateData: CreateTemplateRequest): Promise<MessageTemplate> {
    const response = await this.client.post<ApiResponse<MessageTemplate>>(
      '/api/v1/communications/templates',
      templateData
    );
    return response.data.data!;
  }

  /**
   * Get delivery status
   */
  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    const response = await this.client.get<ApiResponse<DeliveryStatus>>(
      `/api/v1/communications/delivery-status/${messageId}`
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
      '/api/v1/communications/statistics',
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
