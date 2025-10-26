/**
 * Reports Validation Schemas
 *
 * Comprehensive Zod validation schemas for report generation, scheduling, and management.
 * Ensures type safety for report configuration and delivery.
 *
 * @module reports.schemas
 */

import { z } from 'zod';
import { dateRangeSchema } from '../analytics/analytics.schemas';

/**
 * Report Format Enum
 */
export const reportFormatSchema = z.enum(['PDF', 'EXCEL', 'CSV']);

export type ReportFormat = z.infer<typeof reportFormatSchema>;

/**
 * Report Type Enum
 */
export const reportTypeSchema = z.enum([
  'STUDENT_HEALTH_SUMMARY',
  'MEDICATION_ADMINISTRATION',
  'MEDICATION_COMPLIANCE',
  'INCIDENT_REPORTS',
  'INCIDENT_TRENDS',
  'ATTENDANCE_HEALTH',
  'INVENTORY_USAGE',
  'INVENTORY_EXPIRATION',
  'APPOINTMENTS_SUMMARY',
  'HEALTH_METRICS',
  'COMPLIANCE_AUDIT',
  'CUSTOM',
]);

export type ReportType = z.infer<typeof reportTypeSchema>;

/**
 * Report Parameter Schema
 * Dynamic parameters for different report types
 */
export const reportParameterSchema = z.object({
  name: z.string().min(1),
  label: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'date', 'select', 'multiselect']),
  value: z.any(),
  required: z.boolean().default(false),
  options: z.array(z.object({
    label: z.string(),
    value: z.any(),
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
});

export type ReportParameter = z.infer<typeof reportParameterSchema>;

/**
 * Report Configuration Schema
 * Main schema for report generation
 */
export const reportConfigSchema = z.object({
  // Report identification
  reportType: reportTypeSchema,
  title: z.string().min(1, 'Report title is required').max(200),
  description: z.string().max(500).optional(),

  // Date range (required for most reports)
  dateRange: dateRangeSchema,

  // Format
  format: reportFormatSchema,

  // Dynamic parameters
  parameters: z.array(reportParameterSchema).optional(),

  // Filters
  filters: z.object({
    schoolIds: z.array(z.string()).optional(),
    gradeLevels: z.array(z.string()).optional(),
    studentIds: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),

  // Grouping and sorting
  groupBy: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['ASC', 'DESC']).optional().default('ASC'),

  // Options
  includeCharts: z.boolean().optional().default(false),
  includeMetadata: z.boolean().optional().default(true),
  includeSummary: z.boolean().optional().default(true),
  includeDetails: z.boolean().optional().default(true),

  // PDF-specific options
  pageSize: z.enum(['A4', 'LETTER', 'LEGAL']).optional().default('A4'),
  orientation: z.enum(['portrait', 'landscape']).optional().default('portrait'),

  // Excel-specific options
  sheetNames: z.array(z.string()).optional(),
  includeFormulas: z.boolean().optional().default(false),

  // Created by
  createdBy: z.string().optional(),
});

export type ReportConfig = z.infer<typeof reportConfigSchema>;

/**
 * Report Template Schema
 * Predefined report configurations
 */
export const reportTemplateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Template name is required').max(100),
  description: z.string().max(500).optional(),
  reportType: reportTypeSchema,
  category: z.enum([
    'health',
    'medication',
    'incidents',
    'appointments',
    'inventory',
    'compliance',
    'custom',
  ]),
  config: reportConfigSchema.omit({ dateRange: true, createdBy: true }),
  isSystem: z.boolean().default(false), // System templates cannot be deleted
  isPublic: z.boolean().default(true),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type ReportTemplate = z.infer<typeof reportTemplateSchema>;

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
  dateRangeType: z.enum([
    'LAST_7_DAYS',
    'LAST_30_DAYS',
    'LAST_MONTH',
    'LAST_QUARTER',
    'LAST_YEAR',
    'CURRENT_MONTH',
    'CURRENT_QUARTER',
    'CURRENT_YEAR',
    'CUSTOM',
  ]).default('LAST_30_DAYS'),

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

/**
 * Report Execution Schema
 * Tracks report generation execution
 */
export const reportExecutionSchema = z.object({
  id: z.string().optional(),
  scheduleId: z.string().optional(),
  reportConfig: reportConfigSchema,
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  duration: z.number().optional(), // milliseconds
  fileSize: z.number().optional(), // bytes
  filePath: z.string().optional(),
  downloadUrl: z.string().optional(),
  expiresAt: z.string().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }).optional(),
  metadata: z.object({
    rowCount: z.number().optional(),
    pageCount: z.number().optional(),
    chartCount: z.number().optional(),
  }).optional(),
  executedBy: z.string().optional(),
});

