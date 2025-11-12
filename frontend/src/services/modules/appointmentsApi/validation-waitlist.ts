/**
 * Appointments API - Waitlist Validation Schemas
 *
 * Zod validation schemas for waitlist management.
 * Provides validation for waitlist entries and queries.
 *
 * @module services/modules/appointmentsApi/validation-waitlist
 */

import { z } from 'zod';
import {
  AppointmentType,
  WaitlistPriority,
  APPOINTMENT_VALIDATION
} from './types';

// ==========================================
// WAITLIST VALIDATION SCHEMAS
// ==========================================

/**
 * Waitlist Entry Schema
 * Validates data for adding students to waitlist
 */
export const waitlistEntrySchema = z.object({
  studentId: z.string()
    .uuid('Invalid student ID format')
    .min(1, 'Student ID is required'),

  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),

  type: z.nativeEnum(AppointmentType),

  reason: z.string()
    .min(1, 'Reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),

  priority: z.nativeEnum(WaitlistPriority)
    .optional()
    .default(WaitlistPriority.NORMAL),

  preferredDate: z.string()
    .date('Invalid preferred date format')
    .refine(date => {
      const preferredDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return preferredDate >= today;
    }, {
      message: 'Preferred date cannot be in the past'
    })
    .optional(),

  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`)
    .optional()
    .default(APPOINTMENT_VALIDATION.DEFAULT_DURATION),

  notes: z.string()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
});

/**
 * Waitlist Filters Schema
 * Validates filter parameters for waitlist queries
 */
export const waitlistFiltersSchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),

  type: z.nativeEnum(AppointmentType).optional(),

  priority: z.nativeEnum(WaitlistPriority).optional(),

  dateFrom: z.string()
    .date('Invalid start date format')
    .optional(),

  dateTo: z.string()
    .date('Invalid end date format')
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

  sortBy: z.enum(['position', 'createdAt', 'priority', 'preferredDate'])
    .optional()
    .default('position'),

  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('asc'),
}).refine(data => {
  // Start date must be before or equal to end date
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['dateFrom']
});
