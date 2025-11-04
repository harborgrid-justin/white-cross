/**
 * @fileoverview Delivery Tracking API Service - Communication delivery monitoring
 * @module services/modules/communications/deliveryTrackingApi
 * @version 2.0.0
 * @category Services
 *
 * Provides delivery status tracking and monitoring for messages and broadcasts.
 * Supports multi-channel delivery confirmation, retry tracking, and failure analysis.
 *
 * ## Key Features
 *
 * **Delivery Tracking** (2 methods):
 * - Real-time delivery status monitoring
 * - Multi-channel delivery confirmation
 * - Retry and failure tracking
 * - Delivery confirmation helper methods
 *
 * @example
 * ```typescript
 * // Check if message was delivered
 * const isDelivered = await deliveryTrackingApi.isMessageDelivered(messageId);
 *
 * // Get detailed delivery status
 * const status = await deliveryTrackingApi.getDeliveryStatus(messageId);
 * console.log(`Status: ${status.status}, Attempts: ${status.attempts}`);
 * ```
 */

import type { ApiClient, ApiResponse } from '../../core/ApiClient';
import { createApiError } from '../../core/errors';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

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

// ==========================================
// DELIVERY TRACKING API SERVICE
// ==========================================

/**
 * Delivery Tracking API Service
 *
 * Provides delivery status monitoring and confirmation checking for
 * messages and broadcasts across all communication channels.
 */
export class DeliveryTrackingApi {
  constructor(private readonly client: ApiClient) {}

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
}

/**
 * Factory function to create Delivery Tracking API instance
 */
export function createDeliveryTrackingApi(client: ApiClient): DeliveryTrackingApi {
  return new DeliveryTrackingApi(client);
}
