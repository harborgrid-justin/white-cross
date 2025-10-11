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
 * Handles templates, messaging, broadcasts, and emergency alerts
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
