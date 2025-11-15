/**
 * MIGRATION STATUS: DEPRECATED
 *
 * @deprecated Use Server Actions from @/lib/actions/communications.delivery
 * @see {@link /lib/actions/communications.delivery.ts}
 * @module services/modules/communications/deliveryTrackingApi
 * @category Healthcare - Communications
 *
 * **Migration Guide:**
 *
 * OLD (Client API):
 * ```typescript
 * import { createDeliveryTrackingApi } from '@/services/modules/communications/deliveryTrackingApi';
 * const api = createDeliveryTrackingApi(apiClient);
 *
 * // Check delivery status
 * const isDelivered = await api.isMessageDelivered(messageId);
 *
 * // Get detailed status
 * const status = await api.getDeliveryStatus(messageId);
 * console.log(`Status: ${status.status}, Attempts: ${status.attempts}`);
 * ```
 *
 * NEW (Server Actions):
 * ```typescript
 * import {
 *   getDeliveryStatus,
 *   isMessageDelivered,
 *   trackDeliveryWebhook
 * } from '@/lib/actions/communications.delivery';
 *
 * // In Server Component
 * const status = await getDeliveryStatus(messageId);
 * const delivered = await isMessageDelivered(messageId);
 *
 * // Real-time delivery tracking with webhooks
 * import { useDeliveryTracking } from '@/lib/hooks/useDeliveryTracking';
 *
 * function MessageStatus({ messageId }: { messageId: string }) {
 *   const { status, isDelivered, attempts } = useDeliveryTracking(messageId);
 *
 *   return (
 *     <div>
 *       <span>Status: {status}</span>
 *       {isDelivered ? (
 *         <span className="success">✓ Delivered</span>
 *       ) : (
 *         <span>Attempts: {attempts}</span>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * **Real-time Delivery Notifications:**
 * ```typescript
 * // OLD: Client-side polling
 * useEffect(() => {
 *   const interval = setInterval(async () => {
 *     const status = await api.getDeliveryStatus(messageId);
 *     setDeliveryStatus(status);
 *   }, 5000);
 *   return () => clearInterval(interval);
 * }, [messageId]);
 *
 * // NEW: Server-Sent Events
 * import { subscribeToDeliveryUpdates } from '@/lib/actions/communications.delivery';
 *
 * useEffect(() => {
 *   const unsubscribe = subscribeToDeliveryUpdates(messageId, (status) => {
 *     console.log('Delivery update:', status);
 *     setDeliveryStatus(status);
 *   });
 *   return unsubscribe;
 * }, [messageId]);
 * ```
 *
 * **Multi-channel Delivery Tracking:**
 * ```typescript
 * import { getMultiChannelDeliveryReport } from '@/lib/actions/communications.delivery';
 *
 * const report = await getMultiChannelDeliveryReport(broadcastId);
 * console.log('Email delivered:', report.email.delivered);
 * console.log('SMS delivered:', report.sms.delivered);
 * console.log('Push delivered:', report.push.delivered);
 * ```
 *
 * **Available Server Actions:**
 * - getDeliveryStatus: Get delivery status for message
 * - isMessageDelivered: Check if delivered
 * - getMultiChannelDeliveryReport: Get delivery by channel
 * - subscribeToDeliveryUpdates: Real-time webhook subscription
 * - retryFailedDelivery: Retry failed deliveries
 *
 * @fileoverview Delivery Tracking API Service - Communication delivery monitoring (DEPRECATED)
 * @version 2.0.0
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
