/**
 * @fileoverview Communication API service for messaging and notifications
 * @module services/modules/communicationApi
 * @category Services
 * 
 * Comprehensive communication API for message templates, direct messaging,
 * broadcast messages, emergency alerts, and multi-language support.
 * 
 * Key Features:
 * - **Message Templates**: Reusable templates for common communications
 * - **Direct Messaging**: One-to-one communication with parents/staff
 * - **Broadcast Messages**: Send to multiple recipients simultaneously
 * - **Emergency Alerts**: Priority messaging for urgent situations
 * - **Multi-language**: Translation support for diverse communities
 * - **Scheduled Messages**: Send messages at specified times
 * - **Delivery Tracking**: Monitor message delivery status
 * - **Statistics**: Communication analytics and reporting
 * 
 * Message Types:
 * - EMAIL: Email notifications
 * - SMS: Text message alerts
 * - PUSH: Push notifications (mobile app)
 * - IN_APP: In-application messages
 * - MULTI: Multiple channels simultaneously
 * 
 * Healthcare Context:
 * - Appointment reminders
 * - Medication administration notifications
 * - Health alerts and updates
 * - Parent-nurse communication
 * - Emergency contact notifications
 * - HIPAA-compliant messaging (no PHI in SMS)
 * 
 * @example
 * ```typescript
 * // Send direct message
 * const response = await communicationApi.sendMessage({
 *   recipientId: 'parent-123',
 *   subject: 'Appointment Reminder',
 *   body: 'Your child has an appointment tomorrow at 10 AM',
 *   type: 'EMAIL',
 *   priority: 'NORMAL'
 * });
 * 
 * // Send broadcast (multiple recipients)
 * await communicationApi.sendBroadcast({
 *   recipientIds: ['parent-1', 'parent-2', 'parent-3'],
 *   templateId: 'template-123',
 *   variables: { date: '2025-01-15', event: 'Health Fair' },
 *   type: 'EMAIL'
 * });
 * 
 * // Send emergency alert
 * await communicationApi.sendEmergencyAlert({
 *   recipientIds: ['all-parents'],
 *   subject: 'School Closure',
 *   body: 'School is closed due to weather',
 *   type: 'MULTI', // Email + SMS + Push
 *   priority: 'URGENT'
 * });
 * 
 * // Get message delivery status
 * const status = await communicationApi.getMessageStatus('msg-123');
 * console.log(`Delivered: ${status.deliveredCount}/${status.totalRecipients}`);
 * ```
 */

import type { ICommunicationApi } from '../types'
import type {
  MessageTemplate,
  Message,
  CreateMessageTemplateData,
  UpdateMessageTemplateData,
  MessageTemplateFilters,
  CreateMessageData,
  MessageFilters,
  BroadcastMessageData,
  EmergencyAlertData,
  SendMessageResponse,
  GetMessagesResponse,
  MessageDeliveryStatusResponse,
  CommunicationStatistics,
  CommunicationStatisticsFilters,
  TranslationRequest,
  TranslationResponse,
  ProcessScheduledMessagesResponse,
  CommunicationOptions
} from '../../types/communication'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Communication API implementation
 * 
 * @class
 * @implements {ICommunicationApi}
 * @classdesc Handles message templates, direct messaging, broadcast messages,
 * emergency alerts, and communication statistics for the healthcare platform.
 * 
 * API Endpoints:
 * - GET /communication/templates - List message templates
 * - POST /communication/templates - Create template
 * - POST /communication/messages - Send direct message
 * - POST /communication/broadcast - Send broadcast message
 * - POST /communication/emergency - Send emergency alert
 * - GET /communication/messages/:id/status - Get delivery status
 * - GET /communication/statistics - Get communication stats
 * 
 * PHI Considerations:
 * - No PHI allowed in SMS messages (HIPAA compliance)
 * - Email and in-app messages can contain limited PHI
 * - Parent contact info is PHI - handle securely
 * - Audit logging required for all communications
 * 
 * @example
 * ```typescript
 * const communicationApi = new CommunicationApiImpl();
 * 
 * // Use template for appointment reminder
 * const { template } = await communicationApi.getTemplateById('appt-reminder');
 * await communicationApi.sendMessage({
 *   recipientId: 'parent-123',
 *   templateId: template.id,
 *   variables: { date: '2025-01-15', time: '10:00 AM' },
 *   type: 'EMAIL'
 * });
 * ```
 */
