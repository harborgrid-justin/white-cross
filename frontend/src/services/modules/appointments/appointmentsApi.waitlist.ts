/**
 * @fileoverview Appointments Waitlist API - Waitlist and reminder management
 * @module services/modules/appointments/appointmentsApi.waitlist
 * @category Services
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Migration example:
 * ```typescript
 * // OLD:
 * import { AppointmentsWaitlistApiImpl } from '@/services/modules/appointments/appointmentsApi.waitlist';
 * const api = new AppointmentsWaitlistApiImpl(client);
 * const { entry } = await api.addToWaitlist(data);
 *
 * // NEW (Server Component):
 * import { addToWaitlist } from '@/lib/actions/appointments.actions';
 * const entry = await addToWaitlist(data);
 *
 * // NEW (Client Component with React Query):
 * import { useMutation } from '@tanstack/react-query';
 * import { addToWaitlist } from '@/lib/actions/appointments.actions';
 * const mutation = useMutation({
 *   mutationFn: addToWaitlist,
 *   onSuccess: () => queryClient.invalidateQueries(['waitlist'])
 * });
 * ```
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Appointment waitlist and reminder management API providing waitlist operations,
 * reminder scheduling, and conflict detection.
 */

import type {
  AppointmentWaitlist,
  WaitlistFilters,
  WaitlistEntryData,
  AppointmentReminder,
  ReminderProcessingResult,
  ConflictCheckResult,
  NotificationDeliveryStatus
} from '@/types/domain/appointments'
import type { ApiClient } from '@/services/core/ApiClient'
import { extractApiData, handleApiError, buildUrlParams } from '@/services/utils/apiUtils'

/**
 * Appointments Waitlist API Interface
 * Defines waitlist and reminder operations
 */
export interface IAppointmentsWaitlistApi {
  /** Add student to appointment waitlist */
  addToWaitlist(data: {
    studentId: string;
    nurseId?: string;
    type: string;
    reason: string;
    priority?: string;
    preferredDate?: string;
    duration?: number;
    notes?: string;
  }): Promise<{ entry: AppointmentWaitlist }>;

  /** Get appointment waitlist */
  getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: AppointmentWaitlist[] }>;

  /** Remove student from waitlist */
  removeFromWaitlist(id: string, reason?: string): Promise<{ entry: AppointmentWaitlist }>;

  /** Add to waitlist with full entry data */
  addToWaitlistFull(data: WaitlistEntryData): Promise<{ entry: AppointmentWaitlist }>;

  /** Update waitlist entry priority */
  updateWaitlistPriority(id: string, priority: string): Promise<{ entry: AppointmentWaitlist }>;

  /** Get waitlist position for a student */
  getWaitlistPosition(waitlistEntryId: string): Promise<{ position: number; total: number }>;

  /** Notify waitlist entry when slot becomes available */
  notifyWaitlistEntry(id: string, message?: string): Promise<{ entry: AppointmentWaitlist; notification: NotificationDeliveryStatus }>;

  /** Process pending appointment reminders */
  processPendingReminders(): Promise<ReminderProcessingResult>;

  /** Get reminders for a specific appointment */
  getAppointmentReminders(appointmentId: string): Promise<{ reminders: AppointmentReminder[] }>;

  /** Schedule custom reminder for appointment */
  scheduleReminder(data: {
    appointmentId: string;
    type: string;
    scheduleTime: string;
    message?: string;
  }): Promise<{ reminder: AppointmentReminder }>;

  /** Cancel a scheduled reminder */
  cancelReminder(reminderId: string): Promise<{ reminder: AppointmentReminder }>;

  /** Check for scheduling conflicts */
  checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<ConflictCheckResult>;
}

/**
 * Appointments Waitlist API Implementation
 *
 * Handles waitlist management, reminder processing, and conflict detection.
 *
 * **API Endpoints**:
 * - POST /appointments/waitlist - Add to waitlist
 * - GET /appointments/waitlist - Get waitlist
 * - DELETE /appointments/waitlist/:id - Remove from waitlist
 * - PATCH /appointments/waitlist/:id - Update waitlist priority
 * - GET /appointments/waitlist/:id/position - Get waitlist position
 * - POST /appointments/waitlist/:id/notify - Notify waitlist entry
 * - POST /appointments/reminders/process - Process pending reminders
 * - GET /appointments/:id/reminders - Get appointment reminders
 * - POST /appointments/reminders - Schedule reminder
 * - DELETE /appointments/reminders/:id - Cancel reminder
 * - GET /appointments/conflicts - Check conflicts
 */
