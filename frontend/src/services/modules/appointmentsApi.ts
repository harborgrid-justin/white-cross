/**
 * @fileoverview Appointments API service for scheduling and availability management
 * @module services/modules/appointmentsApi
 * @category Services
 * 
 * Comprehensive appointment management API including scheduling, availability
 * tracking, waitlist management, and reminder processing for healthcare appointments.
 * 
 * Key Features:
 * - Appointment CRUD operations
 * - Availability slot management
 * - Waitlist functionality
 * - Recurring appointment scheduling
 * - Conflict detection and resolution
 * - Appointment reminders (email/SMS)
 * - Statistics and reporting
 * - Nurse availability management
 * 
 * Healthcare-Specific:
 * - PHI protection in all appointment data
 * - HIPAA-compliant logging
 * - Student-nurse appointment relationships
 * - Emergency appointment prioritization
 * - Parent notification integration
 * 
 * Scheduling Features:
 * - Single and recurring appointments
 * - Availability slot checking
 * - Conflict detection
 * - Waitlist with priority ordering
 * - Automated reminder processing
 * - Calendar integration
 * 
 * @example
 * ```typescript
 * // Create appointment
 * const { appointment } = await appointmentsApi.create({
 *   studentId: 'student-123',
 *   nurseId: 'nurse-456',
 *   type: 'CHECKUP',
 *   scheduledAt: '2025-01-15T10:00:00Z',
 *   duration: 30,
 *   reason: 'Annual checkup',
 *   priority: 'NORMAL'
 * });
 * 
 * // Get available slots
 * const slots = await appointmentsApi.getAvailability({
 *   nurseId: 'nurse-456',
 *   startDate: '2025-01-15',
 *   endDate: '2025-01-15',
 *   duration: 30
 * });
 * 
 * // Add to waitlist
 * const entry = await appointmentsApi.addToWaitlist({
 *   studentId: 'student-123',
 *   appointmentType: 'CHECKUP',
 *   preferredDate: '2025-01-15',
 *   priority: 'HIGH'
 * });
 * 
 * // Process reminders
 * const result = await appointmentsApi.processReminders({
 *   hoursAhead: 24,
 *   batchSize: 50
 * });
 * ```
 */

import type { IAppointmentsApi } from '../types'
import type {
  Appointment,
  AppointmentFilters,
  AppointmentCreateData,
  AppointmentUpdateData,
  AppointmentStatistics,
  NurseAvailability,
  NurseAvailabilityData,
  WaitlistEntry,
  WaitlistFilters,
  RecurringAppointmentData,
  AvailabilitySlot,
  PaginatedResponse
} from '../types'
import type {
  ReminderProcessingResult,
  ConflictCheckResult,
  AppointmentReminder,
  WaitlistEntryData
} from '../../types/appointments'
import type { ApiClient } from '../core/ApiClient'
import { extractApiData, handleApiError, buildUrlParams } from '../utils/apiUtils'

/**
 * Appointments API implementation
 * 
 * @class
 * @implements {IAppointmentsApi}
 * @classdesc Handles appointment scheduling, availability management, waitlist
 * functionality, and reminder processing for healthcare appointments.
 * 
 * API Endpoints:
 * - GET /appointments - List appointments with filters
 * - POST /appointments - Create new appointment
 * - PUT /appointments/:id - Update appointment
 * - DELETE /appointments/:id - Cancel appointment
 * - GET /appointments/availability - Check available slots
 * - POST /appointments/waitlist - Add to waitlist
 * - POST /appointments/reminders - Process reminders
 * 
 * PHI Considerations:
 * - All appointment data contains PHI (student info, medical reason)
 * - Audit logging required for all operations
 * - Access control enforced by backend
 * - No PHI in query parameters (use POST body)
 * 
 * @example
 * ```typescript
 * const appointmentsApi = new AppointmentsApiImpl();
 * 
 * // List today's appointments
 * const { data, pagination } = await appointmentsApi.getAll({
 *   startDate: '2025-01-15',
 *   endDate: '2025-01-15',
 *   status: 'SCHEDULED'
 * });
 * ```
 */
