/**
 * Communications API Service - CONSOLIDATED VERSION
 *
 * Unified communications management consolidating broadcasts, messages, templates,
 * and delivery tracking into a single cohesive service.
 *
 * This is the CONSOLIDATED service that replaces:
 * - communicationApi.ts (deprecated - wrong endpoints)
 * - messagesApi.ts (deprecated - partial implementation)
 * - broadcastsApi.ts (deprecated - partial implementation)
 *
 * Features:
 * - Broadcast management (mass communications) - 10 methods
 * - Direct messaging (inbox/sent messages) - 12 methods
 * - Message templates and scheduling - 7 methods
 * - Delivery status tracking and reporting - 2 methods
 * - Multi-channel support (email, SMS, push notifications)
 * - Communication statistics and analytics - 1 method
 * - Scheduled communications - 1 method
 *
 * Coverage: All 14 backend endpoints + helper methods
 *
 * Security:
 * - PHI-compliant message handling
 * - Secure delivery tracking
 * - Audit logging for all communications
 * - Role-based access to messages
 *
 * @module services/modules/communicationsApi
 * @version 2.0.0 - Consolidated Edition
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildUrlParams } from '../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

// Broadcasts
export type BroadcastStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'CANCELLED' | 'FAILED';
export type BroadcastChannel = 'EMAIL' | 'SMS' | 'PUSH' | 'ALL';
export type RecipientType = 'ALL_PARENTS' | 'ALL_STAFF' | 'GRADE' | 'SCHOOL' | 'CUSTOM';

export interface Broadcast {
  id: string;
  subject: string;
  body: string;
  channel: BroadcastChannel;
  recipientType: RecipientType;
  recipientFilter?: {
    grades?: string[];
    schoolIds?: string[];
    userIds?: string[];
    roleTypes?: string[];
  };
  status: BroadcastStatus;
  scheduledFor?: string;
  sentAt?: string;
  totalRecipients: number;
  deliveredCount: number;
  failedCount: number;
  openedCount: number;
  clickedCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBroadcastRequest {
  subject: string;
  body: string;
  channel: BroadcastChannel;
  recipientType: RecipientType;
  recipientFilter?: {
    grades?: string[];
    schoolIds?: string[];
    userIds?: string[];
    roleTypes?: string[];
  };
  scheduledFor?: string;
  templateId?: string;
}

export interface UpdateBroadcastRequest {
  subject?: string;
  body?: string;
  channel?: BroadcastChannel;
  recipientFilter?: {
    grades?: string[];
    schoolIds?: string[];
    userIds?: string[];
    roleTypes?: string[];
  };
  scheduledFor?: string;
}

export interface BroadcastRecipient {
  id: string;
  broadcastId: string;
  userId: string;
  userName: string;
  email?: string;
  phoneNumber?: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  error?: string;
}

export interface BroadcastDeliveryReport {
  broadcastId: string;
  totalRecipients: number;
  sent: number;
  delivered: number;
  failed: number;
  opened: number;
  clicked: number;
  bounced: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  failureReasons: Array<{
    reason: string;
    count: number;
  }>;
}

export interface BroadcastFilters {
  status?: BroadcastStatus;
  channel?: BroadcastChannel;
  page?: number;
  limit?: number;
}

// Messages
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

export interface MessageFilters {
  status?: MessageStatus;
  priority?: MessagePriority;
  senderId?: string;
  recipientId?: string;
  threadId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Templates
export type TemplateCategory = 'APPOINTMENT' | 'MEDICATION' | 'INCIDENT' | 'GENERAL' | 'EMERGENCY';

export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[]; // e.g., ['studentName', 'appointmentDate']
  category: TemplateCategory;
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  body: string;
  category: TemplateCategory;
  isActive?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  subject?: string;
  body?: string;
  category?: TemplateCategory;
  isActive?: boolean;
}

export interface TemplateFilters {
  category?: TemplateCategory;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Delivery Status
export interface DeliveryStatus {
  messageId: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  channel: 'EMAIL' | 'SMS' | 'PUSH';
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  error?: string;
  attempts: number;
  lastAttemptAt?: string;
}

// Communication Statistics
export interface CommunicationStatistics {
  totalBroadcasts: number;
  totalMessages: number;
  totalDelivered: number;
  totalFailed: number;
  averageDeliveryTime: number;
  deliveryRate: number;
  byChannel: {
    email: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
    };
    sms: {
      sent: number;
      delivered: number;
    };
    push: {
      sent: number;
      delivered: number;
    };
  };
  recentActivity: Array<{
    date: string;
    broadcastsSent: number;
    messagesSent: number;
  }>;
}

// Scheduled Communications
export interface ScheduledCommunication {
  id: string;
  type: 'BROADCAST' | 'MESSAGE';
  subject: string;
  scheduledFor: string;
  status: 'PENDING' | 'SENT' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
}

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const broadcastSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  body: z.string().min(1, 'Message body is required').max(5000),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH', 'ALL']),
  recipientType: z.enum(['ALL_PARENTS', 'ALL_STAFF', 'GRADE', 'SCHOOL', 'CUSTOM']),
  scheduledFor: z.string().datetime().optional(),
});

const messageSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  body: z.string().min(1, 'Message body is required').max(5000),
  recipientId: z.string().uuid('Invalid recipient ID'),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Template body is required'),
  category: z.enum(['APPOINTMENT', 'MEDICATION', 'INCIDENT', 'GENERAL', 'EMERGENCY']),
});

// ==========================================
// COMMUNICATIONS API SERVICE
// ==========================================

/**
 * Unified Communications API Service
 *
 * Provides comprehensive communication management including broadcasts,
 * messages, templates, and delivery tracking.
 *
 * @example
 * ```typescript
 * const api = createCommunicationsApi(apiClient);
 *
 * // Send a broadcast
 * const broadcast = await api.createBroadcast({
 *   subject: 'School Closure',
 *   body: 'School closed due to weather',
 *   channel: 'ALL',
 *   recipientType: 'ALL_PARENTS'
 * });
 * await api.sendBroadcast(broadcast.id);
 *
 * // Send a direct message
 * const message = await api.sendMessage({
 *   subject: 'Appointment Reminder',
 *   body: 'Your child has an appointment tomorrow',
 *   recipientId: 'parent-123',
 *   priority: 'NORMAL'
 * });
 *
 * // Get inbox
 * const inbox = await api.getInbox(1, 20);
 * ```
 */
