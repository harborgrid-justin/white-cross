/**
 * @fileoverview Emergency Contacts API Service
 * @module services/modules/emergencyContactsApi
 * @category Services - Student Management
 *
 * @deprecated MIGRATION PENDING - Server actions partially available
 * Emergency contact operations are likely part of students.actions.ts module.
 * This service may be merged with student management in future updates.
 *
 * MIGRATION STATUS:
 * - Student-related emergency contacts -> Already in students.actions.ts
 * - Standalone emergency contact ops -> Continue using this service
 * - Migration target: Q2 2026 (consolidated into students or contacts module)
 * - Current recommendation: Continue using this API service
 *
 * WF-COMP-277 | Emergency Contacts API implementation
 * Handles emergency contact management and notifications aligned with backend EmergencyContactService
 */

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
import type { ApiClient } from '../core/ApiClient';
import { apiClient } from '../core'; // Updated: Import from new centralized core
import { extractApiData, handleApiError } from '../utils/apiUtils'

/**
 * Emergency Contacts API implementation
 * Handles emergency contact management and notifications
 * Aligned with backend EmergencyContactService
 */
class EmergencyContactsApiImpl implements IEmergencyContactsApi {
  constructor(private readonly client: ApiClient) {}
  /**
   * Get emergency contacts for a student
   */
  async getByStudent(studentId: string): Promise<{ contacts: EmergencyContact[] }> {
    try {
      const response = await this.client.get(`/emergency-contacts/student/${studentId}`)
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
      const response = await this.client.post('/emergency-contacts', data)
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
      const response = await this.client.put(`/emergency-contacts/${id}`, data)
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
      const response = await this.client.delete(`/emergency-contacts/${id}`)
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
      const response = await this.client.post(
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
      const response = await this.client.post(
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
      const response = await this.client.post(
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
      const response = await this.client.get('/emergency-contacts/statistics')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

export function createEmergencyContactsApi(client: ApiClient): IEmergencyContactsApi {
  return new EmergencyContactsApiImpl(client);
}

/**
 * Singleton instance of EmergencyContactsApi
 * Pre-configured with the default apiClient from core services
 *
 * @deprecated Server actions migration pending. Emergency contact operations
 * are likely already available in students.actions.ts. Review students module
 * before using this service for new implementations.
 *
 * Recommendation: For student-related emergency contacts, prefer students.actions.ts
 */
export const emergencyContactsApi = createEmergencyContactsApi(apiClient);

export type { IEmergencyContactsApi }
