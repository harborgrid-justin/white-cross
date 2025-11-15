/**
 * @fileoverview Analytics API Types Re-export
 * @module services/modules/types
 * @category Services - Utilities
 *
 * STATUS: UTILITY MODULE - Continue using as-is
 * This type re-export module provides centralized type imports for analytics.
 * It is used by both API services and server actions for type consistency.
 *
 * USAGE STATUS:
 * - Type definitions for analytics, reports, dashboards, and queries
 * - Shared between legacy API services and new server actions
 * - No migration needed - this is a type definition module
 * - Recommendation: Continue using for type imports across the codebase
 *
 * This module re-exports all analytics-related types from the main types directory.
 * It serves as a convenient import point for analytics API modules while maintaining
 * type consistency across the application.
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
