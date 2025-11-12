/**
 * Response Types for Message Operations
 *
 * Provides strict type definitions for all message service responses,
 * eliminating the use of 'any' types and improving type safety.
 */

import { Message } from '../../database/models/message.model';
import { Conversation } from '../../database/models/conversation.model';

/**
 * Queue status information for message delivery
 */
export interface QueueStatus {
  queued: boolean;
  jobIds?: Record<string, string>;
  jobId?: string;
  errors?: string[];
  recipientCount?: number;
}

/**
 * Response for sending a direct message
 */
export interface SendDirectMessageResponse {
  message: Message;
  conversation: Conversation;
  queueStatus: QueueStatus;
}

/**
 * Response for sending a group message
 */
export interface SendGroupMessageResponse {
  message: Message;
  conversation: Conversation;
  recipientCount: number;
  queueStatus: QueueStatus;
}

/**
 * Response for editing a message
 */
export interface EditMessageResponse {
  message: Message;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Response for message history queries
 */
export interface MessageHistoryResponse {
  messages: Message[];
  pagination: PaginationMetadata;
}

/**
 * Response for message search
 */
export interface SearchMessagesResponse {
  messages: Message[];
  pagination: PaginationMetadata;
  query: string;
}

/**
 * Response for marking conversation as read
 */
export interface MarkConversationAsReadResponse {
  markedAsRead: number;
}

/**
 * Default values for MessageRead model creation
 */
export interface MessageReadDefaults {
  messageId: string;
  userId: string;
  readAt: Date;
}
