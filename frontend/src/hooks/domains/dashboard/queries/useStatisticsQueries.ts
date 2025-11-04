/**
 * Dashboard Statistics Query Hooks
 *
 * Specialized hooks for fetching various healthcare statistics for dashboard display.
 *
 * @module hooks/domains/dashboard/queries/useStatisticsQueries
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

// Re-export all statistics hooks from modular files
export { useAppointmentStatistics } from './useAppointmentStatistics';
export { useStudentStatistics } from './useStudentStatistics';
export {
  useHealthRecordsStatistics,
  useMedicationStatistics,
  useIncidentStatistics
} from './useHealthStatistics';
export {
  useInventoryStatistics,
  useInventoryAlerts
} from './useSystemStatistics';
export { useDashboardStatistics } from './useDashboardStatistics';
