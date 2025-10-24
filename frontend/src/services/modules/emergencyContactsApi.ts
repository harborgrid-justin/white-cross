/**
 * WF-COMP-277 | emergencyContactsApi.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: ../config/apiConfig, ../utils/apiUtils
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, types | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
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
import { apiClient } from '../core/ApiClient';
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
 * Pre-configured with the default apiClient
 */
export const emergencyContactsApi = createEmergencyContactsApi(apiClient);

export type { IEmergencyContactsApi }
