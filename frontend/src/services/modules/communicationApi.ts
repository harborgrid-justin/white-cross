import type { ICommunicationApi } from '../types'
import type { 
  CommunicationTemplate, 
  CommunicationMessage
} from '../types'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Communication API implementation
 * Handles templates, messaging, broadcasts, and emergency alerts
 */
class CommunicationApiImpl implements ICommunicationApi {
  // Templates
  /**
   * Get communication templates
   */
  async getTemplates(type?: string, category?: string, isActive = true): Promise<{ templates: CommunicationTemplate[] }> {
    try {
      const params = new URLSearchParams({ isActive: String(isActive) })
      if (type) params.append('type', type)
      if (category) params.append('category', category)
      
      const response = await apiInstance.get(`/communication/templates?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new communication template
   */
  async createTemplate(data: {
    name: string
    subject?: string
    content: string
    type: string
    category: string
    variables?: string[]
    isActive?: boolean
  }): Promise<{ template: CommunicationTemplate }> {
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
  async updateTemplate(id: string, data: Partial<CommunicationTemplate>): Promise<{ template: CommunicationTemplate }> {
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
  async deleteTemplate(id: string): Promise<void> {
    try {
      await apiInstance.delete(`/communication/templates/${id}`)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Messages
  /**
   * Send a targeted message
   */
  async sendMessage(data: {
    recipients: any[]
    channels: string[]
    subject?: string
    content: string
    priority: string
    category: string
    templateId?: string
    scheduledAt?: string
    attachments?: string[]
  }): Promise<{ message: CommunicationMessage; deliveryStatuses: any[] }> {
    try {
      const response = await apiInstance.post('/communication/send', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send a broadcast message
   */
  async sendBroadcast(data: {
    audience: {
      grades?: string[]
      nurseIds?: string[]
      studentIds?: string[]
      includeParents?: boolean
      includeEmergencyContacts?: boolean
    }
    channels: string[]
    subject?: string
    content: string
    priority: string
    category: string
    scheduledAt?: string
  }): Promise<{ message: CommunicationMessage; deliveryStatuses: any[] }> {
    try {
      const response = await apiInstance.post('/communication/broadcast', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get communication messages with pagination
   */
  async getMessages(page = 1, limit = 20, filters?: any): Promise<{ messages: CommunicationMessage[]; pagination: any }> {
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, String(value))
        })
      }
      
      const response = await apiInstance.get(`/communication/messages?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get message delivery status
   */
  async getMessageDelivery(messageId: string): Promise<{ deliveries: any[]; summary: any }> {
    try {
      const response = await apiInstance.get(`/communication/messages/${messageId}/delivery`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Emergency Alert
  /**
   * Send emergency alert
   */
  async sendEmergencyAlert(data: {
    title: string
    message: string
    severity: string
    audience: string
    groups?: string[]
    channels: string[]
  }): Promise<{ message: CommunicationMessage; deliveryStatuses: any[] }> {
    try {
      const response = await apiInstance.post('/communication/emergency-alert', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Statistics
  /**
   * Get communication statistics
   */
  async getStatistics(dateFrom?: string, dateTo?: string): Promise<any> {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      
      const response = await apiInstance.get(`/communication/statistics?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Translation
  /**
   * Translate message content
   */
  async translateMessage(content: string, targetLanguage: string): Promise<{ translated: string }> {
    try {
      const response = await apiInstance.post('/communication/translate', {
        content,
        targetLanguage
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const communicationApi = new CommunicationApiImpl()
export type { ICommunicationApi }
