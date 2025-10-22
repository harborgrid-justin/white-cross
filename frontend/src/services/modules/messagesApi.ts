/**
 * Messages API Module
 * Provides frontend access to messaging and communications endpoints
 */

import { apiInstance } from '../config/apiConfig';
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
  /**
   * Get all messages with filters
   */
  async getAll(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    const params = buildPaginationParams(filters?.page, filters?.limit);
    const allParams = filters ? Object.assign({}, params, filters) : params;
    const response = await apiInstance.get<PaginatedResponse<Message>>(
      '/api/v1/communications/messages',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get message by ID
   */
  async getById(messageId: string): Promise<Message> {
    const response = await apiInstance.get<ApiResponse<Message>>(
      `/api/v1/communications/messages/${messageId}`
    );
    return response.data.data!;
  }

  /**
   * Create new message
   */
  async create(messageData: CreateMessageRequest): Promise<Message> {
    const response = await apiInstance.post<ApiResponse<Message>>(
      '/api/v1/communications/messages',
      messageData
    );
    return response.data.data!;
  }

  /**
   * Update message
   */
  async update(messageId: string, messageData: UpdateMessageRequest): Promise<Message> {
    const response = await apiInstance.put<ApiResponse<Message>>(
      `/api/v1/communications/messages/${messageId}`,
      messageData
    );
    return response.data.data!;
  }

  /**
   * Delete message
   */
  async delete(messageId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiInstance.delete<ApiResponse<{ success: boolean; message: string }>>(
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
    const response = await apiInstance.post<ApiResponse<Message>>(
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
    const response = await apiInstance.get<PaginatedResponse<Message>>(
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
    const response = await apiInstance.get<PaginatedResponse<Message>>(
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
    const response = await apiInstance.get<PaginatedResponse<MessageTemplate>>(
      '/api/v1/communications/templates',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Create message template
   */
  async createTemplate(templateData: CreateTemplateRequest): Promise<MessageTemplate> {
    const response = await apiInstance.post<ApiResponse<MessageTemplate>>(
      '/api/v1/communications/templates',
      templateData
    );
    return response.data.data!;
  }

  /**
   * Get delivery status
   */
  async getDeliveryStatus(messageId: string): Promise<DeliveryStatus> {
    const response = await apiInstance.get<ApiResponse<DeliveryStatus>>(
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
    const response = await apiInstance.get<ApiResponse<MessageStatistics>>(
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

// Export singleton instance
export const messagesApi = new MessagesApi();
