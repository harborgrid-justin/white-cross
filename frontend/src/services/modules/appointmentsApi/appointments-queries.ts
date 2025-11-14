/**
 * Appointments API - Query and Filtering Operations
 *
 * Handles appointment listing, filtering, date range queries, and
 * specialized query operations for appointments.
 *
 * @module services/modules/appointmentsApi/appointments-queries
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  AppointmentFilters,
  AppointmentStatus
} from './types';
import {
  appointmentFiltersSchema,
  getValidationErrors
} from './validation';
import { AppointmentServiceBase } from './appointments-shared';

/**
 * Appointment query and filtering service
 */
export class AppointmentsQueryService extends AppointmentServiceBase {
  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Get appointments with filtering and pagination
   *
   * @param filters - Filter criteria
   * @returns Promise resolving to paginated appointment list
   */
  async getAppointments(filters: AppointmentFilters = {}) {
    // Validate filters
    const validationResult = appointmentFiltersSchema.safeParse(filters);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Invalid filters', 'VALIDATION_ERROR', { errors });
    }

    const validatedFilters = validationResult.data;

    try {
      const queryParams = new URLSearchParams();
      Object.entries(validatedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const url = `${this.endpoint}${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;
      const response = await this.client.get<{
        data: Appointment[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        filters: AppointmentFilters;
      }>(url);

      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointments');
      throw error;
    }
  }

  /**
   * Get appointments for a specific date range
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param nurseId - Optional nurse filter
   * @returns Promise resolving to appointments in date range
   */
  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
    nurseId?: string
  ): Promise<Appointment[]> {
    const filters: AppointmentFilters = {
      startDate,
      endDate,
      nurseId,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
      limit: 1000 // Large limit for calendar views
    };

    const result = await this.getAppointments(filters);
    return result.data;
  }

  /**
   * Get today's appointments for a nurse
   *
   * @param nurseId - Nurse ID
   * @returns Promise resolving to today's appointments
   */
  async getTodaysAppointments(nurseId: string): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    return this.getAppointmentsByDateRange(today, today, nurseId);
  }

  /**
   * Get upcoming appointments for a student
   *
   * @param studentId - Student ID
   * @param limit - Number of appointments to return
   * @returns Promise resolving to upcoming appointments
   */
  async getUpcomingAppointments(
    studentId: string,
    limit = 5
  ): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0];

    const filters: AppointmentFilters = {
      studentId,
      startDate: today,
      endDate,
      status: AppointmentStatus.SCHEDULED,
      sortBy: 'scheduledAt',
      sortOrder: 'asc',
      limit
    };

    const result = await this.getAppointments(filters);
    return result.data;
  }
}

/**
 * Factory function to create AppointmentsQueryService
 */
export function createAppointmentsQueryService(
  client: ApiClient
): AppointmentsQueryService {
  return new AppointmentsQueryService(client);
}
