/**
 * Appointments API - Validation Helpers
 *
 * Common validation schemas and helper functions for appointments.
 * Provides reusable validation utilities and error handling.
 *
 * @module services/modules/appointmentsApi/validation-helpers
 */

import { z } from 'zod';
import { AppointmentType, AppointmentPriority } from './types';

// ==========================================
// COMMON VALIDATION HELPERS
// ==========================================

/**
 * UUID validation schema
 */
export const uuidSchema = z.string().uuid('Invalid ID format');

/**
 * Date range validation schema
 */
export const dateRangeSchema = z.object({
  startDate: z.string().date('Invalid start date format'),
  endDate: z.string().date('Invalid end date format'),
}).refine(data => {
  return new Date(data.startDate) <= new Date(data.endDate);
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate']
});

/**
 * Pagination validation schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

// ==========================================
// VALIDATION ERROR HELPERS
// ==========================================

/**
 * Extract validation error messages from Zod error
 */
export function getValidationErrors(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  error.issues.forEach(issue => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  return errors;
}

/**
 * Validate appointment business rules
 */
export function validateAppointmentBusinessRules(data: {
  scheduledAt: string;
  duration: number;
  type: AppointmentType;
  priority: AppointmentPriority;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if appointment is during lunch hours (12:00 PM - 1:00 PM)
  const appointmentDate = new Date(data.scheduledAt);
  const hour = appointmentDate.getHours();
  if (hour >= 12 && hour < 13) {
    errors.push('Appointments cannot be scheduled during lunch hours (12:00 PM - 1:00 PM)');
  }

  // Check if appointment end time would extend beyond business hours
  const endTime = new Date(appointmentDate.getTime() + data.duration * 60000);
  const endHour = endTime.getHours();
  const endMinute = endTime.getMinutes();
  const endTotalMinutes = endHour * 60 + endMinute;

  if (endTotalMinutes > 16 * 60) { // 4:00 PM
    errors.push('Appointment would extend beyond business hours (4:00 PM)');
  }

  // Emergency appointments should be scheduled immediately
  if (data.priority === AppointmentPriority.EMERGENCY) {
    const now = new Date();
    const diffMinutes = (appointmentDate.getTime() - now.getTime()) / 60000;
    if (diffMinutes > 60) { // More than 1 hour in future
      errors.push('Emergency appointments should be scheduled within 1 hour');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
