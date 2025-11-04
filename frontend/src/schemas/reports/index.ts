/**
 * Reports Schemas - Barrel Export
 *
 * Central export point for all report-related validation schemas, types, and utilities.
 * This index file provides convenient access to report schemas organized by category.
 *
 * @module schemas/reports
 *
 * @example
 * ```typescript
 * // Import specific schemas
 * import { reportConfigSchema, scheduleReportSchema } from '@/schemas/reports';
 *
 * // Import types
 * import type { ReportConfig, ReportSchedule } from '@/schemas/reports';
 *
 * // Use utility functions
 * import { validateCronExpression, calculateNextRun } from '@/schemas/reports';
 * ```
 */

// ============================================================================
// Base Types and Enums
// ============================================================================

/**
 * Core report types, formats, parameters, and execution statuses.
 * These are the foundational schemas used across all report modules.
 */
export {
  reportFormatSchema,
  reportTypeSchema,
  reportParameterSchema,
  reportExecutionStatusSchema,
  reportTemplateCategorySchema,
  type ReportFormat,
  type ReportType,
  type ReportParameter,
  type ReportExecutionStatus,
  type ReportTemplateCategory,
} from './reports.base.schemas';

// ============================================================================
// Configuration Schemas
// ============================================================================

/**
 * Report generation configuration, templates, and batch processing.
 * Defines the structure for report generation requests and saved templates.
 */
export {
  reportConfigSchema,
  reportTemplateSchema,
  batchReportGenerationSchema,
  type ReportConfig,
  type ReportTemplate,
  type BatchReportGeneration,
} from './reports.config.schemas';

// ============================================================================
// Schedule Schemas
// ============================================================================

/**
 * Scheduled report generation and delivery configuration.
 * Handles recurring report generation, timing, and distribution settings.
 */
export {
  scheduleFrequencySchema,
  cronExpressionSchema,
  emailDeliverySchema,
  storageDeliverySchema,
  dateRangeTypeSchema,
  reportScheduleSchema,
  type ScheduleFrequency,
  type EmailDelivery,
  type StorageDelivery,
  type DateRangeType,
  type ReportSchedule,
} from './reports.schedule.schemas';

// ============================================================================
// Execution Schemas
// ============================================================================

/**
 * Report execution tracking, status monitoring, and results.
 * Handles execution history, progress tracking, and error reporting.
 */
export {
  reportExecutionSchema,
  type ReportExecution,
} from './reports.execution.schemas';

// ============================================================================
// Filter and Request Schemas
// ============================================================================

/**
 * Report history filtering, downloading, and sharing.
 * Provides validation for report queries and user interactions.
 */
export {
  reportHistoryFilterSchema,
  reportDownloadRequestSchema,
  reportShareSchema,
  type ReportHistoryFilter,
  type ReportDownloadRequest,
  type ReportShare,
} from './reports.filters.schemas';

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Helper functions for report validation, scheduling, and data processing.
 * Provides utilities for cron expressions, date ranges, and data sanitization.
 */
export {
  validateCronExpression,
  calculateNextRun,
  validateScheduleTiming,
  generateDateRange,
  sanitizeFilename,
  validateEmailRecipients,
} from './reports.utils';
