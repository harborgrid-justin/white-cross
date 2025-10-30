/**
 * Broadcasts API Module
 * Provides frontend access to broadcast messaging endpoints
 */

import type { ApiClient } from '../core/ApiClient';
import { ApiResponse, PaginatedResponse, buildPaginationParams } from '../utils/apiUtils';

/**
 * Broadcasts API interfaces
 */
export interface Broadcast {
  id: string;
  subject: string;
  body: string;
  senderId: string;
  senderName?: string;
  targetAudience: 'ALL' | 'NURSES' | 'ADMINS' | 'PARENTS' | 'CUSTOM';
  recipientIds?: string[];
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  scheduledFor?: string;
  sentAt?: string;
  deliveryStats?: {
    total: number;
    delivered: number;
    failed: number;
    pending: number;
  };
  attachments?: Array<{
    id: string;
    filename: string;
    url: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBroadcastRequest {
  subject: string;
  body: string;
  targetAudience: 'ALL' | 'NURSES' | 'ADMINS' | 'PARENTS' | 'CUSTOM';
  recipientIds?: string[];
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  scheduledFor?: string;
  attachments?: string[];
}

export interface UpdateBroadcastRequest {
  subject?: string;
  body?: string;
  targetAudience?: 'ALL' | 'NURSES' | 'ADMINS' | 'PARENTS' | 'CUSTOM';
  recipientIds?: string[];
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  scheduledFor?: string;
  status?: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED';
}

export interface BroadcastDelivery {
  broadcastId: string;
  recipientId: string;
  recipientName?: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'BOUNCED';
  deliveredAt?: string;
  readAt?: string;
  failureReason?: string;
}

export interface BroadcastStatistics {
  totalBroadcasts: number;
  totalRecipients: number;
  averageDeliveryRate: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  recentBroadcasts: Array<{
    id: string;
    subject: string;
    sentAt: string;
    recipients: number;
  }>;
}

export interface BroadcastFilters {
  status?: string;
  priority?: string;
  targetAudience?: string;
  senderId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

/**
 * Broadcasts API Service
 * Handles all broadcast messaging related API calls
 */
export class BroadcastsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all broadcasts with filters
   */
  async getAll(filters?: BroadcastFilters): Promise<PaginatedResponse<Broadcast>> {
    const params = buildPaginationParams(filters?.page, filters?.limit);
    const allParams = filters ? Object.assign({}, params, filters) : params;
    const response = await this.client.get<PaginatedResponse<Broadcast>>(
      '/communications/broadcasts',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get broadcast by ID
   */
  async getById(broadcastId: string): Promise<Broadcast> {
    const response = await this.client.get<ApiResponse<Broadcast>>(
      `/communications/broadcasts/${broadcastId}`
    );
    return response.data.data!;
  }

  /**
   * Create new broadcast
   */
  async create(broadcastData: CreateBroadcastRequest): Promise<Broadcast> {
    const response = await this.client.post<ApiResponse<Broadcast>>(
      '/communications/broadcasts',
      broadcastData
    );
    return response.data.data!;
  }

  /**
   * Update broadcast
   */
  async update(broadcastId: string, broadcastData: UpdateBroadcastRequest): Promise<Broadcast> {
    const response = await this.client.put<ApiResponse<Broadcast>>(
      `/communications/broadcasts/${broadcastId}`,
      broadcastData
    );
    return response.data.data!;
  }

  /**
   * Delete broadcast
   */
  async delete(broadcastId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.client.delete<ApiResponse<{ success: boolean; message: string }>>(
      `/communications/broadcasts/${broadcastId}`
    );
    return response.data.data!;
  }

  /**
   * Send broadcast immediately
   */
  async send(broadcastId: string): Promise<Broadcast> {
    const response = await this.client.post<ApiResponse<Broadcast>>(
      `/communications/broadcasts/${broadcastId}/send`
    );
    return response.data.data!;
  }

  /**
   * Schedule broadcast
   */
  async schedule(broadcastId: string, scheduledFor: string): Promise<Broadcast> {
    return this.update(broadcastId, { 
      status: 'SCHEDULED',
      scheduledFor 
    });
  }

  /**
   * Cancel scheduled broadcast
   */
  async cancel(broadcastId: string): Promise<Broadcast> {
    return this.update(broadcastId, { status: 'DRAFT' });
  }

  /**
   * Get broadcast delivery details
   */
  async getDeliveryDetails(broadcastId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<BroadcastDelivery>> {
    const paginationParams = buildPaginationParams(params?.page, params?.limit);
    const response = await this.client.get<PaginatedResponse<BroadcastDelivery>>(
      `/communications/broadcasts/${broadcastId}/deliveries`,
      { params: paginationParams }
    );
    return response.data;
  }

  /**
   * Get broadcast statistics
   */
  async getStatistics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<BroadcastStatistics> {
    const response = await this.client.get<ApiResponse<BroadcastStatistics>>(
      '/communications/broadcasts/statistics',
      { params }
    );
    return response.data.data!;
  }

  /**
   * Get scheduled broadcasts
   */
  async getScheduled(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Broadcast>> {
    return this.getAll({ ...params, status: 'SCHEDULED' });
  }

  /**
   * Get draft broadcasts
   */
  async getDrafts(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Broadcast>> {
    return this.getAll({ ...params, status: 'DRAFT' });
  }

  /**
   * Duplicate broadcast
   */
  async duplicate(broadcastId: string): Promise<Broadcast> {
    const original = await this.getById(broadcastId);
    return this.create({
      subject: `Copy of ${original.subject}`,
      body: original.body,
      targetAudience: original.targetAudience,
      recipientIds: original.recipientIds,
      priority: original.priority,
      attachments: original.attachments?.map(a => a.id)
    });
  }
}

/**
 * Factory function to create Broadcasts API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured BroadcastsApi instance
 */
export function createBroadcastsApi(client: ApiClient): BroadcastsApi {
  return new BroadcastsApi(client);
}

// Export singleton instance
import { apiClient } from '../core/ApiClient'
export const broadcastsApi = createBroadcastsApi(apiClient)
