/**
 * LOC: C6BF3D5EA9-TYPES
 * WC-SVC-COM-017-TYPES | types.ts - Communication Service Type Definitions
 *
 * UPSTREAM (imports from):
 *   - database/types/enums.ts
 *
 * DOWNSTREAM (imported by):
 *   - All communication service modules
 */

/**
 * WC-SVC-COM-017-TYPES | types.ts - Communication Service Type Definitions
 * Purpose: Shared TypeScript interfaces and types for communication service modules
 * Upstream: None | Dependencies: None
 * Downstream: All communication modules | Called by: Service operations
 * Related: All communication service modules
 * Exports: Interfaces for templates, messages, delivery, broadcasts, filters
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Type definitions only
 * Critical Path: Type safety for all communication operations
 * LLM Context: Central type definitions for communication service - ensures type consistency across modules
 */

import {
  MessageType,
  MessagePriority,
  MessageCategory,
  RecipientType,
  DeliveryStatus
} from '../../database/types/enums';

/**
 * Interface for creating a new message template
 */
export interface CreateMessageTemplateData {
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables?: string[];
  isActive?: boolean;
  createdBy: string;
}

/**
 * Interface for creating a new message
 */
export interface CreateMessageData {
  recipients: Array<{
    type: RecipientType;
    id: string;
    email?: string;
    phoneNumber?: string;
    pushToken?: string;
    preferredLanguage?: string;
  }>;
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  templateId?: string;
  scheduledAt?: Date;
  attachments?: string[];
  senderId: string;
  translateTo?: string[];
}

/**
 * Interface for message delivery status tracking
 */
export interface MessageDeliveryStatusResult {
  messageId: string;
  recipientId: string;
  channel: MessageType;
  status: DeliveryStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  failureReason?: string;
  externalId?: string;
}

/**
 * Interface for broadcast message data
 */
export interface BroadcastMessageData {
  audience: {
    grades?: string[];
    nurseIds?: string[];
    studentIds?: string[];
    includeParents?: boolean;
    includeEmergencyContacts?: boolean;
  };
  channels: MessageType[];
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  senderId: string;
  scheduledAt?: Date;
  translateTo?: string[];
}

/**
 * Interface for message query filters
 */
export interface MessageFilters {
  senderId?: string;
  category?: MessageCategory;
  priority?: MessagePriority;
  status?: DeliveryStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Interface for emergency alert configuration
 */
export interface EmergencyAlertData {
  title: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  audience: 'ALL_STAFF' | 'NURSES_ONLY' | 'SPECIFIC_GROUPS';
  groups?: string[];
  channels: MessageType[];
  senderId: string;
}

/**
 * Interface for channel sending data
 */
export interface ChannelSendData {
  to: string;
  subject?: string;
  content: string;
  priority: MessagePriority;
  attachments?: string[];
}

/**
 * Interface for channel send result
 */
export interface ChannelSendResult {
  externalId: string;
}

/**
 * Interface for communication statistics
 */
export interface CommunicationStatistics {
  totalMessages: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
  deliveryStatus: Record<string, number>;
}

/**
 * Interface for delivery summary
 */
export interface DeliverySummary {
  total: number;
  pending: number;
  sent: number;
  delivered: number;
  failed: number;
  bounced: number;
}
