/**
 * Appointments API - Advanced Operations
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Handles bulk operations, recurring appointments, and calendar integration
 * for appointment management.
 *
 * @module services/modules/appointmentsApi/appointments-operations
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  RecurringAppointmentData,
  AppointmentCalendarEvent,
  AppointmentType
} from './types';
import {
  recurringAppointmentSchema,
  bulkCancelSchema,
  getValidationErrors
} from './validation';
import { AppointmentServiceBase, BulkOperationResult } from './appointments-shared';

/**
 * Advanced appointment operations service
 */
export class AppointmentsOperationsService extends AppointmentServiceBase {
  constructor(client: ApiClient) {
    super(client);
  }

  // ==========================================
  // RECURRING APPOINTMENTS
  // ==========================================

  /**
   * Create recurring appointments
   *
   * @param data - Recurring appointment data
   * @returns Promise resolving to created appointments
   */
  async createRecurringAppointments(
    data: RecurringAppointmentData
  ): Promise<Appointment[]> {
    // Validate input data
    const validationResult = recurringAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{
        data: {
          appointments: Appointment[];
          summary: {
            requested: number;
            created: number;
            skipped: number;
            conflicts: string[];
          };
        };
      }>(`${this.endpoint}/recurring`, validationResult.data);

      // Log recurring appointment creation
      this.logActivity('recurring_appointments_created', {
        studentId: data.studentId,
        nurseId: data.nurseId,
        frequency: data.recurrence.frequency,
        created: response.data.data.summary.created,
        conflicts: response.data.data.summary.conflicts.length
      });

      return response.data.data.appointments;
    } catch (error) {
      this.handleError(error, 'Failed to create recurring appointments');
      throw error;
    }
  }

  // ==========================================
  // BULK OPERATIONS
  // ==========================================

  /**
   * Cancel multiple appointments
   *
   * @param appointmentIds - Array of appointment IDs
   * @param reason - Cancellation reason
   * @returns Promise resolving to bulk operation result
   */
  async bulkCancel(
    appointmentIds: string[],
    reason?: string
  ): Promise<BulkOperationResult> {
    // Validate input
    const validationResult = bulkCancelSchema.safeParse({ appointmentIds, reason });
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    try {
      const response = await this.client.post<{ data: BulkOperationResult }>(
        `${this.endpoint}/bulk/cancel`,
        validationResult.data
      );

      // Log bulk cancellation
      this.logActivity('appointments_bulk_cancelled', {
        total: response.data.data.summary.total,
        successful: response.data.data.summary.successful,
        failed: response.data.data.summary.failed,
        reason
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to cancel appointments');
      throw error;
    }
  }

  /**
   * Reschedule multiple appointments
   *
   * @param rescheduleData - Array of reschedule operations
   * @returns Promise resolving to bulk operation result
   */
  async bulkReschedule(
    rescheduleData: Array<{
      appointmentId: string;
      newDateTime: string;
      reason?: string;
    }>
  ): Promise<BulkOperationResult> {
    if (!rescheduleData?.length) {
      throw this.createError('Reschedule data is required', 'VALIDATION_ERROR');
    }

    try {
      const response = await this.client.post<{ data: BulkOperationResult }>(
        `${this.endpoint}/bulk/reschedule`,
        { operations: rescheduleData }
      );

      // Log bulk reschedule
      this.logActivity('appointments_bulk_rescheduled', {
        total: response.data.data.summary.total,
        successful: response.data.data.summary.successful,
        failed: response.data.data.summary.failed
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to reschedule appointments');
      throw error;
    }
  }

  // ==========================================
  // CALENDAR INTEGRATION
  // ==========================================

  /**
   * Get appointments formatted for calendar display
   *
   * @param filters - Calendar filter parameters
   * @returns Promise resolving to calendar events
   */
  async getCalendarEvents(filters: {
    startDate: string;
    endDate: string;
    nurseIds?: string[];
    types?: AppointmentType[];
  }): Promise<AppointmentCalendarEvent[]> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, String(v)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      });

      const url = `${this.endpoint}/calendar${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;
      const response = await this.client.get<{ data: AppointmentCalendarEvent[] }>(
        url
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch calendar events');
      throw error;
    }
  }
}

/**
 * Factory function to create AppointmentsOperationsService
 */
export function createAppointmentsOperationsService(
  client: ApiClient
): AppointmentsOperationsService {
  return new AppointmentsOperationsService(client);
}
