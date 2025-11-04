/**
 * Reports Schedule Validation Schemas
 *
 * Schemas for scheduled report generation, delivery configuration, and timing.
 * Handles recurring report generation and distribution settings.
 *
 * @module reports.schedule.schemas
 */

import { z } from 'zod';
import { reportConfigSchema } from './reports.config.schemas';

/**
 * Schedule Frequency Schema
 */
export const scheduleFrequencySchema = z.enum([
  'ONCE',
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'QUARTERLY',
  'YEARLY',
  'CUSTOM',
]);

export type ScheduleFrequency = z.infer<typeof scheduleFrequencySchema>;

/**
 * Cron Expression Schema (simplified validation)
 */
export const cronExpressionSchema = z.string().regex(
  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
  'Invalid cron expression'
);

/**
 * Email Delivery Configuration Schema
 */
export const emailDeliverySchema = z.object({
  enabled: z.boolean().default(false),
  recipients: z.array(z.string().email('Invalid email address')).min(1, 'At least one recipient required'),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().min(1, 'Email subject is required').max(200),
  body: z.string().max(2000).optional(),
  attachReport: z.boolean().default(true),
  includeLink: z.boolean().default(true),
});

export type EmailDelivery = z.infer<typeof emailDeliverySchema>;

/**
 * Storage Delivery Configuration Schema
 */
export const storageDeliverySchema = z.object({
  enabled: z.boolean().default(true),
  path: z.string().optional(),
  retentionDays: z.number().int().min(1).max(365).optional().default(7),
  autoCleanup: z.boolean().default(true),
});

export type StorageDelivery = z.infer<typeof storageDeliverySchema>;

/**
 * Date Range Type Schema for Dynamic Scheduling
 */
export const dateRangeTypeSchema = z.enum([
  'LAST_7_DAYS',
  'LAST_30_DAYS',
  'LAST_MONTH',
  'LAST_QUARTER',
  'LAST_YEAR',
  'CURRENT_MONTH',
  'CURRENT_QUARTER',
  'CURRENT_YEAR',
  'CUSTOM',
]);

export type DateRangeType = z.infer<typeof dateRangeTypeSchema>;

/**
 * Report Schedule Schema
 * Configuration for scheduled report generation
 */
export const reportScheduleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Schedule name is required').max(100),
  description: z.string().max(500).optional(),

  // Report configuration
  reportConfig: reportConfigSchema.omit({ dateRange: true, createdBy: true }),

  // Dynamic date range settings
  dateRangeType: dateRangeTypeSchema.default('LAST_30_DAYS'),

  // Schedule settings
  frequency: scheduleFrequencySchema,

  // Schedule timing
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'), // HH:mm format
  dayOfWeek: z.number().int().min(0).max(6).optional(), // 0 = Sunday
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  monthOfYear: z.number().int().min(1).max(12).optional(),

  // Custom cron expression (for CUSTOM frequency)
  cronExpression: cronExpressionSchema.optional(),

  // Delivery configuration
  delivery: z.object({
    email: emailDeliverySchema.optional(),
    storage: storageDeliverySchema.optional(),
  }),

  // Schedule state
  active: z.boolean().default(true),
  startDate: z.string().optional(), // When to start schedule
  endDate: z.string().optional(), // When to end schedule

  // Execution tracking
  lastRun: z.string().optional(),
  nextRun: z.string().optional(),
  lastStatus: z.enum(['SUCCESS', 'FAILED', 'PENDING']).optional(),
  failureCount: z.number().int().min(0).optional().default(0),

  // Metadata
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).refine(
  (data) => {
    // Validate frequency-specific fields
    if (data.frequency === 'WEEKLY' && data.dayOfWeek === undefined) {
      return false;
    }
    if (data.frequency === 'MONTHLY' && data.dayOfMonth === undefined) {
      return false;
    }
    if (data.frequency === 'CUSTOM' && !data.cronExpression) {
      return false;
    }
    return true;
  },
  {
    message: 'Missing required field for frequency type',
    path: ['frequency'],
  }
).refine(
  (data) => {
    // At least one delivery method must be enabled
    return data.delivery.email?.enabled || data.delivery.storage?.enabled;
  },
  {
    message: 'At least one delivery method must be enabled',
    path: ['delivery'],
  }
);

export type ReportSchedule = z.infer<typeof reportScheduleSchema>;
