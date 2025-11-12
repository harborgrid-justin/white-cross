/**
 * WF-COMP-320 | message-delivery.ts - Message delivery tracking types
 * Purpose: Types for message delivery, status tracking, history, and read receipts
 * Dependencies: communication-enums, messages, core/common
 * Exports: MessageDelivery, MessageHistory, ReadReceipt, and related types
 * Last Updated: 2025-11-12 | File Type: .ts
 */

import type { BaseEntity } from '../../core/common';
import { MessageType, RecipientType, DeliveryStatus } from './communication-enums';
import type { Message } from './messages';

// =====================
// MESSAGE DELIVERY TYPES
// =====================

/**
 * Message Delivery entity - tracks individual delivery attempts
 *
 * @aligned_with backend/src/database/models/communication/MessageDelivery.ts
 *
 * PHI/PII Fields:
 * - recipientId: Identifier of message recipient (PII)
 * - contactInfo: Email, phone number, or push token (PII)
 * - failureReason: May contain delivery details with PHI
 *
 * Note: readAt field is UI-specific and not present in backend model
 */
export interface MessageDelivery extends BaseEntity {
  messageId: string;
  recipientId: string; // PII - Recipient identifier
  recipientType: RecipientType;
  channel: MessageType;
  status: DeliveryStatus;
  contactInfo?: string; // PII - Email/phone/push token
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string; // May contain PHI
  externalId?: string;
  readAt?: string; // UI-specific field (not in backend)
  message?: Message;
}

/**
 * Message Delivery Status result
 */
export interface MessageDeliveryStatusResult {
  messageId: string;
  recipientId: string;
  channel: MessageType;
  status: DeliveryStatus;
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  externalId?: string;
}

/**
 * Delivery Summary statistics
 */
export interface DeliverySummary {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
}

/**
 * Message Delivery Status response
 */
export interface MessageDeliveryStatusResponse {
  deliveries: MessageDelivery[];
  summary: DeliverySummary;
}

// =====================
// MESSAGE HISTORY
// =====================

/**
 * Message History entry
 */
export interface MessageHistory extends BaseEntity {
  messageId: string;
  action: 'CREATED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'BOUNCED' | 'OPENED' | 'CLICKED';
  performedBy?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

// =====================
// READ RECEIPTS
// =====================

/**
 * Read Receipt
 */
export interface ReadReceipt extends BaseEntity {
  messageId: string;
  deliveryId: string;
  recipientId: string;
  readAt: string;
  ipAddress?: string;
  userAgent?: string;
}
