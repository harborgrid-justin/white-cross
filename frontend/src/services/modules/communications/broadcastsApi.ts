/**
 * @fileoverview Broadcasts API Service - Mass communication management
 * @module services/modules/communications/broadcastsApi
 * @version 2.0.0
 * @category Services
 *
 * Provides comprehensive broadcast management for mass communications to targeted
 * groups. Supports email, SMS, and push notifications with delivery tracking,
 * scheduling, and multi-channel delivery.
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
 * **Multi-channel Support**:
 * - Email: SendGrid/AWS SES integration
 * - SMS: Twilio integration
 * - Push: Firebase Cloud Messaging
 * - Parallel delivery across all channels
 *
 * @example
 * ```typescript
 * // Emergency broadcast to all parents
 * const broadcast = await broadcastsApi.createBroadcast({
 *   subject: 'School Closure - Weather Emergency',
 *   body: 'School is closed today due to severe weather.',
 *   channel: 'ALL',
 *   recipientType: 'ALL_PARENTS'
 * });
 * await broadcastsApi.sendBroadcast(broadcast.id);
 * ```
 */

import type { ApiClient, ApiResponse, PaginatedResponse } from '../../core/ApiClient';
import { buildUrlParams } from '../../utils/apiUtils';
import { z } from 'zod';
import { createApiError, createValidationError } from '../../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

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

export interface BroadcastFilters extends Record<string, unknown> {
  status?: BroadcastStatus;
  channel?: BroadcastChannel;
  page?: number;
  limit?: number;
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

// ==========================================
// BROADCASTS API SERVICE
// ==========================================

/**
 * Broadcasts API Service
 *
 * Provides comprehensive broadcast management including creation, scheduling,
 * sending, tracking, and delivery reporting.
 */
export class BroadcastsApi {
  constructor(private readonly client: ApiClient) {}

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
   */
  async deleteBroadcast(id: string): Promise<void> {
    try {
      await this.client.delete(`/communications/broadcasts/${id}`);
    } catch (error) {
      throw createApiError(error, 'Failed to delete broadcast');
    }
  }

  /**
   * Send broadcast immediately
   * @endpoint POST /communications/broadcasts/{id}/send
   */
  async sendBroadcast(id: string): Promise<Broadcast> {
    try {
      const response = await this.client.post<ApiResponse<Broadcast>>(
        `/communications/broadcasts/${id}/send`
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
    return this.updateBroadcast(id, { scheduledFor });
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
}

/**
 * Factory function to create Broadcasts API instance
 */
export function createBroadcastsApi(client: ApiClient): BroadcastsApi {
  return new BroadcastsApi(client);
}
