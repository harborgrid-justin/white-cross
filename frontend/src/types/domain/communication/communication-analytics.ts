/**
 * WF-COMP-320 | communication-analytics.ts - Analytics, statistics, and bulk operations
 * Purpose: Types for communication analytics, statistics, options, translations, and bulk operations
 * Dependencies: communication-enums, messages, core/common
 * Exports: CommunicationAnalytics, Statistics, Options, Translation, and Bulk operation types
 * Last Updated: 2025-11-12 | File Type: .ts
 */

import type { DateRangeFilter } from '../../core/common';
import { MessageType, MessagePriority, MessageCategory, DeliveryStatus } from './communication-enums';
import type { CreateMessageData, SendMessageResponse } from './messages';

// =====================
// COMMUNICATION STATISTICS
// =====================

/**
 * Communication Statistics
 */
export interface CommunicationStatistics {
  totalMessages: number;
  byCategory: Record<MessageCategory, number>;
  byPriority: Record<MessagePriority, number>;
  byChannel: Record<MessageType, number>;
  deliveryStatus: Record<DeliveryStatus, number>;
}

/**
 * Communication Statistics filters
 */
export interface CommunicationStatisticsFilters extends DateRangeFilter {
  dateFrom?: string;
  dateTo?: string;
}

// =====================
// COMMUNICATION ANALYTICS
// =====================

/**
 * Communication Analytics data
 */
export interface CommunicationAnalytics {
  period: {
    start: string;
    end: string;
  };
  totalMessages: number;
  totalRecipients: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  bounceRate: number;
  failureRate: number;
  averageDeliveryTime: number;
  channelPerformance: Array<{
    channel: MessageType;
    sent: number;
    delivered: number;
    failed: number;
    deliveryRate: number;
  }>;
  categoryBreakdown: Array<{
    category: MessageCategory;
    count: number;
    percentage: number;
  }>;
  priorityBreakdown: Array<{
    priority: MessagePriority;
    count: number;
    percentage: number;
  }>;
  topTemplates: Array<{
    templateId: string;
    templateName: string;
    usageCount: number;
  }>;
}

// =====================
// COMMUNICATION OPTIONS
// =====================

/**
 * Channel configuration option
 */
export interface ChannelOption {
  id: string;
  label: string;
  value: MessageType;
  description: string;
  enabled: boolean;
  icon?: string;
}

/**
 * Notification type configuration
 */
export interface NotificationTypeOption {
  id: string;
  label: string;
  value: MessageCategory;
  description: string;
  defaultPriority: MessagePriority;
  requiresApproval: boolean;
}

/**
 * Priority level configuration
 */
export interface PriorityLevelOption {
  id: string;
  label: string;
  value: MessagePriority;
  description: string;
  color: string;
}

/**
 * Verification method option
 */
export interface VerificationMethodOption {
  id: string;
  label: string;
  value: MessageType;
}

/**
 * Communication Options response
 */
export interface CommunicationOptions {
  channels: ChannelOption[];
  notificationTypes: NotificationTypeOption[];
  priorityLevels: PriorityLevelOption[];
  verificationMethods: VerificationMethodOption[];
}

// =====================
// TRANSLATION TYPES
// =====================

/**
 * Translation request
 */
export interface TranslationRequest {
  content: string;
  targetLanguage: string;
}

/**
 * Translation response
 */
export interface TranslationResponse {
  translated: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

/**
 * Supported Languages
 */
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
}

// =====================
// BULK OPERATIONS
// =====================

/**
 * Bulk Send Messages request
 */
export interface BulkSendMessagesData {
  messages: CreateMessageData[];
  batchSize?: number;
  delayBetweenBatches?: number;
}

/**
 * Bulk Send Messages response
 */
export interface BulkSendMessagesResponse {
  totalMessages: number;
  successCount: number;
  failureCount: number;
  results: SendMessageResponse[];
  errors: Array<{
    index: number;
    error: string;
  }>;
}
