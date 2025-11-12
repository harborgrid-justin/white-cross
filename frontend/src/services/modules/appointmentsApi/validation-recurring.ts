/**
 * Appointments API - Recurring Appointments and Reminders Validation Schemas
 *
 * Zod validation schemas for recurring appointments and reminder management.
 * Provides validation for recurrence patterns and reminder scheduling.
 *
 * @module services/modules/appointmentsApi/validation-recurring
 */

import { z } from 'zod';
import {
  MessageType,
  RecurrenceFrequency
} from './types';
import { createAppointmentSchema } from './validation-appointments';

// ==========================================
// RECURRING APPOINTMENT VALIDATION
// ==========================================

/**
 * Recurrence Configuration Schema
 * Validates recurring appointment patterns
 */
export const recurrenceConfigurationSchema = z.object({
  frequency: z.nativeEnum(RecurrenceFrequency),

  interval: z.number()
    .int('Interval must be a whole number')
    .min(1, 'Interval must be at least 1')
    .max(52, 'Interval cannot exceed 52 (for weekly recurrence)'),

  endDate: z.string()
    .date('Invalid end date format')
    .refine(date => {
      const endDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxEndDate = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from today
      return endDate >= today && endDate <= maxEndDate;
    }, {
      message: 'End date must be between today and 1 year from now'
    })
    .optional(),

  maxOccurrences: z.number()
    .int('Max occurrences must be a whole number')
    .min(1, 'Max occurrences must be at least 1')
    .max(100, 'Max occurrences cannot exceed 100')
    .optional(),

  daysOfWeek: z.array(z.number().int().min(0).max(6))
    .min(1, 'At least one day of week must be specified')
    .max(7, 'Cannot specify more than 7 days')
    .refine(days => {
      // Check for duplicates
      const uniqueDays = new Set(days);
      return uniqueDays.size === days.length;
    }, {
      message: 'Duplicate days of week are not allowed'
    })
    .optional(),

  dayOfMonth: z.number()
    .int('Day of month must be a whole number')
    .min(1, 'Day of month must be between 1 and 31')
    .max(31, 'Day of month must be between 1 and 31')
    .optional(),

  exceptions: z.array(z.string().date('Invalid exception date format'))
    .max(50, 'Cannot have more than 50 exception dates')
    .optional(),
}).refine(data => {
  // Must provide either endDate or maxOccurrences
  if (!data.endDate && !data.maxOccurrences) {
    return false;
  }
  return true;
}, {
  message: 'Must specify either end date or maximum occurrences',
  path: ['endDate']
}).refine(data => {
  // Weekly recurrence should specify days of week
  if (data.frequency === RecurrenceFrequency.WEEKLY && !data.daysOfWeek?.length) {
    return false;
  }
  return true;
}, {
  message: 'Weekly recurrence must specify days of week',
  path: ['daysOfWeek']
}).refine(data => {
  // Monthly recurrence should specify day of month
  if (data.frequency === RecurrenceFrequency.MONTHLY && !data.dayOfMonth) {
    return false;
  }
  return true;
}, {
  message: 'Monthly recurrence must specify day of month',
  path: ['dayOfMonth']
}).refine(data => {
  // Frequency-specific interval validation
  if (data.frequency === RecurrenceFrequency.DAILY && data.interval > 30) {
    return false;
  }
  if (data.frequency === RecurrenceFrequency.MONTHLY && data.interval > 12) {
    return false;
  }
  return true;
}, {
  message: 'Interval exceeds maximum for frequency type'
});

/**
 * Recurring Appointment Schema
 * Validates data for creating recurring appointments
 */
export const recurringAppointmentSchema = createAppointmentSchema.extend({
  recurrence: recurrenceConfigurationSchema,
});

// ==========================================
// REMINDER VALIDATION SCHEMAS
// ==========================================

/**
 * Schedule Reminder Schema
 * Validates data for scheduling appointment reminders
 */
export const scheduleReminderSchema = z.object({
  appointmentId: z.string()
    .uuid('Invalid appointment ID format')
    .min(1, 'Appointment ID is required'),

  type: z.nativeEnum(MessageType),

  scheduleTime: z.string()
    .datetime('Invalid schedule time format')
    .refine(time => {
      const scheduleDate = new Date(time);
      const now = new Date();
      return scheduleDate > now;
    }, {
      message: 'Schedule time must be in the future'
    }),

  message: z.string()
    .max(1000, 'Message cannot exceed 1000 characters')
    .optional(),
});

/**
 * Cancel Reminder Schema
 * Validates reminder cancellation
 */
export const cancelReminderSchema = z.object({
  reminderId: z.string()
    .uuid('Invalid reminder ID format')
    .min(1, 'Reminder ID is required'),

  reason: z.string()
    .max(255, 'Cancellation reason cannot exceed 255 characters')
    .optional(),
});
