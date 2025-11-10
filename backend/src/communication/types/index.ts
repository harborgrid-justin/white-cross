/**
 * @fileoverview Communication Module Type Definitions
 * @module communication/types
 * @description Centralized type definitions for the communication module
 */

import { Request } from 'express';
import { Message } from '../../database/models/message.model';
import { DeliveryChannelType, DeliveryStatus } from '../../database/models/message-delivery.model';

/**
 * Authenticated request with user context
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    role?: string;
    tenantId?: string;
  };
}

/**
 * Service response type for message operations
 */
export interface MessageOperationResult {
  message: ReturnType<Message['toJSON']>;
  deliveryStatuses?: Array<{
    messageId: string;
    recipientId: string;
    channel: DeliveryChannelType;
    status: DeliveryStatus;
    sentAt: Date | null;
  }>;
  conversation?: Record<string, unknown>;
  recipientCount?: number;
  queueStatus?: {
    queued: boolean;
    jobIds?: Record<string, string>;
    jobId?: string;
    recipientCount?: number;
    errors?: Array<{ step: string; error: Error }>;
  };
}

/**
 * Service response for edit operations
 */
export interface EditMessageResult {
  message: ReturnType<Message['toJSON']>;
}

/**
 * Service response for read operations
 */
export interface MarkAsReadResult {
  markedAsRead: number;
  total?: number;
}

/**
 * Service response for message history
 */
export interface MessageHistoryResult {
  messages: Array<ReturnType<Message['toJSON']>>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Service response for message search
 */
export interface MessageSearchResult extends MessageHistoryResult {
  query: string;
}

/**
 * Service response for unread count
 */
export interface UnreadCountResult {
  total: number;
  byConversation: Record<string, number>;
}

/**
 * Delivery status update payload
 */
export interface DeliveryStatusUpdate {
  messageId: string;
  recipientId?: string;
  status: DeliveryStatus;
  channel?: DeliveryChannelType;
  sentAt?: string | Date;
  deliveredAt?: string | Date;
  failureReason?: string;
  timestamp?: string;
}

export * from './conversation.types';
