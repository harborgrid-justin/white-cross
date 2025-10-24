/**
 * Communications API Service
 *
 * Unified communications management consolidating broadcasts, messages, templates,
 * and delivery tracking into a single cohesive service.
 *
 * Features:
 * - Broadcast management (mass communications)
 * - Direct messaging (inbox/sent messages)
 * - Message templates and scheduling
 * - Delivery status tracking and reporting
 * - Multi-channel support (email, SMS, push notifications)
 * - Communication statistics and analytics
 *
 * Security:
 * - PHI-compliant message handling
 * - Secure delivery tracking
 * - Audit logging for all communications
 * - Role-based access to messages
 *
 * @module services/modules/communicationsApi
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
export interface MessageTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[]; // e.g., ['studentName', 'appointmentDate']
  category: 'APPOINTMENT' | 'MEDICATION' | 'INCIDENT' | 'GENERAL' | 'EMERGENCY';
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
  category: MessageTemplate['category'];
  isActive?: boolean;
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

export class CommunicationsApi {
  constructor(private readonly client: ApiClient) {}

  // ==========================================
  // BROADCASTS
  // ==========================================

  /**
   * Get all broadcasts with filters
   */
  async getBroadcasts(filters?: {
    status?: BroadcastStatus;
    channel?: BroadcastChannel;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Broadcast>> {
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
   * Cancel broadcast
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

  // ==========================================
  // MESSAGES
  // ==========================================

  /**
   * Get all messages with filters
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
   * Reply to message
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
   */
  async markAsRead(id: string): Promise<Message> {
    try {
      const response = await this.client.put<ApiResponse<Message>>(
        `/api/v1/communications/messages/${id}`,
        { status: 'READ' }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to mark message as read');
    }
  }

  /**
   * Archive message
   */
  async archiveMessage(id: string): Promise<Message> {
    try {
      const response = await this.client.put<ApiResponse<Message>>(
        `/api/v1/communications/messages/${id}`,
        { status: 'ARCHIVED' }
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to archive message');
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/communications/messages/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete message');
    }
  }

  // ==========================================
  // TEMPLATES
  // ==========================================

  /**
   * Get all message templates
   */
  async getTemplates(category?: MessageTemplate['category']): Promise<MessageTemplate[]> {
    try {
      const params = category ? `?category=${category}` : '';
      const response = await this.client.get<ApiResponse<MessageTemplate[]>>(
        `/api/v1/communications/templates${params}`
      );
      return response.data.data || [];
    } catch (error) {
      throw createApiError(error, 'Failed to fetch templates');
    }
  }

  /**
   * Get single template by ID
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
   */
  async updateTemplate(id: string, data: Partial<CreateTemplateRequest>): Promise<MessageTemplate> {
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
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/communications/templates/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete template');
    }
  }

  // ==========================================
  // DELIVERY STATUS & TRACKING
  // ==========================================

  /**
   * Get delivery status for message
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

  // ==========================================
  // SCHEDULED COMMUNICATIONS
  // ==========================================

  /**
   * Get scheduled communications
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
  // STATISTICS
  // ==========================================

  /**
   * Get communication statistics
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
 */
export function createCommunicationsApi(client: ApiClient): CommunicationsApi {
  return new CommunicationsApi(client);
}
