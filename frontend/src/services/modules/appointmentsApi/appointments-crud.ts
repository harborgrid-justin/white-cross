/**
 * Appointments API - CRUD Operations
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 * - Client: Use React Query with server actions
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Core Create, Read, Update, Delete operations for appointments with
 * validation, conflict checking, and business rule enforcement.
 *
 * @module services/modules/appointmentsApi/appointments-crud
 */

import type { ApiClient } from '../../core/ApiClient';
import {
  Appointment,
  AppointmentWithRelations,
  CreateAppointmentData,
  UpdateAppointmentData,
  AppointmentStatus,
  AppointmentPriority,
  APPOINTMENT_VALIDATION
} from './types';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  validateAppointmentBusinessRules,
  getValidationErrors
} from './validation';
import { AppointmentServiceBase } from './appointments-shared';

/**
 * CRUD Operations Service for Appointments
 */
export class AppointmentsCrudService extends AppointmentServiceBase {
  /**
   * Conflict checker - injected from main service
   */
  private conflictChecker?: (conflictData: {
    nurseId: string;
    startTime: string;
    duration: number;
    excludeAppointmentId?: string;
  }) => Promise<{ hasConflicts: boolean; conflicts: unknown[]; suggestions: unknown[] }>;

  constructor(client: ApiClient) {
    super(client);
  }

  /**
   * Set conflict checker function
   */
  setConflictChecker(
    checker: (conflictData: {
      nurseId: string;
      startTime: string;
      duration: number;
      excludeAppointmentId?: string;
    }) => Promise<{ hasConflicts: boolean; conflicts: unknown[]; suggestions: unknown[] }>
  ): void {
    this.conflictChecker = checker;
  }

  /**
   * Create a new appointment
   *
   * @param data - Appointment creation data
   * @returns Promise resolving to the created appointment
   * @throws ValidationError if data is invalid
   * @throws ConflictError if appointment conflicts exist
   */
  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    // Validate input data
    const validationResult = createAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    // Validate business rules
    const businessRules = validateAppointmentBusinessRules({
      scheduledAt: validatedData.scheduledAt,
      duration: validatedData.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION,
      type: validatedData.type,
      priority: validatedData.priority || AppointmentPriority.NORMAL
    });

    if (!businessRules.valid) {
      throw this.createError('Business rule validation failed', 'BUSINESS_RULE_ERROR', {
        errors: businessRules.errors
      });
    }

    // Check for conflicts if conflict checker is available
    if (this.conflictChecker) {
      const conflicts = await this.conflictChecker({
        nurseId: validatedData.nurseId,
        startTime: validatedData.scheduledAt,
        duration: validatedData.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION
      });

      if (conflicts.hasConflicts) {
        throw this.createError('Appointment conflicts detected', 'CONFLICT_ERROR', {
          conflicts: conflicts.conflicts,
          suggestions: conflicts.suggestions
        });
      }
    }

    try {
      const response = await this.client.post<{ data: Appointment }>(
        this.endpoint,
        validatedData
      );
      const appointment = response.data.data;

      // Log appointment creation for audit
      this.logActivity('appointment_created', {
        appointmentId: appointment.id,
        studentId: validatedData.studentId,
        nurseId: validatedData.nurseId,
        type: validatedData.type,
        scheduledAt: validatedData.scheduledAt
      });

      return appointment;
    } catch (error) {
      this.handleError(error, 'Failed to create appointment');
      throw error;
    }
  }

  /**
   * Get appointment by ID with optional relation population
   *
   * @param id - Appointment ID
   * @param includeRelations - Whether to include student/nurse details
   * @returns Promise resolving to the appointment
   */
  async getAppointment(
    id: string,
    includeRelations = false
  ): Promise<AppointmentWithRelations> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const params = includeRelations ? { include: 'student,nurse,reminders' } : {};
      const queryParams = new URLSearchParams(params as Record<string, string>);
      const url = `${this.endpoint}/${id}${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;
      const response = await this.client.get<{ data: AppointmentWithRelations }>(url);

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to fetch appointment');
      throw error;
    }
  }

  /**
   * Update an existing appointment
   *
   * @param id - Appointment ID
   * @param data - Update data
   * @returns Promise resolving to the updated appointment
   */
  async updateAppointment(
    id: string,
    data: UpdateAppointmentData
  ): Promise<Appointment> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    // Validate input data
    const validationResult = updateAppointmentSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = getValidationErrors(validationResult.error);
      throw this.createError('Validation failed', 'VALIDATION_ERROR', { errors });
    }

    const validatedData = validationResult.data;

    try {
      // Get current appointment for validation
      const currentAppointment = await this.getAppointment(id);

      // Validate status transitions
      if (
        validatedData.scheduledAt &&
        currentAppointment.status !== AppointmentStatus.SCHEDULED
      ) {
        throw this.createError(
          'Cannot reschedule non-scheduled appointment',
          'BUSINESS_RULE_ERROR'
        );
      }

      // Check for conflicts if rescheduling
      if (validatedData.scheduledAt && this.conflictChecker) {
        const conflicts = await this.conflictChecker({
          nurseId: currentAppointment.nurseId,
          startTime: validatedData.scheduledAt,
          duration: validatedData.duration || currentAppointment.duration,
          excludeAppointmentId: id
        });

        if (conflicts.hasConflicts) {
          throw this.createError('Rescheduling conflicts detected', 'CONFLICT_ERROR', {
            conflicts: conflicts.conflicts,
            suggestions: conflicts.suggestions
          });
        }
      }

      const response = await this.client.put<{ data: Appointment }>(
        `${this.endpoint}/${id}`,
        validatedData
      );

      // Log appointment update for audit
      this.logActivity('appointment_updated', {
        appointmentId: id,
        changes: validatedData,
        previousStatus: currentAppointment.status
      });

      return response.data.data;
    } catch (error) {
      this.handleError(error, 'Failed to update appointment');
      throw error;
    }
  }

  /**
   * Delete an appointment (soft delete)
   *
   * @param id - Appointment ID
   * @param reason - Cancellation reason
   */
  async deleteAppointment(id: string, reason?: string): Promise<void> {
    if (!id?.trim()) {
      throw this.createError('Appointment ID is required', 'VALIDATION_ERROR');
    }

    try {
      const currentAppointment = await this.getAppointment(id);

      // Validate that appointment can be cancelled
      if (
        ![AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS].includes(
          currentAppointment.status
        )
      ) {
        throw this.createError(
          'Cannot cancel appointment with current status',
          'BUSINESS_RULE_ERROR'
        );
      }

      await this.client.delete(`${this.endpoint}/${id}`, { data: { reason } });

      // Log appointment cancellation for audit
      this.logActivity('appointment_cancelled', {
        appointmentId: id,
        reason,
        originalStatus: currentAppointment.status
      });
    } catch (error) {
      this.handleError(error, 'Failed to cancel appointment');
      throw error;
    }
  }
}

/**
 * Factory function to create AppointmentsCrudService
 */
export function createAppointmentsCrudService(
  client: ApiClient
): AppointmentsCrudService {
  return new AppointmentsCrudService(client);
}
