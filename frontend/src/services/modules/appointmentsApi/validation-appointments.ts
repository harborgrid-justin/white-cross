/**
 * Appointments API - Appointment Validation Schemas
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Zod validation schemas for appointment scheduling and management operations.
 * Provides comprehensive input validation with healthcare-specific rules and
 * business logic validation for appointments.
 *
 * @module services/modules/appointmentsApi/validation-appointments
 */

import { z } from 'zod';
import {
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
  APPOINTMENT_VALIDATION
} from './types';

// ==========================================
// APPOINTMENT VALIDATION SCHEMAS
// ==========================================

/**
 * Create Appointment Schema
 * Validates data for creating new appointments with comprehensive business rules
 */
export const createAppointmentSchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student ID is required'),

  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse ID is required'),

  type: z.nativeEnum(AppointmentType),

  scheduledAt: z.string()
    .datetime('Invalid datetime format. Use ISO 8601 format')
    .refine(date => {
      const appointmentDate = new Date(date);
      const now = new Date();
      const minAdvance = new Date(now.getTime() + APPOINTMENT_VALIDATION.MIN_ADVANCE_BOOKING * 60000);
      return appointmentDate >= minAdvance;
    }, {
      message: `Appointment must be scheduled at least ${APPOINTMENT_VALIDATION.MIN_ADVANCE_BOOKING} minutes in advance`
    })
    .refine(date => {
      const appointmentDate = new Date(date);
      const now = new Date();
      const maxAdvance = new Date(now.getTime() + APPOINTMENT_VALIDATION.MAX_ADVANCE_BOOKING * 24 * 60 * 60 * 1000);
      return appointmentDate <= maxAdvance;
    }, {
      message: `Appointment cannot be scheduled more than ${APPOINTMENT_VALIDATION.MAX_ADVANCE_BOOKING} days in advance`
    })
    .refine(date => {
      const appointmentDate = new Date(date);
      const dayOfWeek = appointmentDate.getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday only
    }, {
      message: 'Appointments can only be scheduled on weekdays (Monday-Friday)'
    })
    .refine(date => {
      const appointmentDate = new Date(date);
      const hours = appointmentDate.getHours();
      const minutes = appointmentDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      // Business hours: 8:00 AM to 4:00 PM
      const startMinutes = 8 * 60; // 8:00 AM
      const endMinutes = 16 * 60; // 4:00 PM

      return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
    }, {
      message: 'Appointments must be scheduled during business hours (8:00 AM - 4:00 PM)'
    }),

  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .refine(duration => duration % APPOINTMENT_VALIDATION.SLOT_INTERVAL === 0, {
      message: `Duration must be in ${APPOINTMENT_VALIDATION.SLOT_INTERVAL}-minute intervals`
    })
    .optional()
    .default(APPOINTMENT_VALIDATION.DEFAULT_DURATION),

  reason: z.string()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional(),

  priority: z.nativeEnum(AppointmentPriority)
    .optional()
    .default(AppointmentPriority.NORMAL),

  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),

  parentNotificationRequired: z.boolean()
    .optional()
    .default(false),

  reminderEnabled: z.boolean()
    .optional()
    .default(true),
}).refine(data => {
  // Emergency appointments require a reason
  if (data.priority === AppointmentPriority.EMERGENCY && !data.reason?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Emergency appointments must include a reason',
  path: ['reason']
}).refine(data => {
  // Medication appointments should have longer duration
  if (data.type === AppointmentType.MEDICATION && data.duration && data.duration < 20) {
    return false;
  }
  return true;
}, {
  message: 'Medication appointments should be at least 20 minutes',
  path: ['duration']
});

/**
 * Update Appointment Schema
 * Validates data for updating existing appointments
 */
export const updateAppointmentSchema = z.object({
  type: z.nativeEnum(AppointmentType).optional(),

  scheduledAt: z.string()
    .datetime('Invalid datetime format')
    .refine(date => {
      const appointmentDate = new Date(date);
      const now = new Date();
      return appointmentDate > now;
    }, {
      message: 'Cannot reschedule appointment to a past time'
    })
    .optional(),

  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .optional(),

  reason: z.string()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional(),

  priority: z.nativeEnum(AppointmentPriority).optional(),

  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),

  outcomes: z.string()
    .max(2000, 'Outcomes cannot exceed 2000 characters')
    .optional(),

  followUpRequired: z.boolean().optional(),

  followUpDate: z.string()
    .date('Invalid date format')
    .refine(date => {
      const followUpDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return followUpDate >= today;
    }, {
      message: 'Follow-up date cannot be in the past'
    })
    .optional(),
}).refine(data => {
  // If follow-up is required, follow-up date must be provided
  if (data.followUpRequired && !data.followUpDate) {
    return false;
  }
  return true;
}, {
  message: 'Follow-up date is required when follow-up is marked as required',
  path: ['followUpDate']
});

/**
 * Appointment Filters Schema
 * Validates filter parameters for appointment queries
 */
export const appointmentFiltersSchema = z.object({
  startDate: z.string()
    .date('Invalid start date format')
    .optional(),

  endDate: z.string()
    .date('Invalid end date format')
    .optional(),

  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),

  studentId: z.string()
    .uuid('Invalid student ID format')
    .optional(),

  status: z.nativeEnum(AppointmentStatus).optional(),

  type: z.nativeEnum(AppointmentType).optional(),

  priority: z.nativeEnum(AppointmentPriority).optional(),

  search: z.string()
    .max(255, 'Search term cannot exceed 255 characters')
    .optional(),

  page: z.number()
    .int('Page must be a whole number')
    .min(1, 'Page must be at least 1')
    .optional()
    .default(1),

  limit: z.number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(20),

  sortBy: z.enum(['scheduledAt', 'createdAt', 'priority', 'status'])
    .optional()
    .default('scheduledAt'),

  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('asc'),
}).refine(data => {
  // Start date must be before or equal to end date
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['startDate']
});

/**
 * Appointment Form Schema
 * Validates appointment form data with UI-specific fields
 */
export const appointmentFormSchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student selection is required'),

  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse selection is required'),

  type: z.nativeEnum(AppointmentType),

  scheduledDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(date => {
      const appointmentDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    }, {
      message: 'Appointment date cannot be in the past'
    }),

  scheduledTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),

  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`),

  reason: z.string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),

  priority: z.nativeEnum(AppointmentPriority),

  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),

  parentNotificationRequired: z.boolean(),

  reminderEnabled: z.boolean(),

  reminderTime: z.number()
    .int('Reminder time must be a whole number')
    .min(1, 'Reminder time must be at least 1 hour')
    .max(168, 'Reminder time cannot exceed 168 hours (1 week)')
    .optional(),
}).refine(data => {
  // Combine date and time to validate business hours
  const dateTime = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // Business hours: 8:00 AM to 4:00 PM
  const startMinutes = 8 * 60;
  const endMinutes = 16 * 60;

  return totalMinutes >= startMinutes && totalMinutes <= endMinutes;
}, {
  message: 'Appointment must be scheduled during business hours (8:00 AM - 4:00 PM)',
  path: ['scheduledTime']
});