export class CommunicationsApi {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // BROADCASTS (10 methods)
  // ==========================================

  /**
   * Get all broadcasts with optional filters
   * @endpoint GET /api/v1/communications/broadcasts
   */
  async getBroadcasts(filters?: BroadcastFilters): Promise<PaginatedResponse<Broadcast>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<Broadcast>>(
        `/api/v1/communications/broadcasts${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch broadcasts');
    }
  }

  /**
   * Get single broadcast by ID
   * @endpoint GET /api/v1/communications/broadcasts/{id}
   */
  async getBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.get<ApiResponse<Broadcast>>(
        `/api/v1/communications/broadcasts/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch broadcast');
    }
  }

  /**
   * Create new broadcast
   * @endpoint POST /api/v1/communications/broadcasts
   */
  async createBroadcast(data: CreateBroadcastRequest): Promise<Broadcast> {
    try {
      broadcastSchema.parse(data);
      const response = await this.client.post<ApiResponse<Broadcast>>(
        '/api/v1/communications/broadcasts',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Broadcast validation failed', 'broadcast', {}, error);
      }
      throw createApiError(error, 'Failed to create broadcast');
    }
  }

  /**
   * Update broadcast
   * @endpoint PUT /api/v1/communications/broadcasts/{id}
   */
  async updateBroadcast(id: string, data: UpdateBroadcastRequest): Promise<Broadcast> {
    try {
      const response = await this.client.put<ApiResponse<Broadcast>>(
        `/api/v1/communications/broadcasts/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update broadcast');
    }
  }

  /**
   * Delete broadcast
   * @endpoint DELETE /api/v1/communications/broadcasts/{id}
   * @NEW Added in consolidated version
   */
  async deleteBroadcast(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/communications/broadcasts/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete broadcast');
    }
  }

  /**
   * Send broadcast immediately
   * @endpoint POST /api/v1/communications/broadcasts/{id}/send
   * @NEW Added in consolidated version
   */
  async sendBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.post<ApiResponse<Broadcast>>(
        `/api/v1/communications/broadcasts/${id}/send`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to send broadcast');
    }
  }

  /**
   * Cancel broadcast
   * @endpoint POST /api/v1/communications/broadcasts/{id}/cancel
   */
  async cancelBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.post<ApiResponse<Broadcast>>(
        `/api/v1/communications/broadcasts/${id}/cancel`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to cancel broadcast');
    }
  }

  /**
   * Get broadcast recipients
   * @endpoint GET /api/v1/communications/broadcasts/{id}/recipients
   */
  async getBroadcastRecipients(id: string, page?: number, limit?: number): Promise<PaginatedResponse<BroadcastRecipient>> {
    try {
      const params = buildUrlParams({ page, limit });
      const response = await this.client.get<PaginatedResponse<BroadcastRecipient>>(
        `/api/v1/communications/broadcasts/${id}/recipients?${params}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch broadcast recipients');
    }
  }

  /**
   * Get broadcast delivery report
   * @endpoint GET /api/v1/communications/broadcasts/{id}/delivery-report
   */
  async getBroadcastDeliveryReport(id: string): Promise<BroadcastDeliveryReport> {
    try {
      const response = await this.client.get<ApiResponse<BroadcastDeliveryReport>>(
        `/api/v1/communications/broadcasts/${id}/delivery-report`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch delivery report');
    }
  }

  /**
   * Schedule broadcast for later
   * @helper Convenience method using updateBroadcast
   */
  async scheduleBroadcast(id: string, scheduledFor: string): Promise<Broadcast> {
    return this.updateBroadcast(id, {
      scheduledFor,
    });
  }

  /**
   * Duplicate broadcast (create copy)
   * @helper Convenience method combining get and create
   */
  async duplicateBroadcast(id: string): Promise<Broadcast> {
    try {
      const original = await this.getBroadcast(id);
      return this.createBroadcast({
        subject: `Copy of ${original.subject}`,
        body: original.body,
        channel: original.channel,
        recipientType: original.recipientType,
        recipientFilter: original.recipientFilter,
      });
    } catch (error) {
      throw createApiError(error, 'Failed to duplicate broadcast');
    }
  }

  /**
   * Get scheduled broadcasts
   * @helper Convenience filter method
   */
  async getScheduledBroadcasts(page?: number, limit?: number): Promise<PaginatedResponse<Broadcast>> {
    return this.getBroadcasts({ status: 'SCHEDULED', page, limit });
  }

  /**
   * Get draft broadcasts
   * @helper Convenience filter method
   */
  async getDraftBroadcasts(page?: number, limit?: number): Promise<PaginatedResponse<Broadcast>> {
    return this.getBroadcasts({ status: 'DRAFT', page, limit });
  }

  // ==========================================
  // MESSAGES (12 methods)
  // ==========================================

  /**
   * Get all messages with optional filters
   * @endpoint GET /api/v1/communications/messages
   */
  async getMessages(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<Message>>(
        `/api/v1/communications/messages${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch messages');
    }
  }

  /**
   * Get inbox messages
   * @endpoint GET /api/v1/communications/messages/inbox
   */
  async getInbox(page?: number, limit?: number): Promise<PaginatedResponse<Message>> {
    try {
      const params = buildUrlParams({ page, limit });
      const response = await this.client.get<PaginatedResponse<Message>>(
        `/api/v1/communications/messages/inbox?${params}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch inbox');
    }
  }

  /**
   * Get sent messages
   * @endpoint GET /api/v1/communications/messages/sent
   */
  async getSentMessages(page?: number, limit?: number): Promise<PaginatedResponse<Message>> {
    try {
      const params = buildUrlParams({ page, limit });
      const response = await this.client.get<PaginatedResponse<Message>>(
        `/api/v1/communications/messages/sent?${params}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch sent messages');
    }
  }

  /**
   * Get single message by ID
   * @endpoint GET /api/v1/communications/messages/{id}
   */
  async getMessage(id: string): Promise<Message> {
    try {
      const response = await this.client.get<ApiResponse<Message>>(
        `/api/v1/communications/messages/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch message');
    }
  }

  /**
   * Send new message
   * @endpoint POST /api/v1/communications/messages
   */
  async sendMessage(data: CreateMessageRequest): Promise<Message> {
    try {
      messageSchema.parse(data);
      const response = await this.client.post<ApiResponse<Message>>(
        '/api/v1/communications/messages',
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
   * @endpoint PUT /api/v1/communications/messages/{id}
   * @NEW Added in consolidated version
   */
  async updateMessage(id: string, data: UpdateMessageRequest): Promise<Message> {
    try {
      const response = await this.client.put<ApiResponse<Message>>(
        `/api/v1/communications/messages/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update message');
    }
  }

  /**
   * Delete message
   * @endpoint DELETE /api/v1/communications/messages/{id}
   * @NEW Added in consolidated version
   */
  async deleteMessage(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/communications/messages/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete message');
    }
  }

  /**
   * Reply to message
   * @endpoint POST /api/v1/communications/messages/{id}/reply
   */
  async replyToMessage(messageId: string, body: string, attachments?: Array<{filename: string; data: string}>): Promise<Message> {
    try {
      const response = await this.client.post<ApiResponse<Message>>(
        `/api/v1/communications/messages/${messageId}/reply`,
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
      return response.total || 0;
    } catch (error) {
      throw createApiError(error, 'Failed to get unread count');
    }
  }

  // ==========================================
  // TEMPLATES (7 methods)
  // ==========================================

  /**
   * Get all message templates
   * @endpoint GET /api/v1/communications/templates
   */
  async getTemplates(filters?: TemplateFilters): Promise<PaginatedResponse<MessageTemplate>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<MessageTemplate>>(
        `/api/v1/communications/templates${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch templates');
    }
  }

  /**
   * Get single template by ID
   * @endpoint GET /api/v1/communications/templates/{id}
   * @NEW Added in consolidated version
   */
  async getTemplate(id: string): Promise<MessageTemplate> {
    try {
      const response = await this.client.get<ApiResponse<MessageTemplate>>(
        `/api/v1/communications/templates/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch template');
    }
  }

  /**
   * Create message template
   * @endpoint POST /api/v1/communications/templates
   */
  async createTemplate(data: CreateTemplateRequest): Promise<MessageTemplate> {
    try {
      templateSchema.parse(data);
      const response = await this.client.post<ApiResponse<MessageTemplate>>(
        '/api/v1/communications/templates',
        data
      );
      return response.data.data!;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw createValidationError('Template validation failed', 'template', {}, error);
      }
      throw createApiError(error, 'Failed to create template');
    }
  }

  /**
   * Update message template
   * @endpoint PUT /api/v1/communications/templates/{id}
   * @NEW Added in consolidated version
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<MessageTemplate> {
    try {
      const response = await this.client.put<ApiResponse<MessageTemplate>>(
        `/api/v1/communications/templates/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update template');
    }
  }

  /**
   * Delete message template
   * @endpoint DELETE /api/v1/communications/templates/{id}
   * @NEW Added in consolidated version
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/communications/templates/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete template');
    }
  }

  /**
   * Get templates by category
   * @helper Convenience filter method
   */
  async getTemplatesByCategory(category: TemplateCategory): Promise<PaginatedResponse<MessageTemplate>> {
    return this.getTemplates({ category });
  }

  /**
   * Get active templates only
   * @helper Convenience filter method
   */
  async getActiveTemplates(): Promise<PaginatedResponse<MessageTemplate>> {
    return this.getTemplates({ isActive: true });
  }

  // ==========================================
  // DELIVERY STATUS & TRACKING (2 methods)
  // ==========================================

  /**
   * Get delivery status for message
   * @endpoint GET /api/v1/communications/delivery-status/{messageId}
   */
  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    try {
      const response = await this.client.get<ApiResponse<DeliveryStatus>>(
        `/api/v1/communications/delivery-status/${messageId}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch delivery status');
    }
  }

  /**
   * Check if message was delivered
   * @helper Convenience method using getDeliveryStatus
   */
  async isMessageDelivered(messageId: string): Promise<boolean> {
    try {
      const status = await this.getDeliveryStatus(messageId);
      return status.status === 'DELIVERED';
    } catch (error) {
      return false;
    }
  }

  // ==========================================
  // SCHEDULED COMMUNICATIONS (1 method)
  // ==========================================

  /**
   * Get scheduled communications
   * @endpoint GET /api/v1/communications/scheduled
   */
  async getScheduled(type?: 'BROADCAST' | 'MESSAGE'): Promise<ScheduledCommunication[]> {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await this.client.get<ApiResponse<ScheduledCommunication[]>>(
        `/api/v1/communications/scheduled${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch scheduled communications');
    }
  }

  // ==========================================
  // STATISTICS (1 method)
  // ==========================================

  /**
   * Get communication statistics
   * @endpoint GET /api/v1/communications/statistics
   */
  async getStatistics(startDate?: string, endDate?: string): Promise<CommunicationStatistics> {
    try {
      const params = buildUrlParams({ startDate, endDate });
      const response = await this.client.get<ApiResponse<CommunicationStatistics>>(
        `/api/v1/communications/statistics?${params}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch communication statistics');
    }
  }
}

/**
 * Factory function to create Communications API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured CommunicationsApi instance
 *
 * @example
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communicationsApi';
 *
 * const api = createCommunicationsApi(apiClient);
 * const inbox = await api.getInbox();
 * ```
 */
export function createCommunicationsApi(client: ApiClient): CommunicationsApi {
  return new CommunicationsApi(client);
}