export class AppointmentsWaitlistApiImpl implements IAppointmentsWaitlistApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Add student to appointment waitlist
   *
   * @param data - Waitlist entry data
   * @returns Created waitlist entry
   * @throws {ValidationError} Invalid waitlist data
   * @throws {ConflictError} Student already on waitlist for this type
   *
   * @example
   * ```typescript
   * const { entry } = await waitlistApi.addToWaitlist({
   *   studentId: 'student-123',
   *   type: 'CHECKUP',
   *   reason: 'Annual health screening',
   *   priority: 'NORMAL'
   * });
   * ```
   */
  async addToWaitlist(data: {
    studentId: string;
    nurseId?: string;
    type: string;
    reason: string;
    priority?: string;
    preferredDate?: string;
    duration?: number;
    notes?: string;
  }): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.post('/appointments/waitlist', data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get appointment waitlist with optional filtering
   *
   * @param filters - Optional filters for waitlist query
   * @returns Waitlist entries ordered by priority
   * @throws {ValidationError} Invalid filter parameters
   *
   * @example
   * ```typescript
   * const { waitlist } = await waitlistApi.getWaitlist({ nurseId: 'nurse-456' });
   * ```
   */
  async getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: AppointmentWaitlist[] }> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get(`/appointments/waitlist${params}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Remove student from waitlist
   *
   * @param id - Waitlist entry UUID
   * @param reason - Optional reason for removal
   * @returns Updated waitlist entry with REMOVED status
   * @throws {NotFoundError} Waitlist entry not found
   */
  async removeFromWaitlist(id: string, reason?: string): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.delete(`/appointments/waitlist/${id}`, {
        data: { reason }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Add to waitlist with full entry data
   *
   * @param data - Complete waitlist entry data
   * @returns Created waitlist entry
   * @throws {ValidationError} Invalid waitlist data
   */
  async addToWaitlistFull(data: WaitlistEntryData): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.post('/appointments/waitlist', data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update waitlist entry priority
   *
   * @param id - Waitlist entry UUID
   * @param priority - New priority level
   * @returns Updated waitlist entry
   * @throws {NotFoundError} Waitlist entry not found
   * @throws {ValidationError} Invalid priority value
   */
  async updateWaitlistPriority(
    id: string,
    priority: string
  ): Promise<{ entry: AppointmentWaitlist }> {
    try {
      const response = await this.client.patch(`/appointments/waitlist/${id}`, { priority })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get waitlist position for a student
   *
   * @param waitlistEntryId - Waitlist entry UUID
   * @returns Position in queue and total entries
   * @throws {NotFoundError} Waitlist entry not found
   */
  async getWaitlistPosition(waitlistEntryId: string): Promise<{ position: number; total: number }> {
    try {
      const response = await this.client.get(`/appointments/waitlist/${waitlistEntryId}/position`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Notify waitlist entry when slot becomes available
   *
   * @param id - Waitlist entry UUID
   * @param message - Optional custom message
   * @returns Updated waitlist entry and notification status
   * @throws {NotFoundError} Waitlist entry not found
   */
  async notifyWaitlistEntry(
    id: string,
    message?: string
  ): Promise<{ entry: AppointmentWaitlist; notification: NotificationDeliveryStatus }> {
    try {
      const response = await this.client.post(`/appointments/waitlist/${id}/notify`, { message })
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Process pending appointment reminders with multi-channel delivery
   *
   * @returns Processing results with success/failure counts
   * @throws {ForbiddenError} Only admins and system jobs can process reminders
   *
   * @remarks
   * - Processes reminders scheduled within next 5 minutes
   * - Retries failed deliveries up to 3 times
   * - Runs every 5 minutes via cron job or manually
   */
  async processPendingReminders(): Promise<ReminderProcessingResult> {
    try {
      const response = await this.client.post('/appointments/reminders/process')
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get reminders for a specific appointment
   *
   * @param appointmentId - Appointment UUID
   * @returns List of scheduled reminders
   * @throws {NotFoundError} Appointment not found
   */
  async getAppointmentReminders(appointmentId: string): Promise<{ reminders: AppointmentReminder[] }> {
    try {
      const response = await this.client.get(`/appointments/${appointmentId}/reminders`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Schedule custom reminder for appointment
   *
   * @param data - Reminder data
   * @returns Created reminder
   * @throws {ValidationError} Invalid reminder data
   * @throws {NotFoundError} Appointment not found
   */
  async scheduleReminder(data: {
    appointmentId: string;
    type: string;
    scheduleTime: string;
    message?: string;
  }): Promise<{ reminder: AppointmentReminder }> {
    try {
      const response = await this.client.post('/appointments/reminders', data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Cancel a scheduled reminder
   *
   * @param reminderId - Reminder UUID
   * @returns Cancelled reminder
   * @throws {NotFoundError} Reminder not found
   * @throws {InvalidOperationError} Cannot cancel already-sent reminder
   */
  async cancelReminder(reminderId: string): Promise<{ reminder: AppointmentReminder }> {
    try {
      const response = await this.client.delete(`/appointments/reminders/${reminderId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Check for scheduling conflicts
   *
   * @param nurseId - Nurse UUID
   * @param startTime - Appointment start time (ISO 8601 datetime)
   * @param duration - Appointment duration in minutes
   * @param excludeAppointmentId - Optional appointment ID to exclude from check
   * @returns Conflict check result with conflicting appointments
   * @throws {ValidationError} Invalid parameters
   */
  async checkConflicts(
    nurseId: string,
    startTime: string,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<ConflictCheckResult> {
    try {
      const params = new URLSearchParams({
        nurseId,
        startTime,
        duration: String(duration)
      })
      if (excludeAppointmentId) {
        params.append('excludeAppointmentId', excludeAppointmentId)
      }

      const response = await this.client.get(`/appointments/conflicts?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }
}
