/**
 * LOC: C6BF3D5EA9
 * WC-SVC-COM-017 | index.ts - Communication Service Main Export
 *
 * UPSTREAM (imports from):
 *   - All communication submodules
 *
 * DOWNSTREAM (imported by):
 *   - routes/communication.ts
 *   - Other services requiring communication functionality
 */

/**
 * WC-SVC-COM-017 | index.ts - Communication Service Main Export
 * Purpose: Aggregates all communication operations into a unified service class
 * Upstream: All communication modules | Dependencies: sequelize, validators
 * Downstream: Communication routes, appointment service, emergency service | Called by: Routes, services
 * Related: All communication submodules
 * Exports: CommunicationService class with all communication methods
 * Last Updated: 2025-10-18 | File Type: .ts | HIPAA: Contains PHI routing - compliance required
 * Critical Path: Service method → Module delegation → Operation execution → Response
 * LLM Context: Main communication service interface - delegates to specialized modules for implementation
 */

import { MessageTemplate, Message, MessageDelivery } from '../../database/models';
import { MessageType, MessageCategory } from '../../database/types/enums';

// Import all operation modules
import * as TemplateOps from './templateOperations';
import * as MessageOps from './messageOperations';
import * as DeliveryOps from './deliveryOperations';
import * as BroadcastOps from './broadcastOperations';
import * as StatisticsOps from './statisticsOperations';
import * as ChannelService from './channelService';

// Import types
import {
  CreateMessageTemplateData,
  CreateMessageData,
  MessageDeliveryStatusResult,
  BroadcastMessageData,
  MessageFilters,
  EmergencyAlertData,
  CommunicationStatistics,
  DeliverySummary
} from './types';

/**
 * Communication Service
 * Unified interface for all message template, messaging, and delivery tracking operations
 *
 * This service is organized into focused modules:
 * - templateOperations: Template CRUD operations
 * - messageOperations: Core message sending and retrieval
 * - deliveryOperations: Delivery tracking and scheduled processing
 * - broadcastOperations: Broadcast and emergency alerts
 * - statisticsOperations: Communication analytics
 * - channelService: Channel-specific sending logic
 */
export class CommunicationService {
  // ========================================
  // Template Operations
  // ========================================

  /**
   * Create message template
   * @param data - Template creation data
   * @returns Created message template with creator details
   */
  static async createMessageTemplate(data: CreateMessageTemplateData): Promise<MessageTemplate> {
    return TemplateOps.createMessageTemplate(data);
  }

  /**
   * Get message templates with optional filters
   * @param type - Filter by message type
   * @param category - Filter by message category
   * @param isActive - Filter by active status
   * @returns Array of message templates
   */
  static async getMessageTemplates(
    type?: MessageType,
    category?: MessageCategory,
    isActive: boolean = true
  ): Promise<MessageTemplate[]> {
    return TemplateOps.getMessageTemplates(type, category, isActive);
  }

  /**
   * Get a single message template by ID
   * @param id - Template ID
   * @returns Message template
   */
  static async getMessageTemplateById(id: string): Promise<MessageTemplate | null> {
    return TemplateOps.getMessageTemplateById(id);
  }

  /**
   * Update message template
   * @param id - Template ID
   * @param data - Fields to update
   * @returns Updated template
   */
  static async updateMessageTemplate(
    id: string,
    data: Partial<CreateMessageTemplateData>
  ): Promise<MessageTemplate> {
    return TemplateOps.updateMessageTemplate(id, data);
  }

  /**
   * Delete message template
   * @param id - Template ID
   * @returns Success status
   */
  static async deleteMessageTemplate(id: string): Promise<{ success: boolean }> {
    return TemplateOps.deleteMessageTemplate(id);
  }

  // ========================================
  // Message Operations
  // ========================================

  /**
   * Send message to specific recipients
   * Uses transaction to ensure atomicity of message creation and delivery tracking
   * @param data - Message data with recipients and channels
   * @returns Created message and delivery statuses
   */
  static async sendMessage(data: CreateMessageData): Promise<{
    message: Message;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    return MessageOps.sendMessage(data);
  }

  /**
   * Get messages with pagination and filters
   * @param page - Page number (1-indexed)
   * @param limit - Number of items per page
   * @param filters - Optional filters
   * @returns Paginated messages with metadata
   */
  static async getMessages(
    page: number = 1,
    limit: number = 20,
    filters: MessageFilters = {}
  ): Promise<{
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    return MessageOps.getMessages(page, limit, filters);
  }

  /**
   * Get a single message by ID
   * @param id - Message ID
   * @returns Message with details
   */
  static async getMessageById(id: string): Promise<Message | null> {
    return MessageOps.getMessageById(id);
  }

  // ========================================
  // Delivery Operations
  // ========================================