class AppointmentsApiImpl implements IAppointmentsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get all appointments with optional filtering
   */
  async getAll(filters?: AppointmentFilters): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get<PaginatedResponse<Appointment>>(`/appointments${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create a new appointment
   */
  async create(appointmentData: AppointmentCreateData): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.post<{ appointment: Appointment }>('/appointments', appointmentData)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update an existing appointment
   */
  async update(id: string, data: AppointmentUpdateData): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Cancel an appointment
   */
  async cancel(id: string, reason?: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/cancel`, { reason })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Mark appointment as no-show
   */
  async markNoShow(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/no-show`, {})
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get available time slots for a nurse
   */
  async getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }> {
    try {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (duration) params.append('duration', String(duration))
      
      const response = await this.client.get(`/appointments/availability/${nurseId}?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get upcoming appointments for a nurse
   */
  async getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }> {
    try {
      const params = limit ? `?limit=${limit}` : ''
      const response = await this.client.get(`/appointments/upcoming/${nurseId}${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointment statistics
   */
  async getStatistics(filters?: {
    nurseId?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AppointmentStatistics> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get(`/appointments/statistics${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Create recurring appointments
   */
  async createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }> {
    try {
      const response = await this.client.post('/appointments/recurring', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Nurse Availability Management
  /**
   * Set nurse availability
   */
  async setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await this.client.post('/appointments/availability', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get nurse availability schedule
   */
  async getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }> {
    try {
      const params = date ? `?date=${date}` : ''
      const response = await this.client.get(`/appointments/availability/nurse/${nurseId}${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update nurse availability
   */
  async updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await this.client.put(`/appointments/availability/${id}`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Delete nurse availability
   */
  async deleteAvailability(id: string): Promise<void> {
    try {
      await this.client.delete(`/appointments/availability/${id}`)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Waitlist Management
  /**
   * Add student to appointment waitlist
   */
  async addToWaitlist(data: {
    studentId: string
    nurseId?: string
    type: string
    reason: string
    priority?: string
    preferredDate?: string
    duration?: number
    notes?: string
  }): Promise<{ entry: WaitlistEntry }> {
    try {
      const response = await this.client.post('/appointments/waitlist', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointment waitlist
   */
  async getWaitlist(filters?: WaitlistFilters): Promise<{ waitlist: WaitlistEntry[] }> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get(`/appointments/waitlist${params}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Remove student from waitlist
   */
  async removeFromWaitlist(id: string, reason?: string): Promise<{ entry: WaitlistEntry }> {
    try {
      const response = await this.client.delete(`/appointments/waitlist/${id}`, {
        data: { reason }
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Calendar Export
  /**
   * Export nurse calendar
   */
  async exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob> {
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)

      const response = await this.client.get(`/appointments/calendar/${nurseId}?${params.toString()}`, {
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Reminder Management
  /**
   * Process pending reminders
   * Processes all reminders that are due to be sent
   */
  async processPendingReminders(): Promise<ReminderProcessingResult> {
    try {
      const response = await this.client.post('/appointments/reminders/process')
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get reminders for a specific appointment
   */
  async getAppointmentReminders(appointmentId: string): Promise<{ reminders: AppointmentReminder[] }> {
    try {
      const response = await this.client.get(`/appointments/${appointmentId}/reminders`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Schedule custom reminder for appointment
   */
  async scheduleReminder(data: {
    appointmentId: string
    type: string
    scheduleTime: string
    message?: string
  }): Promise<{ reminder: AppointmentReminder }> {
    try {
      const response = await this.client.post('/appointments/reminders', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Cancel a scheduled reminder
   */
  async cancelReminder(reminderId: string): Promise<{ reminder: AppointmentReminder }> {
    try {
      const response = await this.client.delete(`/appointments/reminders/${reminderId}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Conflict Detection
  /**
   * Check for scheduling conflicts
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
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Enhanced Waitlist Management
  /**
   * Add to waitlist with full entry data
   */
  async addToWaitlistFull(data: WaitlistEntryData): Promise<{ entry: WaitlistEntry }> {
    try {
      const response = await this.client.post('/appointments/waitlist', data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Update waitlist entry priority
   */
  async updateWaitlistPriority(
    id: string,
    priority: string
  ): Promise<{ entry: WaitlistEntry }> {
    try {
      const response = await this.client.patch(`/appointments/waitlist/${id}`, { priority })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get waitlist position for a student
   */
  async getWaitlistPosition(waitlistEntryId: string): Promise<{ position: number; total: number }> {
    try {
      const response = await this.client.get(`/appointments/waitlist/${waitlistEntryId}/position`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Notify waitlist entry when slot becomes available
   */
  async notifyWaitlistEntry(
    id: string,
    message?: string
  ): Promise<{ entry: WaitlistEntry; notification: any }> {
    try {
      const response = await this.client.post(`/appointments/waitlist/${id}/notify`, { message })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Appointment Details
  /**
   * Get single appointment by ID
   */
  async getById(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.get(`/appointments/${id}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Complete appointment
   */
  async complete(id: string, data?: {
    notes?: string
    outcomes?: string
    followUpRequired?: boolean
    followUpDate?: string
  }): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/complete`, data)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Start appointment (mark as in progress)
   */
  async start(id: string): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/start`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Reschedule appointment
   */
  async reschedule(
    id: string,
    newScheduledAt: string,
    reason?: string
  ): Promise<{ appointment: Appointment }> {
    try {
      const response = await this.client.put(`/appointments/${id}/reschedule`, {
        scheduledAt: newScheduledAt,
        reason
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Bulk Operations
  /**
   * Cancel multiple appointments
   */
  async cancelMultiple(
    appointmentIds: string[],
    reason?: string
  ): Promise<{ cancelled: number; failed: number }> {
    try {
      const response = await this.client.post('/appointments/bulk/cancel', {
        appointmentIds,
        reason
      })
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get appointments for multiple students
   */
  async getForStudents(
    studentIds: string[],
    filters?: Partial<AppointmentFilters>
  ): Promise<{ appointments: Appointment[] }> {
    try {
      const params = buildUrlParams({ ...filters, studentIds: studentIds.join(',') })
      const response = await this.client.get(`/appointments/students?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Advanced Filtering
  /**
   * Get appointments by date range
   */
  async getByDateRange(
    dateFrom: string,
    dateTo: string,
    nurseId?: string
  ): Promise<{ appointments: Appointment[] }> {
    try {
      const params = buildUrlParams({ dateFrom, dateTo, nurseId })
      const response = await this.client.get(`/appointments/range?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Search appointments
   */
  async search(query: string, filters?: Partial<AppointmentFilters>): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = buildUrlParams({ ...filters, search: query })
      const response = await this.client.get(`/appointments/search?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  // Analytics
  /**
   * Get appointment trends over time
   */
  async getTrends(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{ trends: any[] }> {
    try {
      const params = new URLSearchParams({ dateFrom, dateTo, groupBy })
      const response = await this.client.get(`/appointments/trends?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get no-show rate statistics
   */
  async getNoShowStats(
    nurseId?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    rate: number
    total: number
    noShows: number
    byStudent: any[]
  }> {
    try {
      const params = buildUrlParams({ nurseId, dateFrom, dateTo })
      const response = await this.client.get(`/appointments/stats/no-show?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }

  /**
   * Get utilization statistics
   */
  async getUtilizationStats(
    nurseId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<{
    utilizationRate: number
    totalSlots: number
    bookedSlots: number
    availableSlots: number
    byDay: any[]
  }> {
    try {
      const params = new URLSearchParams({ nurseId, dateFrom, dateTo })
      const response = await this.client.get(`/appointments/stats/utilization?${params.toString()}`)
      return extractApiData(response)
    } catch (error) {
      throw handleApiError(error as any)
    }
  }
}

/**
 * Factory function to create Appointments API instance
 * @param client - ApiClient instance with authentication and resilience patterns
 * @returns Configured AppointmentsApiImpl instance
 */
export function createAppointmentsApi(client: ApiClient): AppointmentsApiImpl {
  return new AppointmentsApiImpl(client);
}

export { AppointmentsApiImpl }
export type { IAppointmentsApi }
