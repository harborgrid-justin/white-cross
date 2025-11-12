/**
 * Appointments API - Conflict Detection and Availability
 *
 * Handles appointment conflict checking, availability slot finding,
 * and scheduling constraint validation.
 *
 * @module services/modules/appointmentsApi/appointments-conflict
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  ConflictCheckResult,
  APPOINTMENT_VALIDATION
} from './types';
import {
  conflictCheckSchema,
  getValidationErrors
} from './validation';
import { AppointmentServiceBase } from './appointments-shared';

/**
 * Conflict detection and availability service
 */
export class AppointmentsConflictService extends AppointmentServiceBase {
  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Check for appointment conflicts
   *
   * @param conflictData - Conflict check parameters
   * @returns Promise resolving to conflict check result
   */
  async checkConflicts(conflictData: {
    nurseId: string;
    startTime: string;
    duration: number;
    excludeAppointmentId?: string;
  }): Promise<ConflictCheckResult> {
    // Validate input
    const validationResult = conflictCheckSchema.safeParse(conflictData);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Invalid conflict check data', 'VALIDATION_ERROR', {
        errors
      });
    }

    try {
      const response = await this.client.post<{ data: ConflictCheckResult }>(
        `${this.endpoint}/conflicts/check`,
        validationResult.data
      );

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to check conflicts');
      throw error;
    }
  }

  /**
   * Find available time slots for appointment scheduling
   *
   * @param nurseId - Nurse ID
   * @param date - Date to check (YYYY-MM-DD)
   * @param duration - Appointment duration in minutes
   * @returns Promise resolving to available time slots
   */
  async findAvailableSlots(
    nurseId: string,
    date: string,
    duration: number = APPOINTMENT_VALIDATION.DEFAULT_DURATION
  ) {
    if (!nurseId?.trim() || !date?.trim()) {
      throw this.createError('Nurse ID and date are required', 'VALIDATION_ERROR');
    }

    try {
      const queryParams = new URLSearchParams({
        nurseId,
        date,
        duration: duration.toString()
      });

      const response = await this.client.get<{
        data: {
          date: string;
          nurseId: string;
          duration: number;
          slots: Array<{
            startTime: string;
            endTime: string;
            available: boolean;
          }>;
        };
      }>(`${this.endpoint}/availability/slots?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find available slots');
      throw error;
    }
  }

  /**
   * Get next available appointment slot
   *
   * @param nurseId - Nurse ID
   * @param preferredDate - Preferred date (optional)
   * @param duration - Appointment duration
   * @returns Promise resolving to next available slot
   */
  async getNextAvailableSlot(
    nurseId: string,
    preferredDate?: string,
    duration = APPOINTMENT_VALIDATION.DEFAULT_DURATION
  ) {
    const startDate = preferredDate || new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // Search within next 30 days

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('nurseId', nurseId);
      queryParams.append('startDate', startDate);
      queryParams.append('endDate', endDate.toISOString().split('T')[0]);
      queryParams.append('duration', duration.toString());

      const response = await this.client.get<{
        data: {
          startTime: string;
          endTime: string;
          date: string;
          nurseName: string;
        } | null;
      }>(`${this.endpoint}/availability/next?${queryParams.toString()}`);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to find next available slot');
      throw error;
    }
  }
}

/**
 * Factory function to create AppointmentsConflictService
 */
export function createAppointmentsConflictService(
  client: ApiClient
): AppointmentsConflictService {
  return new AppointmentsConflictService(client);
}
