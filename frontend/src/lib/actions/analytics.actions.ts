/**
 * Analytics Server Actions
 *
 * Main entry point that re-exports all analytics functionality from specialized modules.
 * This file maintains backward compatibility while organizing code into logical groupings.
 */

'use server';

// Export all types
export type {
  DateRangeFilter,
  HealthMetricsFilters,
  MedicationComplianceFilters,
  AppointmentAnalyticsFilters,
  IncidentTrendsFilters,
  InventoryAnalyticsFilters,
  ActionResponse,
  ExportResponse,
} from './analytics.types';

// Export metrics collection functions
export {
  getHealthMetrics,
  getMedicationCompliance,
  getAppointmentAnalytics,
  getIncidentTrends,
  getInventoryAnalytics,
} from './analytics.metrics';

// Export report management functions
export {
  generateReport,
  createCustomReport,
  updateCustomReport,
  deleteCustomReport,
  getCustomReports,
  getCustomReportById,
} from './analytics.reports';

// Export export and scheduling functions
export {
  exportReport,
  createScheduledReport,
  updateScheduledReport,
  deleteScheduledReport,
} from './analytics.export';

// Export dashboard management functions
export {
  saveDashboardConfig,
  getDashboardConfigs,
  getDashboardMetrics,
} from './analytics.dashboards';

// Export utility functions (typically not used directly by consumers, but available if needed)
export {
  buildDateRangeParams,
  handleAnalyticsError,
} from './analytics.utils';