export type ReportExecution = z.infer<typeof reportExecutionSchema>;

/**
 * Report History Filter Schema
 */
export const reportHistoryFilterSchema = z.object({
  reportTypes: z.array(reportTypeSchema).optional(),
  formats: z.array(reportFormatSchema).optional(),
  status: z.array(z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'])).optional(),
  dateRange: dateRangeSchema.optional(),
  createdBy: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

export type ReportHistoryFilter = z.infer<typeof reportHistoryFilterSchema>;

/**
 * Report Download Request Schema
 */
export const reportDownloadRequestSchema = z.object({
  reportId: z.string().uuid('Invalid report ID'),
  format: reportFormatSchema.optional(), // For format conversion
  expiryMinutes: z.number().int().min(1).max(60).optional().default(15),
});

export type ReportDownloadRequest = z.infer<typeof reportDownloadRequestSchema>;

/**
 * Report Share Schema
 */
export const reportShareSchema = z.object({
  reportId: z.string().uuid(),
  recipients: z.array(z.string().email()).min(1),
  message: z.string().max(500).optional(),
  expiryDays: z.number().int().min(1).max(30).optional().default(7),
  requireAuthentication: z.boolean().default(true),
  sharedBy: z.string().optional(),
});

export type ReportShare = z.infer<typeof reportShareSchema>;

/**
 * Batch Report Generation Schema
 * Generate multiple reports in one request
 */
export const batchReportGenerationSchema = z.object({
  reports: z.array(reportConfigSchema).min(1).max(10),
  combineIntoOne: z.boolean().default(false), // Combine all reports into single file
  format: reportFormatSchema.optional(), // Override individual formats
  delivery: z.object({
    email: emailDeliverySchema.optional(),
    storage: storageDeliverySchema.optional(),
  }).optional(),
});

export type BatchReportGeneration = z.infer<typeof batchReportGenerationSchema>;

/**
 * Validation helper functions
 */

/**
 * Validate cron expression format
 */
export function validateCronExpression(expression: string): boolean {
  try {
    cronExpressionSchema.parse(expression);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate next run time from schedule
 */
export function calculateNextRun(schedule: ReportSchedule): Date {
  const now = new Date();
  const [hours, minutes] = schedule.time.split(':').map(Number);

  let nextRun = new Date(now);
  nextRun.setHours(hours, minutes, 0, 0);

  // If time has passed today, move to next occurrence
  if (nextRun <= now) {
    switch (schedule.frequency) {
      case 'DAILY':
        nextRun.setDate(nextRun.getDate() + 1);
        break;
      case 'WEEKLY':
        nextRun.setDate(nextRun.getDate() + 7);
        break;
      case 'MONTHLY':
        nextRun.setMonth(nextRun.getMonth() + 1);
        if (schedule.dayOfMonth) {
          nextRun.setDate(schedule.dayOfMonth);
        }
        break;
      case 'QUARTERLY':
        nextRun.setMonth(nextRun.getMonth() + 3);
        break;
      case 'YEARLY':
        nextRun.setFullYear(nextRun.getFullYear() + 1);
        break;
      // Add more complex logic for CUSTOM cron expressions
    }
  }

  return nextRun;
}

/**
 * Validate schedule timing consistency
 */
export function validateScheduleTiming(schedule: Partial<ReportSchedule>): boolean {
  if (!schedule.frequency) return false;

  switch (schedule.frequency) {
    case 'WEEKLY':
      return schedule.dayOfWeek !== undefined && schedule.dayOfWeek >= 0 && schedule.dayOfWeek <= 6;
    case 'MONTHLY':
      return schedule.dayOfMonth !== undefined && schedule.dayOfMonth >= 1 && schedule.dayOfMonth <= 31;
    case 'CUSTOM':
      return !!schedule.cronExpression && validateCronExpression(schedule.cronExpression);
    default:
      return true;
  }
}

/**
 * Generate date range from dynamic type
 */
export function generateDateRange(type: string): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate = '';

  switch (type) {
    case 'LAST_7_DAYS':
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      break;
    case 'LAST_30_DAYS':
      startDate = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
      break;
    case 'LAST_MONTH':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonth.toISOString().split('T')[0];
      break;
    case 'CURRENT_MONTH':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      break;
    // Add more cases as needed
    default:
      startDate = endDate; // Fallback to today
  }

  return { startDate, endDate };
}

/**
 * Sanitize filename for safe file system operations
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9-_\.]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255);
}

/**
 * Validate email recipients list
 */
export function validateEmailRecipients(recipients: string[]): boolean {
  if (recipients.length === 0) return false;
  return recipients.every(email => z.string().email().safeParse(email).success);
}
