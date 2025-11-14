/**
 * WF-COMP-320 | messages.ts - Core message type definitions
 * Purpose: Types for messages, recipients, and message operations
 * Dependencies: communication-enums, message-templates, core/common
 * Exports: Message, MessageRecipient, and related types
 * Last Updated: 2025-11-12 | File Type: .ts
 *
 * VALIDATION CONSTRAINTS:
 * - SMS messages: Maximum 1600 characters (will be split into multiple parts)
 * - Email subject: Recommended 78 characters for proper display
 * - Message content: 1-50000 characters
 * - Recipients per message: Maximum 1000
 * - Emergency alerts must have URGENT priority
 * - Scheduled messages must be future dated
 * - Phone numbers must be in E.164 format (+1234567890)
 * - Email addresses must be valid RFC 5322 format
 */

import type { User, BaseEntity, PaginationParams, DateRangeFilter } from '../../core/common';
import { MessageType, MessagePriority, MessageCategory, RecipientType, DeliveryStatus } from './communication-enums';
import type { MessageTemplate } from './message-templates';

// =====================
// MESSAGE TYPES
// =====================

/**
 * Message entity
 *
 * @aligned_with backend/src/database/models/communication/Message.ts
 *
 * Validation constraints:
 * - subject: 0-255 characters, optional
 * - content: 1-50000 characters, required (SMS: max 1600, Email: max 100000)
 * - scheduledAt: Must be future date if provided
 * - recipientCount: 0-10000
 * - attachments: Max 10 URLs, each max 2048 characters
 * - Emergency category requires URGENT priority
 *
 * PHI/PII Fields:
 * - content: Message content may contain health information (PHI)
 * - subject: May contain patient/student information (PHI/PII)
 * - senderId: User identifier who sent the message (PII)
 * - attachments: May contain documents with PHI
 */
export interface Message extends BaseEntity {
  subject?: string; // May contain PHI/PII
  content: string; // May contain PHI
  priority: MessagePriority;
  category: MessageCategory;
  templateId?: string;
  scheduledAt?: string;
  attachments?: string[]; // May contain PHI
  senderId: string; // PII - User identifier
  recipientCount: number;
  sender?: User;
  template?: MessageTemplate;
  deliveries?: MessageDelivery[];
}

/**
 * Message recipient configuration
 *
 * Validation constraints:
 * - email: Valid RFC 5322 format, max 254 characters (required for EMAIL channel)
 * - phoneNumber: E.164 format (+1234567890), 10-15 digits (required for SMS/VOICE channels)
 * - pushToken: Min 10 characters (required for PUSH_NOTIFICATION channel)
 * - preferredLanguage: ISO 639-1 code (2 characters)
 */
export interface MessageRecipient {
  type: RecipientType;
  id: string;
  email?: string;
  phoneNumber?: string;
  pushToken?: string;
  preferredLanguage?: string;
}

/**
 * Create Message request data
 *
 * Validation constraints:
 * - recipients: 1-1000 items, each must have contact info matching selected channels
 * - channels: At least 1 channel required
 * - content: Channel-specific limits (SMS: 1600, Email: 100000, General: 50000)
 * - scheduledAt: Must be future date if provided
 * - attachments: Max 10 URLs
 * - translateTo: Array of ISO 639-1 language codes
 * - Emergency category enforces URGENT priority
 */
export interface CreateMessageData {
  recipients: MessageRecipient[];
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  templateId?: string;
  scheduledAt?: string;
  attachments?: string[];
  translateTo?: string[];
}

/**
 * Message filters for querying
 */
export interface MessageFilters extends PaginationParams, DateRangeFilter {
  senderId?: string;
  category?: MessageCategory;
  priority?: MessagePriority;
  status?: DeliveryStatus;
  dateFrom?: string;
  dateTo?: string;
}

// =====================
// SCHEDULED MESSAGES
// =====================

/**
 * Scheduled Message entity
 */
export interface ScheduledMessage extends BaseEntity {
  messageId: string;
  scheduledAt: string;
  processedAt?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  failureReason?: string;
  message?: Message;
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Send Message response
 */
export interface SendMessageResponse {
  message: Message;
  deliveryStatuses: MessageDeliveryStatusResult[];
}

/**
 * Get Messages response with pagination
 */
export interface GetMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Process Scheduled Messages response
 */
export interface ProcessScheduledMessagesResponse {
  processedCount: number;
}

// =====================
// FORWARD DECLARATIONS
// =====================

/**
 * Message Delivery interface (forward declaration to avoid circular dependency)
 * Full definition in message-delivery.ts
 */
interface MessageDelivery {
  id: string;
  messageId: string;
  recipientId: string;
  recipientType: RecipientType;
  channel: MessageType;
  status: DeliveryStatus;
}

/**
 * Message Delivery Status Result (forward declaration)
 * Full definition in message-delivery.ts
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
