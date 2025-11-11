/**
 * Reports Module Index
 * 
 * Comprehensive type definitions for all reporting functionality in the White Cross Healthcare Platform.
 * This module provides a modular, focused approach to report types while maintaining backward compatibility.
 * 
 * Organized into focused modules:
 * - enums: Core enumeration types
 * - filters: Common filter interfaces
 * - health-trends: Health trends analysis types
 * - medication-usage: Medication tracking types
 * - incidents: Incident reporting and statistics
 * - performance: Performance and compliance metrics
 * - dashboard: Dashboard and custom reports
 * - analytics: Analytics and visualization types
 */

// Core enums and constants
export * from './enums';

// Common filters and base types
export * from './filters';

// Specific report type modules
export * from './health-trends';
export * from './medication-usage';
export * from './incidents';
export * from './performance';
export * from './dashboard';
export * from './analytics';

// Re-export commonly used types for convenience
export type {
  // Core report types
  ReportType,
  ReportFormat,
  ReportPeriod,
  ChartType,
  AggregationType,
} from './enums';

export type {
  // Filter types
  DateRangeFilter,
  ReportFilters,
  CustomReportFilters,
} from './filters';

export type {
  // Health trends
  HealthTrendsReport,
  HealthRecordTypeCount,
  ChronicConditionCount,
  AllergyStatistics,
} from './health-trends';

export type {
  // Medication usage
  MedicationUsageReport,
  MedicationLog,
  TopMedication,
  MedicationInfo,
} from './medication-usage';

export type {
  // Incidents
  IncidentStatisticsReport,
  IncidentReport,
  IncidentStudentInfo,
} from './incidents';

export type {
  // Performance and compliance
  PerformanceMetricsReport,
  ComplianceReport,
  AttendanceCorrelationReport,
  AuditLog,
} from './performance';

export type {
  // Dashboard and custom reports
  DashboardData,
  DashboardMetrics,
  ReportTemplate,
  ScheduledReport,
  ReportData,
  ExportRequest,
  ExportJob,
} from './dashboard';

export type {
  // Analytics
  UsageAnalytics,
  ReportPopularity,
  PerformanceInsight,
  ChartData,
  AggregatedChartData,
} from './analytics';
