/**
 * @fileoverview Appointments Availability API - Scheduling and nurse availability
 * @module services/modules/appointments/appointmentsApi.availability
 * @category Services
 *
 * Appointment availability and nurse scheduling management API providing
 * slot availability checking, recurring appointments, and calendar operations.
 */

import type {
  Appointment,
  AppointmentStatistics,
  NurseAvailability,
  NurseAvailabilityData,
  RecurringAppointmentData,
  AvailabilitySlot
} from '@/types/domain/appointments'
import type { ApiClient } from '@/services/core/ApiClient'
import { extractApiData, handleApiError, buildUrlParams } from '@/services/utils/apiUtils'

/**
 * Appointments Availability API Interface
 * Defines availability and scheduling operations
 */
export interface IAppointmentsAvailabilityApi {
  /** Get available time slots for a nurse */
  getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }>;

  /** Get upcoming appointments for a nurse */
  getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }>;

  /** Get appointment statistics */
  getStatistics(filters?: {
    nurseId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<AppointmentStatistics>;

  /** Create recurring appointments */
  createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }>;

  /** Set nurse availability schedule */
  setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }>;

  /** Get nurse availability schedule */
  getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }>;

  /** Update nurse availability */
  updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }>;

  /** Delete nurse availability */
  deleteAvailability(id: string): Promise<void>;

  /** Export nurse calendar */
  exportCalendar(nurseId: string, dateFrom?: string, dateTo?: string): Promise<Blob>;
}

/**
 * Appointments Availability API Implementation
 *
 * Handles availability slot management, nurse scheduling, recurring appointments,
 * and calendar export functionality.
 *
 * **API Endpoints**:
 * - GET /appointments/availability/:nurseId - Get available slots
 * - GET /appointments/upcoming/:nurseId - Get upcoming appointments
 * - GET /appointments/statistics - Get appointment statistics
 * - POST /appointments/recurring - Create recurring appointments
 * - POST /appointments/availability - Set nurse availability
 * - GET /appointments/availability/nurse/:nurseId - Get nurse availability
 * - PUT /appointments/availability/:id - Update nurse availability
 * - DELETE /appointments/availability/:id - Delete nurse availability
 * - GET /appointments/calendar/:nurseId - Export calendar
 */
