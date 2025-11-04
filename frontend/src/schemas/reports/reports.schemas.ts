/**
 * Reports Validation Schemas - Barrel Export
 *
 * Central export point for all report-related validation schemas and utilities.
 * Provides backward compatibility while maintaining modular organization.
 *
 * @module reports.schemas
 */

// Base schemas and types
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

// Configuration schemas
export {
  reportConfigSchema,
  reportTemplateSchema,
  batchReportGenerationSchema,
  type ReportConfig,
  type ReportTemplate,
  type BatchReportGeneration,
} from './reports.config.schemas';

// Schedule schemas
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

// Execution schemas
export {
  reportExecutionSchema,
  type ReportExecution,
} from './reports.execution.schemas';

// Filter and request schemas
export {
  reportHistoryFilterSchema,
  reportDownloadRequestSchema,
  reportShareSchema,
  type ReportHistoryFilter,
  type ReportDownloadRequest,
  type ReportShare,
} from './reports.filters.schemas';

// Utility functions
export {
  validateCronExpression,
  calculateNextRun,
  validateScheduleTiming,
  generateDateRange,
  sanitizeFilename,
  validateEmailRecipients,
} from './reports.utils';
