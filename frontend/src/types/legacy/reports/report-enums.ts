/**
 * WF-COMP-332 | report-enums.ts - Report enumeration types
 * Purpose: Centralized enum definitions for all report-related types
 * Upstream: None | Dependencies: None
 * Downstream: All report type modules | Called by: Report components and services
 * Related: report-filters.ts, various report modules
 * Exports: Enums for report types, formats, periods, charts, and aggregations
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type safety for report configuration → Report generation → Data visualization
 * LLM Context: Core enumeration types for healthcare reporting system type safety
 */

/**
 * Report type enumeration for different report categories
 */
export enum ReportType {
  HEALTH_TRENDS = 'HEALTH_TRENDS',
  MEDICATION_USAGE = 'MEDICATION_USAGE',
  INCIDENT_STATISTICS = 'INCIDENT_STATISTICS',
  ATTENDANCE_CORRELATION = 'ATTENDANCE_CORRELATION',
  COMPLIANCE = 'COMPLIANCE',
  PERFORMANCE_METRICS = 'PERFORMANCE_METRICS',
  DASHBOARD = 'DASHBOARD',
  CUSTOM = 'CUSTOM',
  STUDENTS = 'STUDENTS',
  MEDICATIONS = 'MEDICATIONS',
  INCIDENTS = 'INCIDENTS',
  APPOINTMENTS = 'APPOINTMENTS',
  INVENTORY = 'INVENTORY',
}

/**
 * Report export format options
 */
export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
}

/**
 * Report period for time-based filtering
 */
export enum ReportPeriod {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

/**
 * Chart types for data visualization
 */
export enum ChartType {
  LINE = 'LINE',
  BAR = 'BAR',
  PIE = 'PIE',
  AREA = 'AREA',
  SCATTER = 'SCATTER',
  DONUT = 'DONUT',
  HORIZONTAL_BAR = 'HORIZONTAL_BAR',
  STACKED_BAR = 'STACKED_BAR',
  RADAR = 'RADAR',
}

/**
 * Aggregation types for data grouping
 */
export enum AggregationType {
  COUNT = 'COUNT',
  SUM = 'SUM',
  AVG = 'AVG',
  MIN = 'MIN',
  MAX = 'MAX',
  MEDIAN = 'MEDIAN',
  PERCENTILE = 'PERCENTILE',
}