export class AppointmentsAvailabilityApiImpl implements IAppointmentsAvailabilityApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get available time slots for a nurse
   *
   * @param nurseId - Nurse UUID
   * @param date - Optional date filter (ISO 8601 date)
   * @param duration - Optional appointment duration in minutes
   * @returns Available time slots
   * @throws {NotFoundError} Nurse not found
   * @throws {ValidationError} Invalid date or duration
   *
   * @remarks
   * - Accounts for existing appointments and nurse availability
   * - Filters out slots that are too short for requested duration
   * - Only returns slots within nurse's working hours
   *
   * @example
   * ```typescript
   * const { slots } = await availabilityApi.getAvailability('nurse-456', '2025-01-15', 30);
   * ```
   */
  async getAvailability(nurseId: string, date?: string, duration?: number): Promise<{ slots: AvailabilitySlot[] }> {
    try {
      const params = new URLSearchParams()
      if (date) params.append('date', date)
      if (duration) params.append('duration', String(duration))

      const response = await this.client.get(`/appointments/availability/${nurseId}?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get upcoming appointments for a nurse
   *
   * @param nurseId - Nurse UUID
   * @param limit - Optional limit on number of results (default: 10)
   * @returns List of upcoming appointments
   * @throws {NotFoundError} Nurse not found
   *
   * @remarks
   * - Returns appointments scheduled in the future
   * - Ordered by scheduled time ascending
   * - Excludes cancelled appointments
   *
   * @example
   * ```typescript
   * const { appointments } = await availabilityApi.getUpcoming('nurse-456', 20);
   * ```
   */
  async getUpcoming(nurseId: string, limit?: number): Promise<{ appointments: Appointment[] }> {
    try {
      const params = limit ? `?limit=${limit}` : ''
      const response = await this.client.get(`/appointments/upcoming/${nurseId}${params}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get appointment statistics
   *
   * @param filters - Optional filters for statistics query
   * @returns Appointment statistics (total, by status, by type, rates)
   * @throws {ValidationError} Invalid filter parameters
   *
   * @remarks
   * - Aggregates data for specified time range and nurse
   * - Calculates no-show rate and completion rate
   * - Groups by status and type
   *
   * @example
   * ```typescript
   * const stats = await availabilityApi.getStatistics({
   *   nurseId: 'nurse-456',
   *   dateFrom: '2025-01-01',
   *   dateTo: '2025-01-31'
   * });
   * ```
   */
  async getStatistics(filters?: {
    nurseId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<AppointmentStatistics> {
    try {
      const params = filters ? `?${buildUrlParams(filters).toString()}` : ''
      const response = await this.client.get(`/appointments/statistics${params}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Create recurring appointments
   *
   * @param data - Recurring appointment data including recurrence pattern
   * @returns Created appointments and count
   * @throws {ValidationError} Invalid recurring pattern or appointment data
   * @throws {ConflictError} One or more slots unavailable
   *
   * @remarks
   * - Creates multiple appointments based on recurrence pattern
   * - Validates availability for each occurrence
   * - Skips occurrences that conflict with existing appointments
   * - Returns all successfully created appointments
   *
   * @example
   * ```typescript
   * const { appointments, count } = await availabilityApi.createRecurring({
   *   studentId: 'student-123',
   *   nurseId: 'nurse-456',
   *   type: 'MEDICATION',
   *   scheduledAt: '2025-01-15T10:00:00Z',
   *   duration: 15,
   *   reason: 'Daily medication administration',
   *   recurrence: {
   *     frequency: 'DAILY',
   *     interval: 1,
   *     endDate: '2025-02-15'
   *   }
   * });
   * ```
   */
  async createRecurring(data: RecurringAppointmentData): Promise<{ appointments: Appointment[]; count: number }> {
    try {
      const response = await this.client.post('/appointments/recurring', data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Set nurse availability schedule
   *
   * @param data - Nurse availability data
   * @returns Created availability record
   * @throws {ValidationError} Invalid availability data
   * @throws {ForbiddenError} User lacks permission to set availability
   *
   * @remarks
   * - Can create recurring or one-time availability
   * - Validates time ranges are valid
   * - Updates nurse's calendar
   *
   * @example
   * ```typescript
   * const { availability } = await availabilityApi.setAvailability({
   *   nurseId: 'nurse-456',
   *   dayOfWeek: 1, // Monday
   *   startTime: '08:00',
   *   endTime: '16:00',
   *   isRecurring: true,
   *   isAvailable: true
   * });
   * ```
   */
  async setAvailability(data: NurseAvailabilityData): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await this.client.post('/appointments/availability', data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get nurse availability schedule
   *
   * @param nurseId - Nurse UUID
   * @param date - Optional date filter (ISO 8601 date)
   * @returns Nurse availability records
   * @throws {NotFoundError} Nurse not found
   *
   * @remarks
   * - Returns both recurring and one-time availability
   * - If date provided, filters to relevant availability for that date
   * - Ordered by day of week and start time
   *
   * @example
   * ```typescript
   * const { availability } = await availabilityApi.getNurseAvailability('nurse-456', '2025-01-15');
   * ```
   */
  async getNurseAvailability(nurseId: string, date?: string): Promise<{ availability: NurseAvailability[] }> {
    try {
      const params = date ? `?date=${date}` : ''
      const response = await this.client.get(`/appointments/availability/nurse/${nurseId}${params}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Update nurse availability
   *
   * @param id - Availability record UUID
   * @param data - Fields to update
   * @returns Updated availability record
   * @throws {NotFoundError} Availability record not found
   * @throws {ValidationError} Invalid update data
   * @throws {ForbiddenError} User lacks permission to update availability
   *
   * @example
   * ```typescript
   * const { availability } = await availabilityApi.updateAvailability('avail-123', {
   *   endTime: '17:00'
   * });
   * ```
   */
  async updateAvailability(id: string, data: Partial<NurseAvailabilityData>): Promise<{ availability: NurseAvailability }> {
    try {
      const response = await this.client.put(`/appointments/availability/${id}`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Delete nurse availability
   *
   * @param id - Availability record UUID
   * @throws {NotFoundError} Availability record not found
   * @throws {ForbiddenError} User lacks permission to delete availability
   *
   * @remarks
   * - Soft delete - marks as deleted but preserves record
   * - Does not affect existing appointments
   *
   * @example
   * ```typescript
   * await availabilityApi.deleteAvailability('avail-123');
   * ```
   */
  async deleteAvailability(id: string): Promise<void> {
    try {
      await this.client.delete(`/appointments/availability/${id}`)
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Export nurse calendar in iCal format
   *
   * @param nurseId - Nurse UUID
   * @param dateFrom - Optional start date (ISO 8601 date)
   * @param dateTo - Optional end date (ISO 8601 date)
   * @returns Calendar file as Blob
   * @throws {NotFoundError} Nurse not found
   *
   * @remarks
   * - Exports appointments as iCal format
   * - Can be imported into Google Calendar, Outlook, etc.
   * - Excludes cancelled appointments
   * - If date range not provided, exports next 30 days
   *
   * @example
   * ```typescript
   * const calendar = await availabilityApi.exportCalendar('nurse-456', '2025-01-01', '2025-01-31');
   * const url = URL.createObjectURL(calendar);
   * const a = document.createElement('a');
   * a.href = url;
   * a.download = 'appointments.ics';
   * a.click();
   * ```
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
      throw handleApiError(error as Error)
    }
  }
}
