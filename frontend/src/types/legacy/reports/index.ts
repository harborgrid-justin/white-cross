/**
 * WF-COMP-332 | index.ts - Reports module barrel exports
 * Purpose: Centralized re-export of all report type definitions for backward compatibility
 * Upstream: All report modules | Dependencies: All report type modules
 * Downstream: Application components | Called by: Report-related components and services
 * Related: All report type modules
 * Exports: All report types, enums, and interfaces
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Type imports → Module resolution → Type safety throughout application
 * LLM Context: Barrel export for refactored healthcare reporting type system
 */

// ==================== Enum Types ====================
export {
  ReportType,
  ReportFormat,
  ReportPeriod,
  ChartType,
  AggregationType,
} from './report-enums';

// ==================== Filter Types ====================
export type {
  DateRangeFilter,
  ReportFilters,
  CustomReportFilters,
} from './report-filters';

// ==================== Health Trends Report Types ====================
export type {
  HealthTrendData,
  HealthRecordTypeCount,
  ChronicConditionCount,
  AllergyStatistics,
  MonthlyTrendData,
  HealthTrendsReport,
} from './health-trends';

// ==================== Medication Usage Report Types ====================
export type {
  MedicationUsageData,
  MedicationInfo,
  StudentMedicationInfo,
  MedicationLog,
  TopMedication,
  MedicationUsageReport,
} from './medication-reports';

// ==================== Incident Statistics Report Types ====================
export type {
  IncidentStatistics,
  IncidentStudentInfo,
  IncidentReport,
  IncidentByType,
  IncidentBySeverity,
  MonthlyIncidentTrend,
  InjuryStatistics,
  NotificationStatistics,
  ComplianceStatistics,
  IncidentStatisticsReport,
} from './incident-reports';

// ==================== Attendance Correlation Report Types ====================
export type {
  AttendanceCorrelationData,
  StudentVisitCount,
  ChronicCondition,
  AttendanceCorrelationReport,
} from './attendance-reports';

// ==================== Performance Metrics Types ====================
export type {
  PerformanceMetrics,
  PerformanceMetric,
  NursePerformanceMetric,
  SystemUsageMetrics,
  PerformanceMetricsReport,
} from './performance-reports';

// ==================== Dashboard Metrics Types ====================
export type {
  DashboardMetrics,
  DashboardWidget,
  RecentActivity,
  SystemAlert,
  DashboardAppointmentSummary,
  DashboardData,
} from './dashboard-reports';

// ==================== Compliance Report Types ====================
export type {
  AuditLog,
  MedicationComplianceStats,
  IncidentComplianceStats,
  ComplianceCategoryScore,
  ComplianceViolation,
  ComplianceReport,
} from './compliance-reports';

// ==================== Custom Report Types ====================
export type {
  ReportTemplate,
  ScheduledReport,
  CustomReportRequest,
  ReportData,
} from './custom-reports';

// ==================== Export Types ====================
export type {
  ExportRequest,
  ExportJob,
  ReportShareRequest,
  ReportHistory,
} from './export-reports';

// ==================== Analytics Types ====================
export type {
  UsageAnalytics,
  ReportPopularity,
  PerformanceInsight,
  ChartData,
  AggregatedChartData,
} from './analytics-reports';
