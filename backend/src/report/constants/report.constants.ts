/**
 * Report Module Constants
 * Defines enums, types, and configuration constants for the reporting system
 */

export enum ReportType {
  HEALTH_TRENDS = 'health_trends',
  MEDICATION_USAGE = 'medication_usage',
  INCIDENT_STATISTICS = 'incident_statistics',
  ATTENDANCE_CORRELATION = 'attendance_correlation',
  COMPLIANCE = 'compliance',
  DASHBOARD = 'dashboard',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

export enum OutputFormat {
  PDF = 'pdf',
  EXCEL = 'excel',
  CSV = 'csv',
  JSON = 'json',
}

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  CUSTOM = 'custom',
}

export const REPORT_CONFIG = {
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,

  // Cache TTL (seconds)
  DASHBOARD_CACHE_TTL: 300, // 5 minutes
  REPORT_CACHE_TTL: 3600, // 1 hour

  // File storage
  REPORT_OUTPUT_DIR: 'reports/generated',
  TEMP_DIR: 'reports/temp',
  CLEANUP_AFTER_DAYS: 7,

  // Report generation limits
  MAX_RECORDS_PER_REPORT: 10000,
  LARGE_REPORT_THRESHOLD: 1000,
  ASYNC_GENERATION_THRESHOLD: 5000,

  // Date range defaults
  DEFAULT_LOOKBACK_DAYS: 30,
  MAX_DATE_RANGE_DAYS: 365,
};

export const CRON_EXPRESSIONS = {
  DAILY_MIDNIGHT: '0 0 * * *',
  WEEKLY_MONDAY: '0 0 * * 1',
  MONTHLY_FIRST: '0 0 1 * *',
  QUARTERLY: '0 0 1 */3 *',
};

export const MIME_TYPES = {
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  CSV: 'text/csv',
  JSON: 'application/json',
};
