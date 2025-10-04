import type { IEmergencyContactsApi } from '../types'
import type { EmergencyContact } from '../types'
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Emergency Contacts API implementation
 * Handles emergency contact management and notifications
 */
class EmergencyContactsApiImpl implements IEmergencyContactsApi {
  /**
   * Get emergency contacts for a student
   */
  async getByStudent(studentId: string): Promise<{ contacts: EmergencyContact[] }> {
    try {
      const response = await apiInstance.get(`/emergency-contacts/student/${studentId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new emergency contact
   */
  async create(data: {
    studentId: string;
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    isPrimary?: boolean;
    canPickup?: boolean;
  }): Promise<{ contact: EmergencyContact }> {
    try {
      const response = await apiInstance.post('/emergency-contacts', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update an emergency contact
   */
  async update(id: string, data: Partial<EmergencyContact>): Promise<{ contact: EmergencyContact }> {
    try {
      const response = await apiInstance.put(`/emergency-contacts/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete an emergency contact
   */
  async delete(id: string): Promise<{ success: boolean }> {
    try {
      const response = await apiInstance.delete(`/emergency-contacts/${id}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send emergency notification to student's contacts
   */
  async notifyStudent(studentId: string, notification: {
    title: string;
    message: string;
    priority: string;
    channels?: string[];
  }): Promise<{ notifications: any[] }> {
    try {
      const response = await apiInstance.post(`/emergency-contacts/notify/${studentId}`, notification)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send notification to specific contact
   */
  async notifyContact(contactId: string, notification: {
    title: string;
    message: string;
    priority: string;
    channels?: string[];
  }): Promise<{ notification: any }> {
    try {
      const response = await apiInstance.post(`/emergency-contacts/notify/contact/${contactId}`, notification)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Verify emergency contact
   */
  async verify(contactId: string, method: 'sms' | 'email' | 'voice'): Promise<{ verification: any }> {
    try {
      const response = await apiInstance.post(`/emergency-contacts/verify/${contactId}`, { method })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get emergency contacts statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const response = await apiInstance.get('/emergency-contacts/statistics')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export const emergencyContactsApi = new EmergencyContactsApiImpl()
export type { IEmergencyContactsApi }
