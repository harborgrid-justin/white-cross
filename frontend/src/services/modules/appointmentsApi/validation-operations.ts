/**
 * Appointments API - Operations Validation Schemas
 *
 * Zod validation schemas for appointment operations, statistics, and analytics.
 * Provides validation for conflict checks, bulk operations, and reporting.
 *
 * @module services/modules/appointmentsApi/validation-operations
 */

import { z } from 'zod';
import { APPOINTMENT_VALIDATION } from './types';

// ==========================================
// CONFLICT CHECK VALIDATION
// ==========================================

/**
 * Conflict Check Schema
 * Validates parameters for checking appointment conflicts
 */
export const conflictCheckSchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .min(1, 'Nurse ID is required'),

  startTime: z.string()
    .datetime('Invalid start time format'),

  duration: z.number()
    .int('Duration must be a whole number')
    .min(APPOINTMENT_VALIDATION.MIN_DURATION, `Duration must be at least ${APPOINTMENT_VALIDATION.MIN_DURATION} minutes`)
    .max(APPOINTMENT_VALIDATION.MAX_DURATION, `Duration cannot exceed ${APPOINTMENT_VALIDATION.MAX_DURATION} minutes`),

  excludeAppointmentId: z.string()
    .uuid('Invalid appointment ID format')
    .optional(),
});

// ==========================================
// BULK OPERATIONS VALIDATION
// ==========================================

/**
 * Bulk Cancel Schema
 * Validates bulk appointment cancellation
 */
export const bulkCancelSchema = z.object({
  appointmentIds: z.array(z.string().uuid('Invalid appointment ID format'))
    .min(1, 'At least one appointment ID is required')
    .max(50, 'Cannot cancel more than 50 appointments at once'),

  reason: z.string()
    .max(500, 'Cancellation reason cannot exceed 500 characters')
    .optional(),
});

// ==========================================
// STATISTICS AND ANALYTICS VALIDATION
// ==========================================

/**
 * Statistics Filters Schema
 * Validates parameters for appointment statistics
 */
export const statisticsFiltersSchema = z.object({
  nurseId: z.string()
    .uuid('Invalid nurse ID format')
    .optional(),

  dateFrom: z.string()
    .date('Invalid start date format')
    .optional(),

  dateTo: z.string()
    .date('Invalid end date format')
    .optional(),
}).refine(data => {
  if (data.dateFrom && data.dateTo) {
    return new Date(data.dateFrom) <= new Date(data.dateTo);
  }
  return true;
}, {
  message: 'Start date must be before or equal to end date',
  path: ['dateFrom']
});

/**
 * Trends Query Schema
 * Validates parameters for appointment trends
 */
export const trendsQuerySchema = z.object({
  dateFrom: z.string()
    .date('Invalid start date format'),

  dateTo: z.string()
    .date('Invalid end date format'),

  groupBy: z.enum(['day', 'week', 'month'])
    .optional()
    .default('day'),
}).refine(data => {
  return new Date(data.dateFrom) <= new Date(data.dateTo);
}, {
  message: 'Start date must be before or equal to end date',
  path: ['dateFrom']
}).refine(data => {
  // Date range should not exceed 2 years
  const startDate = new Date(data.dateFrom);
  const endDate = new Date(data.dateTo);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 730; // 2 years
}, {
  message: 'Date range cannot exceed 2 years',
  path: ['dateTo']
});
