/**
 * @fileoverview Communications API Service - Unified communications management
 * @module services/modules/communicationsApi
 * @version 2.0.0 - Consolidated Edition
 * @category Services
 *
 * Comprehensive communications API providing unified access to broadcasts, direct
 * messaging, templates, and delivery tracking. Consolidates all communication
 * channels (email, SMS, push notifications) into a single cohesive service.
 *
 * **Consolidated Service** - Replaces:
 * - communicationApi.ts (deprecated - incorrect endpoints)
 * - messagesApi.ts (deprecated - partial implementation)
 * - broadcastsApi.ts (deprecated - partial implementation)
 *
 * ## Key Features
 *
 * **Broadcast Management** (10 methods):
 * - Create and send mass communications to targeted groups
 * - Schedule broadcasts for future delivery
 * - Track delivery status and engagement metrics
 * - Cancel scheduled broadcasts
 * - Duplicate existing broadcasts
 *
 * **Direct Messaging** (12 methods):
 * - Send direct messages between users
 * - Manage inbox and sent messages
 * - Thread support with parent message tracking
 * - File attachments with secure storage
 * - Read/unread status management
 *
 * **Message Templates** (7 methods):
 * - Pre-defined templates for common communications
 * - Variable substitution support
 * - Category-based organization (appointment, medication, incident, etc.)
 * - Template usage tracking
 *
 * **Delivery Tracking** (2 methods):
 * - Real-time delivery status monitoring
 * - Multi-channel delivery confirmation
 * - Retry and failure tracking
 *
 * **Multi-channel Support**:
 * - Email: SendGrid/AWS SES integration
 * - SMS: Twilio integration
 * - Push: Firebase Cloud Messaging
 * - Parallel delivery across all channels
 *
 * ## Healthcare-Specific Features
 *
 * **Emergency Communications**:
 * - Priority-based delivery (LOW, NORMAL, HIGH, URGENT)
 * - Multi-channel escalation for critical messages
 * - Emergency contact notification workflows
 * - Delivery confirmation requirements
 *
 * **PHI Compliance**:
 * - HIPAA-compliant message handling
 * - Secure message storage with encryption
 * - Audit logging for all communications
 * - Access control and RBAC enforcement
 * - No PHI in notification previews
 *
 * **Real-time Notifications** (Socket.io):
 * - Event: `message:received` for new messages
 * - Event: `broadcast:sent` for broadcast completion
 * - Event: `notification:delivered` for delivery confirmations
 * - Live inbox updates
 * - Real-time delivery status
 *
 * **TanStack Query Integration**:
 * - Query keys: `['communications', type, filters]`
 * - Cache invalidation on message send/receive
 * - Optimistic updates for instant UI feedback
 * - Background refetching for inbox
 *
 * **Security & Audit**:
 * - Role-based message access
 * - Message encryption at rest
 * - Audit logging for compliance
 * - Delivery tracking for accountability
 * - Secure attachment handling
 *
 * ## API Coverage
 *
 * **Backend Endpoints**: 14 core endpoints
 * **Helper Methods**: 20+ convenience methods
 * **Total Public API**: 33 methods
 *
 * @example
 * ```typescript
 * // Emergency broadcast to all parents
 * const broadcast = await communicationsApi.createBroadcast({
 *   subject: 'School Closure - Weather Emergency',
 *   body: 'School is closed today due to severe weather. All after-school activities cancelled.',
 *   channel: 'ALL', // Email + SMS + Push
 *   recipientType: 'ALL_PARENTS'
 * });
 * await communicationsApi.sendBroadcast(broadcast.id);
 *
 * // Send urgent direct message to nurse
 * const message = await communicationsApi.sendMessage({
 *   subject: 'Student Medication Needed',
 *   body: 'Student John Doe needs inhaler administration - see health record for details',
 *   recipientId: nurseUserId,
 *   priority: 'URGENT'
 * });
 *
 * // Get inbox with real-time updates
 * const { data: inbox } = useQuery({
 *   queryKey: ['communications', 'inbox'],
 *   queryFn: () => communicationsApi.getInbox(),
 *   refetchInterval: 30000 // Poll every 30 seconds
 * });
 * ```
 *
 * @see {@link messagesApi} for legacy message-specific operations
 * @see {@link notificationsApi} for system notifications
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
   * @endpoint GET /communications/broadcasts
   */
  async getBroadcasts(filters?: BroadcastFilters): Promise<PaginatedResponse<Broadcast>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<Broadcast>>(
        `/communications/broadcasts${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch broadcasts');
    }
  }

  /**
   * Get single broadcast by ID
   * @endpoint GET /communications/broadcasts/{id}
   */
  async getBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.get<ApiResponse<Broadcast>>(
        `/communications/broadcasts/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch broadcast');
    }
  }

  /**
   * Create new broadcast
   * @endpoint POST /communications/broadcasts
   */
  async createBroadcast(data: CreateBroadcastRequest): Promise<Broadcast> {
    try {
      broadcastSchema.parse(data);
      const response = await this.client.post<ApiResponse<Broadcast>>(
        '/communications/broadcasts',
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
   * @endpoint PUT /communications/broadcasts/{id}
   */
  async updateBroadcast(id: string, data: UpdateBroadcastRequest): Promise<Broadcast> {
    try {
      const response = await this.client.put<ApiResponse<Broadcast>>(
        `/communications/broadcasts/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update broadcast');
    }
  }

  /**
   * Delete broadcast
   * @endpoint DELETE /communications/broadcasts/{id}
   * @NEW Added in consolidated version
   */
  async deleteBroadcast(id: string): Promise<void> {
    try {
      await this.client.delete(`/communications/broadcasts/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete broadcast');
    }
  }

  /**
   * Send broadcast immediately with multi-channel delivery and tracking
   *
   * Triggers immediate broadcast delivery to all recipients across configured
   * channels (email, SMS, push). Validates broadcast status and recipient count.
   *
   * @param {string} id - Broadcast UUID to send
   * @returns {Promise<Broadcast>} Broadcast with updated SENDING/SENT status
   * @throws {ValidationError} Broadcast not in DRAFT or SCHEDULED status
   * @throws {NotFoundError} Broadcast not found
   * @throws {ForbiddenError} User lacks permission to send broadcasts
   *
   * @remarks
   * **Delivery Process**:
   * - Status change: DRAFT/SCHEDULED → SENDING → SENT
   * - Recipient resolution: Expands recipient filters to individual users
   * - Channel delivery: Sends via email, SMS, push in parallel
   * - Progress tracking: Updates deliveredCount in real-time
   * - Error handling: Tracks failed deliveries for retry
   *
   * **Multi-channel Delivery**:
   * - Email: SendGrid/AWS SES with HTML templates
   * - SMS: Twilio with character limit handling (160 chars)
   * - Push: Firebase Cloud Messaging for mobile apps
   * - Delivery priority: Parallel sending for speed
   * - Success criteria: At least one channel delivers successfully
   *
   * **Emergency Escalation**:
   * - URGENT broadcasts: Delivery within 2 minutes
   * - Multi-retry: Up to 3 attempts per recipient
   * - Escalation: Failed deliveries escalated to admin after 5 minutes
   * - Backup channels: Falls back to alternate contact methods
   *
   * **Real-time Notifications**:
   * - Socket.io event: `broadcast:sent` when complete
   * - Event payload: `{ broadcastId, recipientCount, deliveredCount }`
   * - Progress events: `broadcast:progress` during delivery
   * - Query invalidation: Invalidates broadcast list and detail queries
   *
   * **Delivery Tracking**:
   * - Individual recipient status tracked in database
   * - Open/click tracking for email broadcasts
   * - Delivery confirmation for SMS
   * - Read receipts for push notifications
   * - Comprehensive delivery report available after completion
   *
   * @example
   * ```typescript
   * // Send emergency school closure broadcast
   * const broadcast = await communicationsApi.createBroadcast({
   *   subject: 'URGENT: School Closure',
   *   body: 'School closed today due to weather emergency. All activities cancelled.',
   *   channel: 'ALL',
   *   recipientType: 'ALL_PARENTS'
   * });
   *
   * // Send immediately
   * const sentBroadcast = await communicationsApi.sendBroadcast(broadcast.id);
   * console.log(`Sending to ${sentBroadcast.totalRecipients} recipients`);
   *
   * // Monitor delivery progress with real-time updates
   * socket.on('broadcast:progress', (progress) => {
   *   console.log(`Delivered: ${progress.deliveredCount}/${progress.totalRecipients}`);
   * });
   *
   * socket.on('broadcast:sent', (result) => {
   *   console.log(`Broadcast complete: ${result.deliveredCount} delivered, ${result.failedCount} failed`);
   * });
   *
   * // Use with TanStack Query mutation
   * const { mutate: sendBroadcast } = useMutation({
   *   mutationFn: (id: string) => communicationsApi.sendBroadcast(id),
   *   onSuccess: (broadcast) => {
   *     queryClient.invalidateQueries(['communications', 'broadcasts']);
   *     toast.success(`Sending broadcast to ${broadcast.totalRecipients} recipients`);
   *   }
   * });
   * ```
   *
   * @see {@link createBroadcast} to create broadcast before sending
   * @see {@link scheduleBroadcast} to schedule for later delivery
   * @see {@link getBroadcastDeliveryReport} to view detailed delivery metrics
   * @see {@link cancelBroadcast} to cancel before/during sending
   *
   * @endpoint POST /communications/broadcasts/{id}/send
   */
  async sendBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.post<ApiResponse<Broadcast>>(
        `/communications/broadcasts/{id}/send`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to send broadcast');
    }
  }

  /**
   * Cancel broadcast
   * @endpoint POST /communications/broadcasts/{id}/cancel
   */
  async cancelBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.post<ApiResponse<Broadcast>>(
        `/communications/broadcasts/${id}/cancel`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to cancel broadcast');
    }
  }

  /**
   * Get broadcast recipients
   * @endpoint GET /communications/broadcasts/{id}/recipients
   */
  async getBroadcastRecipients(id: string, page?: number, limit?: number): Promise<PaginatedResponse<BroadcastRecipient>> {
    try {
      const params = buildUrlParams({ page, limit });
      const response = await this.client.get<PaginatedResponse<BroadcastRecipient>>(
        `/communications/broadcasts/${id}/recipients?${params}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch broadcast recipients');
    }
  }

  /**
   * Get broadcast delivery report
   * @endpoint GET /communications/broadcasts/{id}/delivery-report
   */
  async getBroadcastDeliveryReport(id: string): Promise<BroadcastDeliveryReport> {
    try {
      const response = await this.client.get<ApiResponse<BroadcastDeliveryReport>>(
        `/communications/broadcasts/${id}/delivery-report`
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
   * @NEW Added in consolidated version
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
   * @NEW Added in consolidated version
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
   * @endpoint GET /communications/templates
   */
  async getTemplates(filters?: TemplateFilters): Promise<PaginatedResponse<MessageTemplate>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await this.client.get<PaginatedResponse<MessageTemplate>>(
        `/communications/templates${params ? `?${params}` : ''}`
      );
      return response.data;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch templates');
    }
  }

  /**
   * Get single template by ID
   * @endpoint GET /communications/templates/{id}
   * @NEW Added in consolidated version
   */
  async getTemplate(id: string): Promise<MessageTemplate> {
    try {
      const response = await this.client.get<ApiResponse<MessageTemplate>>(
        `/communications/templates/${id}`
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to fetch template');
    }
  }

  /**
   * Create message template
   * @endpoint POST /communications/templates
   */
  async createTemplate(data: CreateTemplateRequest): Promise<MessageTemplate> {
    try {
      templateSchema.parse(data);
      const response = await this.client.post<ApiResponse<MessageTemplate>>(
        '/communications/templates',
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
   * @endpoint PUT /communications/templates/{id}
   * @NEW Added in consolidated version
   */
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<MessageTemplate> {
    try {
      const response = await this.client.put<ApiResponse<MessageTemplate>>(
        `/communications/templates/${id}`,
        data
      );
      return response.data.data!;
    } catch (error) {
      throw createApiError(error, 'Failed to update template');
    }
  }

  /**
   * Delete message template
   * @endpoint DELETE /communications/templates/{id}
   * @NEW Added in consolidated version
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await this.client.delete(`/communications/templates/${id}`);
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
   * @endpoint GET /communications/delivery-status/{messageId}
   */
  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    try {
      const response = await this.client.get<ApiResponse<DeliveryStatus>>(
        `/communications/delivery-status/${messageId}`
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
   * @endpoint GET /communications/scheduled
   */
  async getScheduled(type?: 'BROADCAST' | 'MESSAGE'): Promise<ScheduledCommunication[]> {
    try {
      const params = type ? `?type=${type}` : '';
      const response = await this.client.get<ApiResponse<ScheduledCommunication[]>>(
        `/communications/scheduled${params}`
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
   * @endpoint GET /communications/statistics
   */
  async getStatistics(startDate?: string, endDate?: string): Promise<CommunicationStatistics> {
    try {
      const params = buildUrlParams({ startDate, endDate });
      const response = await this.client.get<ApiResponse<CommunicationStatistics>>(
        `/communications/statistics?${params}`
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
