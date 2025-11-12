/**
 * @fileoverview Appointments Analytics API - Statistics, reporting, and bulk operations
 * @module services/modules/appointments/appointmentsApi.analytics
 * @category Services
 *
 * Appointment analytics and reporting API providing statistics, trends,
 * bulk operations, and advanced filtering capabilities.
 */

import type {
  Appointment,
  AppointmentFilters,
  TrendDataPoint,
  StudentNoShowStat,
  DailyUtilizationStat
} from '@/types/domain/appointments'
import type { PaginatedResponse } from '@/types/common'
import type { ApiClient } from '@/services/core/ApiClient'
import { extractApiData, handleApiError, buildUrlParams } from '@/services/utils/apiUtils'

/**
 * Appointments Analytics API Interface
 * Defines analytics, reporting, and bulk operations
 */
export interface IAppointmentsAnalyticsApi {
  /** Cancel multiple appointments */
  cancelMultiple(appointmentIds: string[], reason?: string): Promise<{ cancelled: number; failed: number }>;

  /** Get appointments for multiple students */
  getForStudents(studentIds: string[], filters?: Partial<AppointmentFilters>): Promise<{ appointments: Appointment[] }>;

  /** Get appointments by date range */
  getByDateRange(dateFrom: string, dateTo: string, nurseId?: string): Promise<{ appointments: Appointment[] }>;

  /** Search appointments */
  search(query: string, filters?: Partial<AppointmentFilters>): Promise<PaginatedResponse<Appointment>>;

  /** Get appointment trends over time */
  getTrends(dateFrom: string, dateTo: string, groupBy?: 'day' | 'week' | 'month'): Promise<{ trends: TrendDataPoint[] }>;

  /** Get no-show rate statistics */
  getNoShowStats(nurseId?: string, dateFrom?: string, dateTo?: string): Promise<{
    rate: number;
    total: number;
    noShows: number;
    byStudent: StudentNoShowStat[];
  }>;

  /** Get utilization statistics */
  getUtilizationStats(nurseId: string, dateFrom: string, dateTo: string): Promise<{
    utilizationRate: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    byDay: DailyUtilizationStat[];
  }>;
}

/**
 * Appointments Analytics API Implementation
 *
 * Handles analytics, statistics, bulk operations, and advanced filtering
 * for appointment data.
 *
 * **API Endpoints**:
 * - POST /appointments/bulk/cancel - Cancel multiple appointments
 * - GET /appointments/students - Get appointments for multiple students
 * - GET /appointments/range - Get appointments by date range
 * - GET /appointments/search - Search appointments
 * - GET /appointments/trends - Get appointment trends
 * - GET /appointments/stats/no-show - Get no-show statistics
 * - GET /appointments/stats/utilization - Get utilization statistics
 */
export class AppointmentsAnalyticsApiImpl implements IAppointmentsAnalyticsApi {
  constructor(private readonly client: ApiClient) {}

