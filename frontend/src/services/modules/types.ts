/**
 * Analytics API Types Re-export
 *
 * This module re-exports all analytics-related types from the main types directory.
 * It serves as a convenient import point for analytics API modules while maintaining
 * type consistency across the application.
 *
 * @module services/modules/types
 */

// Re-export all report types used by analytics API
export type {
  // Basic analytics types
  HealthMetrics,
  HealthTrends,
  IncidentTrends,
  IncidentLocationData,
  MedicationUsage,
  MedicationAdherence,
  AppointmentTrends,
  NoShowRate,
  AnalyticsSummary,

  // Dashboard types
  NurseDashboard,
  AdminDashboard,
  SchoolDashboard,
  DashboardWidget,

  // Report types
  CustomReport,
  CustomReportRequest,
  CustomReportResult,
  ReportListResponse,
  ReportSchedule,
  CreateReportScheduleRequest,

  // Query types
  AnalyticsQueryParams,
  PaginationParams,
  DateRangeFilter,

  // Chart types
  ChartConfiguration,

  // Enums
  ReportExportFormat,
  DateGrouping,
  ComparisonPeriod,
  ReportType,
  ReportFormat,
  ReportPeriod,
  ChartType,
  AggregationType
} from '../../types/reports';

// Re-export common types
export type {
  BaseEntity
} from '../../types/common';
