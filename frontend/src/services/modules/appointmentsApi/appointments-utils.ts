/**
 * Appointments API - Utility Functions
 *
 * Provides utility functions for appointment validation, modification checks,
 * and data transformation operations.
 *
 * @module services/modules/appointmentsApi/appointments-utils
 */

import {
  Appointment,
  CreateAppointmentData,
  AppointmentStatus,
  AppointmentPriority,
  APPOINTMENT_VALIDATION
} from './types';
import {
  createAppointmentSchema,
  validateAppointmentBusinessRules,
  getValidationErrors
} from './validation';

/**
 * Validation result for appointment data
 */
export interface AppointmentValidationResult {
  valid: boolean;
  schemaErrors: Record<string, string[]>;
  businessErrors: string[];
  allErrors: string[];
}

/**
 * Appointment utility functions
 */
export class AppointmentsUtils {
  /**
   * Validate appointment data without creating
   *
   * @param data - Appointment data to validate
   * @returns Validation result with errors if any
   */
  static validateAppointmentData(
    data: CreateAppointmentData
  ): AppointmentValidationResult {
    const schemaResult = createAppointmentSchema.safeParse(data);
    const businessRules = validateAppointmentBusinessRules({
      scheduledAt: data.scheduledAt,
      duration: data.duration || APPOINTMENT_VALIDATION.DEFAULT_DURATION,
      type: data.type,
      priority: data.priority || AppointmentPriority.NORMAL
    });

    return {
      valid: schemaResult.success && businessRules.valid,
      schemaErrors: schemaResult.success ? {} : getValidationErrors(schemaResult.error),
      businessErrors: businessRules.errors,
      allErrors: [
        ...(schemaResult.success
          ? []
          : Object.values(getValidationErrors(schemaResult.error)).flat()),
        ...businessRules.errors
      ]
    };
  }

  /**
   * Check if appointment can be modified
   *
   * @param appointment - Appointment to check
   * @returns Whether appointment can be modified
   */
  static canModifyAppointment(appointment: Appointment): boolean {
    const modifiableStatuses = [
      AppointmentStatus.SCHEDULED,
      AppointmentStatus.IN_PROGRESS
    ];
    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    return (
      modifiableStatuses.includes(appointment.status) &&
      minutesDiff >= APPOINTMENT_VALIDATION.CANCELLATION_NOTICE * 60
    );
  }

  /**
   * Check if appointment is upcoming (within next 24 hours)
   *
   * @param appointment - Appointment to check
   * @returns Whether appointment is upcoming
   */
  static isUpcomingAppointment(appointment: Appointment): boolean {
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      return false;
    }

    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    return hoursDiff > 0 && hoursDiff <= 24;
  }

  /**
   * Check if appointment is overdue
   *
   * @param appointment - Appointment to check
   * @returns Whether appointment is overdue
   */
  static isOverdueAppointment(appointment: Appointment): boolean {
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      return false;
    }

    const now = new Date();
    const appointmentTime = new Date(appointment.scheduledAt);

    return appointmentTime.getTime() < now.getTime();
  }

  /**
   * Calculate appointment end time
   *
   * @param scheduledAt - Appointment start time
   * @param duration - Duration in minutes
   * @returns End time as ISO string
   */
  static calculateEndTime(scheduledAt: string, duration: number): string {
    const startTime = new Date(scheduledAt);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    return endTime.toISOString();
  }

  /**
   * Format appointment duration for display
   *
   * @param duration - Duration in minutes
   * @returns Formatted duration string
   */
  static formatDuration(duration: number): string {
    if (duration < 60) {
      return `${duration} min`;
    }

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }

    return `${hours}h ${minutes}m`;
  }
}
