/**
 * Dashboard Domain Exports
 * 
 * Central export point for all dashboard-related hooks and utilities.
 * Provides statistics, analytics, and dashboard management functionality.
 * 
 * @module hooks/domains/dashboard
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Configuration
export * from './config';

// Query hooks
export {
  useDashboardStatistics,
  useDashboardOverview,
  useDashboardAnalytics,
  useDashboardMetrics,
  useDashboardCharts,
  useDashboardAlerts,
  useDashboardActivities,
} from './queries/useDashboardQueries';

// Statistics hooks (specialized)
export {
  useAppointmentStatistics,
  useStudentStatistics,
  useHealthRecordsStatistics,
  useMedicationStatistics,
  useInventoryStatistics,
  useIncidentStatistics,
} from './queries/useStatisticsQueries';

// Mutation hooks
export {
  useDashboardMutations,
  useUpdateDashboardLayout,
  useExportDashboardData,
  useRefreshDashboard,
} from './mutations/useDashboardMutations';

// Composite hooks for complete dashboard functionality
export {
  useDashboardData,
  useDashboardManagement,
} from './composites/useDashboardComposites';

// Query keys for external use
export { dashboardQueryKeys } from './config';
