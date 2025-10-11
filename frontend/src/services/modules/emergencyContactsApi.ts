import type { IEmergencyContactsApi } from '../types'
import type {
  EmergencyContact,
  EmergencyNotificationData,
  EmergencyNotificationResult,
  ContactVerificationResponse,
  EmergencyContactStatistics
} from '../../types/student.types'

// API request types (more flexible than domain types)
export interface CreateEmergencyContactData {
  studentId: string
  firstName: string
  lastName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  priority: string
  preferredContactMethod?: string
  notificationChannels?: ('sms' | 'email' | 'voice')[]
  canPickupStudent?: boolean
  notes?: string
}

export interface UpdateEmergencyContactData {
  firstName?: string
  lastName?: string
  relationship?: string
  phoneNumber?: string
  email?: string
  address?: string
  priority?: string
  isActive?: boolean
  preferredContactMethod?: string
  verificationStatus?: string
  notificationChannels?: ('sms' | 'email' | 'voice')[]
  canPickupStudent?: boolean
  notes?: string
}
import { apiInstance } from '../config/apiConfig'
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Emergency Contacts API implementation
 * Handles emergency contact management and notifications
 * Aligned with backend EmergencyContactService
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
  async create(data: CreateEmergencyContactData): Promise<{ contact: EmergencyContact }> {
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
  async update(id: string, data: UpdateEmergencyContactData): Promise<{ contact: EmergencyContact }> {
    try {
      const response = await apiInstance.put(`/emergency-contacts/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete an emergency contact (soft delete)
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
   * Send emergency notification to all contacts for a student
   */
  async notifyStudent(
    studentId: string,
    notification: Omit<EmergencyNotificationData, 'studentId'>
  ): Promise<{ results: EmergencyNotificationResult[] }> {
    try {
      const response = await apiInstance.post(
        `/emergency-contacts/notify/${studentId}`,
        notification
      )
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Send notification to specific contact
   */
  async notifyContact(
    contactId: string,
    notification: Omit<EmergencyNotificationData, 'studentId'>
  ): Promise<{ result: EmergencyNotificationResult }> {
    try {
      const response = await apiInstance.post(
        `/emergency-contacts/notify/contact/${contactId}`,
        notification
      )
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Verify emergency contact information
   */
  async verify(
    contactId: string,
    method: 'sms' | 'email' | 'voice'
  ): Promise<ContactVerificationResponse> {
    try {
      const response = await apiInstance.post(
        `/emergency-contacts/verify/${contactId}`,
        { method }
      )
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get emergency contacts statistics
   */
  async getStatistics(): Promise<EmergencyContactStatistics> {
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
