/**
 * MIGRATION STATUS: DEPRECATED
 *
 * This service module has been replaced by Next.js Server Actions for improved
 * performance, security, and Next.js App Router compatibility.
 *
 * **New Implementation:**
 * - Server Components: import from '@/lib/actions/communications.*'
 * - Client Components: Use Server Actions with useActionState or React Query
 *
 * **Migration Guide:**
 *
 * OLD (Client API):
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communications';
 * const api = createCommunicationsApi(apiClient);
 *
 * // Send broadcast
 * await api.broadcasts.sendBroadcast(id);
 *
 * // Send direct message
 * await api.messages.sendMessage({ subject, body, recipientId });
 *
 * // Get templates
 * const templates = await api.templates.getActiveTemplates();
 * ```
 *
 * NEW (Server Actions):
 * ```typescript
 * import {
 *   sendBroadcastAction,
 *   sendMessageAction,
 *   getActiveTemplates,
 *   trackDeliveryStatus
 * } from '@/lib/actions/communications.actions';
 *
 * // In Server Components - direct call
 * const templates = await getActiveTemplates();
 *
 * // In Client Components - with useActionState
 * 'use client';
 * import { useActionState } from 'react';
 *
 * function SendMessageForm() {
 *   const [state, formAction, isPending] = useActionState(
 *     sendMessageAction,
 *     { errors: {} }
 *   );
 *   return <form action={formAction}>...</form>;
 * }
 * ```
 *
 * **Available Server Actions:**
 * - Broadcasts: sendBroadcastAction, getBroadcasts, getBroadcastStatus
 * - Messages: sendMessageAction, getInbox, markAsRead
 * - Templates: getTemplates, createTemplate, getTemplateById
 * - Notifications: sendNotification, getNotificationPreferences
 * - Delivery: trackDeliveryStatus, getDeliveryReport
 *
 * **Real-time Notifications:**
 * ```typescript
 * // OLD: Client-side polling
 * setInterval(() => api.messages.getInbox(), 30000);
 *
 * // NEW: Server-Sent Events with Server Actions
 * import { subscribeToNotifications } from '@/lib/actions/communications.realtime';
 *
 * // In Client Component
 * useEffect(() => {
 *   const unsubscribe = subscribeToNotifications((notification) => {
 *     console.log('New notification:', notification);
 *   });
 *   return unsubscribe;
 * }, []);
 * ```
 *
 * **See Also:**
 * - @see {@link /lib/actions/communications.actions.ts} for all available Server Actions
 * - @see {@link /lib/actions/communications.broadcasts.ts} for broadcast operations
 * - @see {@link /lib/actions/communications.messages.ts} for messaging operations
 * - @see {@link /lib/actions/communications.templates.ts} for template operations
 * - @see {@link /lib/actions/communications.notifications.ts} for notification operations
 * - @see {@link /lib/api/client} for client-side utilities if needed
 *
 * @deprecated Use Server Actions from @/lib/actions/communications.* instead
 * @module services/modules/communications
 * @category Healthcare - Communications
 * @fileoverview Communications API - Unified facade for all communication services
 * @version 2.0.0 - Refactored Edition (DEPRECATED)
 */

import type { ApiClient, ApiResponse } from '../../core/ApiClient';
import { buildUrlParams } from '../../utils/apiUtils';
import { createApiError } from '../../core/errors';

// Import sub-APIs
import { BroadcastsApi, createBroadcastsApi } from './broadcastsApi';
import { DirectMessagesApi, createDirectMessagesApi } from './directMessagesApi';
import { TemplatesApi, createTemplatesApi } from './templatesApi';
import { DeliveryTrackingApi, createDeliveryTrackingApi } from './deliveryTrackingApi';

// Re-export all types from sub-modules for convenience
export * from './broadcastsApi';
export * from './directMessagesApi';
export * from './templatesApi';
export * from './deliveryTrackingApi';

// ==========================================
// SHARED TYPES
// ==========================================

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
// UNIFIED COMMUNICATIONS API
// ==========================================

/**
 * Unified Communications API Service
 *
 * Provides a single interface to all communication functionality including
 * broadcasts, messages, templates, and delivery tracking. This is a facade
 * that delegates to specialized sub-APIs.
 *
 * @example
 * ```typescript
 * const api = createCommunicationsApi(apiClient);
 *
 * // Access broadcasts
 * await api.broadcasts.sendBroadcast(broadcastId);
 *
 * // Access messages
 * await api.messages.sendMessage({ subject, body, recipientId });
 *
 * // Access templates
 * const templates = await api.templates.getActiveTemplates();
 *
 * // Access delivery tracking
 * const status = await api.deliveryTracking.getDeliveryStatus(messageId);
 * ```
 */
export class CommunicationsApi {
  public readonly broadcasts: BroadcastsApi;
  public readonly messages: DirectMessagesApi;
  public readonly templates: TemplatesApi;
  public readonly deliveryTracking: DeliveryTrackingApi;

  constructor(private readonly client: ApiClient) {
    this.broadcasts = createBroadcastsApi(client);
    this.messages = createDirectMessagesApi(client);
    this.templates = createTemplatesApi(client);
    this.deliveryTracking = createDeliveryTrackingApi(client);
  }

  // ==========================================
  // SCHEDULED COMMUNICATIONS
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
  // STATISTICS
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

  // ==========================================
  // BACKWARD COMPATIBILITY SHORTCUTS
  // ==========================================

  /**
   * @deprecated Use api.broadcasts.getBroadcasts() instead
   */
  getBroadcasts(filters?: any): ReturnType<BroadcastsApi['getBroadcasts']> {
    return this.broadcasts.getBroadcasts(filters);
  }

  /**
   * @deprecated Use api.broadcasts.createBroadcast() instead
   */
  createBroadcast(data: any): ReturnType<BroadcastsApi['createBroadcast']> {
    return this.broadcasts.createBroadcast(data);
  }

  /**
   * @deprecated Use api.broadcasts.sendBroadcast() instead
   */
  sendBroadcast(id: string): ReturnType<BroadcastsApi['sendBroadcast']> {
    return this.broadcasts.sendBroadcast(id);
  }

  /**
   * @deprecated Use api.messages.getInbox() instead
   */
  getInbox(page?: number, limit?: number): ReturnType<DirectMessagesApi['getInbox']> {
    return this.messages.getInbox(page, limit);
  }

  /**
   * @deprecated Use api.messages.sendMessage() instead
   */
  sendMessage(data: any): ReturnType<DirectMessagesApi['sendMessage']> {
    return this.messages.sendMessage(data);
  }

  /**
   * @deprecated Use api.messages.markAsRead() instead
   */
  markAsRead(id: string): ReturnType<DirectMessagesApi['markAsRead']> {
    return this.messages.markAsRead(id);
  }

  /**
   * @deprecated Use api.templates.getTemplates() instead
   */
  getTemplates(filters?: any): ReturnType<TemplatesApi['getTemplates']> {
    return this.templates.getTemplates(filters);
  }

  /**
   * @deprecated Use api.templates.createTemplate() instead
   */
  createTemplate(data: any): ReturnType<TemplatesApi['createTemplate']> {
    return this.templates.createTemplate(data);
  }
}

/**
 * Factory function to create Communications API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured CommunicationsApi instance
 *
 * @example
 * ```typescript
 * import { createCommunicationsApi } from '@/services/modules/communications';
 *
 * const api = createCommunicationsApi(apiClient);
 * const inbox = await api.messages.getInbox();
 * ```
 */
export function createCommunicationsApi(client: ApiClient): CommunicationsApi {
  return new CommunicationsApi(client);
}