class CommunicationApiImpl implements ICommunicationApi {
  // =====================
  // TEMPLATE OPERATIONS
  // =====================

  /**
   * Get communication templates with optional filters
   */
  async getTemplates(filters?: MessageTemplateFilters): Promise<{ templates: MessageTemplate[] }> {
    try {
      const params = new URLSearchParams()

      if (filters?.type) params.append('type', filters.type)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive))

      const response = await apiInstance.get(`/communication/templates?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: string): Promise<{ template: MessageTemplate }> {
    try {
      const response = await apiInstance.get(`/communication/templates/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new communication template
   */
  async createTemplate(data: CreateMessageTemplateData): Promise<{ template: MessageTemplate }> {
    try {
      const response = await apiInstance.post('/communication/templates', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update a communication template
   */
  async updateTemplate(id: string, data: UpdateMessageTemplateData): Promise<{ template: MessageTemplate }> {
    try {
      const response = await apiInstance.put(`/communication/templates/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete a communication template
   */
  async deleteTemplate(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/communication/templates/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // MESSAGE OPERATIONS
  // =====================

  /**
   * Send a targeted message to specific recipients
   */
  async sendMessage(data: CreateMessageData): Promise<SendMessageResponse> {
    try {
      const response = await apiInstance.post('/communication/send', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send a broadcast message to multiple audiences
   */
  async sendBroadcast(data: BroadcastMessageData): Promise<SendMessageResponse> {
    try {
      const response = await apiInstance.post('/communication/broadcast', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get communication messages with pagination and filters
   */
  async getMessages(filters?: MessageFilters): Promise<GetMessagesResponse> {
    try {
      const params = new URLSearchParams()

      if (filters?.page) params.append('page', String(filters.page))
      if (filters?.limit) params.append('limit', String(filters.limit))
      if (filters?.senderId) params.append('senderId', filters.senderId)
      if (filters?.category) params.append('category', filters.category)
      if (filters?.priority) params.append('priority', filters.priority)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) params.append('dateTo', filters.dateTo)

      const response = await apiInstance.get(`/communication/messages?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get a single message by ID with all details
   */
  async getMessageById(id: string): Promise<{ message: Message }> {
    try {
      const response = await apiInstance.get(`/communication/messages/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get message delivery status and summary
   */
  async getMessageDeliveryStatus(messageId: string): Promise<MessageDeliveryStatusResponse> {
    try {
      const response = await apiInstance.get(`/communication/messages/${messageId}/delivery`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // EMERGENCY ALERTS
  // =====================

  /**
   * Send emergency alert to staff or specific groups
   */
  async sendEmergencyAlert(data: EmergencyAlertData): Promise<SendMessageResponse> {
    try {
      const response = await apiInstance.post('/communication/emergency-alert', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // SCHEDULED MESSAGES
  // =====================

  /**
   * Process scheduled messages (typically called by cron job)
   */
  async processScheduledMessages(): Promise<ProcessScheduledMessagesResponse> {
    try {
      const response = await apiInstance.post('/communication/process-scheduled')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // STATISTICS & ANALYTICS
  // =====================

  /**
   * Get communication statistics with optional date filtering
   */
  async getStatistics(filters?: CommunicationStatisticsFilters): Promise<CommunicationStatistics> {
    try {
      const params = new URLSearchParams()

      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
      if (filters?.dateTo) params.append('dateTo', filters.dateTo)

      const response = await apiInstance.get(`/communication/statistics?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // TRANSLATION
  // =====================

  /**
   * Translate message content to target language
   */
  async translateMessage(data: TranslationRequest): Promise<TranslationResponse> {
    try {
      const response = await apiInstance.post('/communication/translate', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // =====================
  // COMMUNICATION OPTIONS
  // =====================

  /**
   * Get communication options (channels, notification types, priority levels)
   */
  async getOptions(): Promise<CommunicationOptions> {
    try {
      const response = await apiInstance.get('/communication/options')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const communicationApi = new CommunicationApiImpl()
export type { ICommunicationApi }