  /**
   * Get message delivery status for a specific message
   * @param messageId - Message ID
   * @returns Delivery records and summary statistics
   */
  static async getMessageDeliveryStatus(messageId: string): Promise<{
    deliveries: MessageDelivery[];
    summary: DeliverySummary;
  }> {
    return DeliveryOps.getMessageDeliveryStatus(messageId);
  }

  /**
   * Process scheduled messages that are due for delivery
   * Should be called by a cron job or scheduled task
   * @returns Number of messages processed
   */
  static async processScheduledMessages(): Promise<number> {
    return DeliveryOps.processScheduledMessages();
  }

  /**
   * Update delivery status for a specific delivery
   * Used for webhook callbacks from external services
   * @param deliveryId - Delivery ID
   * @param status - New delivery status
   * @param metadata - Additional metadata
   * @returns Updated delivery record
   */
  static async updateDeliveryStatus(
    deliveryId: string,
    status: any,
    metadata?: {
      deliveredAt?: Date;
      failureReason?: string;
      externalId?: string;
    }
  ): Promise<MessageDelivery> {
    return DeliveryOps.updateDeliveryStatus(deliveryId, status, metadata);
  }

  /**
   * Get all deliveries for a specific recipient
   * @param recipientId - Recipient ID
   * @param limit - Maximum number of deliveries to return
   * @returns Array of delivery records
   */
  static async getRecipientDeliveries(
    recipientId: string,
    limit: number = 50
  ): Promise<MessageDelivery[]> {
    return DeliveryOps.getRecipientDeliveries(recipientId, limit);
  }

  /**
   * Retry failed message delivery
   * @param deliveryId - Delivery ID to retry
   * @returns Updated delivery record
   */
  static async retryFailedDelivery(deliveryId: string): Promise<MessageDelivery> {
    return DeliveryOps.retryFailedDelivery(deliveryId);
  }

  // ========================================
  // Broadcast Operations
  // ========================================

  /**
   * Send broadcast message to multiple audiences
   * Builds recipient list based on audience criteria and sends message
   * @param data - Broadcast message data with audience targeting
   * @returns Created message and delivery statuses
   */
  static async sendBroadcastMessage(data: BroadcastMessageData): Promise<{
    message: Message;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    return BroadcastOps.sendBroadcastMessage(data);
  }

  /**
   * Send emergency alert to staff
   * @param alert - Emergency alert configuration
   * @returns Created message and delivery statuses
   */
  static async sendEmergencyAlert(alert: EmergencyAlertData): Promise<{
    message: Message;
    deliveryStatuses: MessageDeliveryStatusResult[];
  }> {
    return BroadcastOps.sendEmergencyAlert(alert);
  }

  // ========================================
  // Statistics Operations
  // ========================================

  /**
   * Get communication statistics with optional date filtering
   * @param dateFrom - Start date for statistics
   * @param dateTo - End date for statistics
   * @returns Aggregated statistics
   */
  static async getCommunicationStatistics(
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<CommunicationStatistics> {
    return StatisticsOps.getCommunicationStatistics(dateFrom, dateTo);
  }

  /**
   * Get statistics for a specific sender
   * @param senderId - Sender user ID
   * @param dateFrom - Start date for statistics
   * @param dateTo - End date for statistics
   * @returns Sender-specific statistics
   */
  static async getSenderStatistics(
    senderId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    totalMessagesSent: number;
    totalRecipients: number;
    byCategory: Record<string, number>;
    byPriority: Record<string, number>;
    deliverySuccessRate: number;
  }> {
    return StatisticsOps.getSenderStatistics(senderId, dateFrom, dateTo);
  }

  /**
   * Get recent activity summary
   * @param hours - Number of hours to look back
   * @returns Recent activity summary
   */
  static async getRecentActivitySummary(hours: number = 24): Promise<{
    messagesSent: number;
    recipientsReached: number;
    deliveryRate: number;
    failureRate: number;
    topCategories: Array<{ category: string; count: number }>;
  }> {
    return StatisticsOps.getRecentActivitySummary(hours);
  }

  // ========================================
  // Channel Service (Translation)
  // ========================================

  /**
   * Translate message content to target language
   * Mock implementation - should be replaced with actual translation service
   * @param content - Content to translate
   * @param targetLanguage - Target language code
   * @returns Translated content
   */
  static async translateMessage(content: string, targetLanguage: string): Promise<string> {
    return ChannelService.translateMessage(content, targetLanguage);
  }
}

// Re-export types for convenience
export {
  CreateMessageTemplateData,
  CreateMessageData,
  MessageDeliveryStatusResult,
  BroadcastMessageData,
  MessageFilters,
  EmergencyAlertData,
  CommunicationStatistics,
  DeliverySummary
};