  /**
   * Cancel multiple appointments in bulk
   *
   * @param appointmentIds - Array of appointment UUIDs to cancel
   * @param reason - Optional cancellation reason
   * @returns Count of cancelled and failed cancellations
   * @throws {ValidationError} Invalid appointment IDs
   * @throws {ForbiddenError} User lacks permission to cancel appointments
   *
   * @remarks
   * - Processes cancellations in parallel
   * - Returns partial success if some fail
   * - Each cancellation triggers normal cancellation workflow
   * - Notifications sent for each cancelled appointment
   *
   * @example
   * ```typescript
   * const { cancelled, failed } = await analyticsApi.cancelMultiple(
   *   ['appt-1', 'appt-2', 'appt-3'],
   *   'School closure due to weather'
   * );
   * ```
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
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get appointments for multiple students
   *
   * @param studentIds - Array of student UUIDs
   * @param filters - Optional additional filters
   * @returns Appointments for specified students
   * @throws {ValidationError} Invalid student IDs or filters
   *
   * @remarks
   * - Useful for parent views showing multiple children
   * - Supports additional filtering by date, status, type
   * - Orders by scheduled date descending
   *
   * @example
   * ```typescript
   * const { appointments } = await analyticsApi.getForStudents(
   *   ['student-1', 'student-2'],
   *   { status: 'SCHEDULED', dateFrom: '2025-01-01' }
   * );
   * ```
   */
  async getForStudents(
    studentIds: string[],
    filters?: Partial<AppointmentFilters>
  ): Promise<{ appointments: Appointment[] }> {
    try {
      const params = buildUrlParams({ ...filters, studentIds: studentIds.join(',') })
      const response = await this.client.get(`/appointments/students?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get appointments by date range
   *
   * @param dateFrom - Start date (ISO 8601 date)
   * @param dateTo - End date (ISO 8601 date)
   * @param nurseId - Optional nurse filter
   * @returns Appointments within date range
   * @throws {ValidationError} Invalid date range
   *
   * @example
   * ```typescript
   * const { appointments } = await analyticsApi.getByDateRange(
   *   '2025-01-01',
   *   '2025-01-31',
   *   'nurse-456'
   * );
   * ```
   */
  async getByDateRange(
    dateFrom: string,
    dateTo: string,
    nurseId?: string
  ): Promise<{ appointments: Appointment[] }> {
    try {
      const params = buildUrlParams({ dateFrom, dateTo, nurseId })
      const response = await this.client.get(`/appointments/range?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Search appointments by query string
   *
   * @param query - Search query (student name, reason, notes)
   * @param filters - Optional additional filters
   * @returns Paginated search results
   * @throws {ValidationError} Invalid query or filters
   *
   * @remarks
   * - Searches across student name, appointment reason, and notes
   * - Supports fuzzy matching
   * - Respects RBAC permissions
   *
   * @example
   * ```typescript
   * const results = await analyticsApi.search('flu vaccine', {
   *   status: 'COMPLETED',
   *   dateFrom: '2025-01-01'
   * });
   * ```
   */
  async search(query: string, filters?: Partial<AppointmentFilters>): Promise<PaginatedResponse<Appointment>> {
    try {
      const params = buildUrlParams({ ...filters, search: query })
      const response = await this.client.get(`/appointments/search?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get appointment trends over time
   *
   * @param dateFrom - Start date (ISO 8601 date)
   * @param dateTo - End date (ISO 8601 date)
   * @param groupBy - Grouping interval (default: 'day')
   * @returns Trend data points with counts by date
   * @throws {ValidationError} Invalid date range or groupBy value
   *
   * @remarks
   * - Groups appointments by specified interval
   * - Returns count of appointments per time period
   * - Useful for visualizing appointment volume over time
   *
   * @example
   * ```typescript
   * const { trends } = await analyticsApi.getTrends(
   *   '2025-01-01',
   *   '2025-01-31',
   *   'day'
   * );
   * ```
   */
  async getTrends(
    dateFrom: string,
    dateTo: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<{ trends: TrendDataPoint[] }> {
    try {
      const params = new URLSearchParams({ dateFrom, dateTo, groupBy })
      const response = await this.client.get(`/appointments/trends?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get no-show rate statistics
   *
   * @param nurseId - Optional nurse filter
   * @param dateFrom - Optional start date (ISO 8601 date)
   * @param dateTo - Optional end date (ISO 8601 date)
   * @returns No-show statistics with breakdown by student
   * @throws {ValidationError} Invalid parameters
   *
   * @remarks
   * - Calculates percentage of appointments marked as no-show
   * - Provides breakdown by student to identify patterns
   * - Useful for identifying students needing follow-up
   *
   * @example
   * ```typescript
   * const stats = await analyticsApi.getNoShowStats(
   *   'nurse-456',
   *   '2025-01-01',
   *   '2025-01-31'
   * );
   * console.log(`No-show rate: ${stats.rate}%`);
   * console.log(`Students with high no-show rate:`, stats.byStudent.filter(s => s.rate > 20));
   * ```
   */
  async getNoShowStats(
    nurseId?: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    rate: number;
    total: number;
    noShows: number;
    byStudent: StudentNoShowStat[];
  }> {
    try {
      const params = buildUrlParams({ nurseId, dateFrom, dateTo })
      const response = await this.client.get(`/appointments/stats/no-show?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }

  /**
   * Get utilization statistics
   *
   * @param nurseId - Nurse UUID
   * @param dateFrom - Start date (ISO 8601 date)
   * @param dateTo - End date (ISO 8601 date)
   * @returns Utilization statistics with daily breakdown
   * @throws {ValidationError} Invalid parameters
   * @throws {NotFoundError} Nurse not found
   *
   * @remarks
   * - Calculates percentage of available slots that were booked
   * - Provides daily breakdown for detailed analysis
   * - Helps optimize nurse scheduling and capacity planning
   *
   * @example
   * ```typescript
   * const stats = await analyticsApi.getUtilizationStats(
   *   'nurse-456',
   *   '2025-01-01',
   *   '2025-01-31'
   * );
   * console.log(`Overall utilization: ${stats.utilizationRate}%`);
   * console.log(`Total slots: ${stats.totalSlots}, Booked: ${stats.bookedSlots}`);
   * ```
   */
  async getUtilizationStats(
    nurseId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<{
    utilizationRate: number;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
    byDay: DailyUtilizationStat[];
  }> {
    try {
      const params = new URLSearchParams({ nurseId, dateFrom, dateTo })
      const response = await this.client.get(`/appointments/stats/utilization?${params.toString()}`)
      return response.data
    } catch (error) {
      throw handleApiError(error as Error)
    }
  }
}
