/**
 * Analytics API Validation Module
 *
 * Provides comprehensive Zod validation schemas and helper functions for analytics API requests.
 * Ensures type safety and data integrity for all analytics operations.
 *
 * @module services/modules/validation
 */

import { z } from 'zod';
import type { ReportType, ReportFormat } from './types';

// ============================================================================
// BASE VALIDATION SCHEMAS
// ============================================================================

/**
 * Date range validation schema
 * Validates start and end dates with proper format
 */
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  {
    message: 'Start date must be before or equal to end date',
  }
);

/**
 * Pagination validation schema
 * Ensures valid page numbers and limits
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(1000).optional().default(20),
  limit: z.number().int().positive().max(1000).optional(),
});

/**
 * Analytics query parameters schema
 * Common query params for analytics endpoints
 */
export const analyticsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  period: z.enum(['daily', 'weekly', 'monthly']).optional(),
  schoolId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  metricType: z.string().optional(),
});

// ============================================================================
// HEALTH METRICS VALIDATION
// ============================================================================

/**
 * Health metrics query validation schema
 */
const healthMetricsQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metricType: z.string().optional(),
  schoolId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
});

/**
 * Medication query validation schema
 */
const medicationQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  medicationId: z.string().uuid().optional(),
  schoolId: z.string().uuid().optional(),
});

// ============================================================================
// CUSTOM REPORT VALIDATION
// ============================================================================

/**
 * Custom report filters schema
 */
const customReportFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  schoolId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  groupBy: z.array(z.string()).optional(),
  aggregations: z.record(z.string()).optional(),
}).passthrough(); // Allow additional properties

/**
 * Custom report request validation schema
 */
const customReportRequestSchema = z.object({
  reportType: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  filters: customReportFiltersSchema.optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
  schedule: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
    time: z.string().optional(),
    recipients: z.array(z.string().email()).optional(),
  }).optional(),
});

// ============================================================================
// REPORT SCHEDULE VALIDATION
// ============================================================================

/**
 * Report schedule creation validation schema
 */
const createReportScheduleSchema = z.object({
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  time: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  recipients: z.array(z.string().email()).min(1),
  enabled: z.boolean().optional().default(true),
  format: z.enum(['PDF', 'EXCEL', 'CSV', 'JSON']).optional().default('PDF'),
  includeCharts: z.boolean().optional().default(true),
  timezone: z.string().optional().default('UTC'),
});

// ============================================================================
// REPORT LIST QUERY VALIDATION
// ============================================================================

/**
 * Report list query validation schema
 */
const reportListQuerySchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().positive().max(100).optional().default(20),
  reportType: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  searchQuery: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'lastRunAt']).optional().default('updatedAt'),
  sortDirection: z.enum(['ASC', 'DESC']).optional().default('DESC'),
});

// ============================================================================
// VALIDATION SCHEMAS EXPORT
// ============================================================================

/**
 * Collection of all validation schemas
 * Organized by category for easy access
 */
export const ValidationSchemas = {
  // Base schemas
  DateRange: dateRangeSchema,
  Pagination: paginationSchema,
  AnalyticsQuery: analyticsQuerySchema,

  // Health metrics schemas
  HealthMetricsQuery: healthMetricsQuerySchema,
  MedicationQuery: medicationQuerySchema,

  // Custom report schemas
  CustomReportFilters: customReportFiltersSchema,
  CustomReportRequest: customReportRequestSchema,

  // Schedule schemas
  CreateReportSchedule: createReportScheduleSchema,

  // Query schemas
  ReportListQuery: reportListQuerySchema,
} as const;

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

/**
 * Safe validation result type
 */
export type SafeValidationResult<T> =
  | { success: true; data: T; errors?: never }
  | { success: false; data?: never; errors: string[] };

/**
 * Safe validation helper
 * Validates data against a schema and returns a result object
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with success flag and data/errors
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): SafeValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`),
  };
}

/**
 * Validate analytics query parameters
 *
 * @param params - Query parameters to validate
 * @returns Validated parameters
 * @throws Error if validation fails
 */
export function validateAnalyticsQuery<T extends Record<string, any>>(
  params: T
): T {
  const result = analyticsQuerySchema.safeParse(params);

  if (!result.success) {
    throw new Error(
      `Invalid analytics query parameters: ${result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')}`
    );
  }

  return result.data as T;
}

/**
 * Validate custom report request
 *
 * @param request - Custom report request to validate
 * @returns Validated request
 * @throws Error if validation fails
 */
export function validateCustomReportRequest(request: unknown): any {
  const result = customReportRequestSchema.safeParse(request);

  if (!result.success) {
    throw new Error(
      `Invalid custom report request: ${result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')}`
    );
  }

  return result.data;
}

/**
 * Validate report schedule
 *
 * @param schedule - Report schedule to validate
 * @returns Validated schedule
 * @throws Error if validation fails
 */
export function validateReportSchedule(schedule: unknown): any {
  const result = createReportScheduleSchema.safeParse(schedule);

  if (!result.success) {
    throw new Error(
      `Invalid report schedule: ${result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')}`
    );
  }

  return result.data;
}

/**
 * Validate date range
 *
 * @param dateRange - Date range to validate
 * @returns Validated date range
 * @throws Error if validation fails
 */
export function validateDateRange(dateRange: {
  startDate?: string;
  endDate?: string;
}): { startDate?: string; endDate?: string } {
  const result = dateRangeSchema.safeParse(dateRange);

  if (!result.success) {
    throw new Error(
      `Invalid date range: ${result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')}`
    );
  }

  return result.data;
}

/**
 * Validate pagination parameters
 *
 * @param params - Pagination parameters to validate
 * @returns Validated pagination parameters
 * @throws Error if validation fails
 */
export function validatePagination(params: {
  page?: number;
  pageSize?: number;
  limit?: number;
}): { page: number; pageSize: number; limit?: number } {
  const result = paginationSchema.safeParse(params);

  if (!result.success) {
    throw new Error(
      `Invalid pagination parameters: ${result.error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')}`
    );
  }

  return result.data;
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

// Export inferred types from schemas
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
export type CustomReportRequestInput = z.infer<typeof customReportRequestSchema>;
export type CreateReportScheduleInput = z.infer<typeof createReportScheduleSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ReportListQueryInput = z.infer<typeof reportListQuerySchema>;
