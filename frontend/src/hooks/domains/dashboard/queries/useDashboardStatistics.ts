/**
 * Combined Dashboard Statistics Hook
 *
 * Hook that combines all statistics hooks for complete dashboard data.
 *
 * @module hooks/domains/dashboard/queries/useDashboardStatistics
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { type DashboardStatisticsFilters } from '../config';
import { useAppointmentStatistics } from './useAppointmentStatistics';
import { useStudentStatistics } from './useStudentStatistics';
import { useHealthRecordsStatistics, useMedicationStatistics, useIncidentStatistics } from './useHealthStatistics';
import { useInventoryStatistics } from './useSystemStatistics';

/**
 * Combined hook for all dashboard statistics
 */
export function useDashboardStatistics(
  filters?: DashboardStatisticsFilters
) {
  const appointments = useAppointmentStatistics(filters);
  const students = useStudentStatistics(filters);
  const health = useHealthRecordsStatistics(filters);
  const medications = useMedicationStatistics(filters);
  const inventory = useInventoryStatistics(filters);
  const incidents = useIncidentStatistics(filters);

  return {
    appointments,
    students,
    health,
    medications,
    inventory,
    incidents,

    // Aggregate states
    isLoading: appointments.isLoading || students.isLoading ||
               health.isLoading || medications.isLoading ||
               inventory.isLoading || incidents.isLoading,

    isError: appointments.isError || students.isError ||
             health.isError || medications.isError ||
             inventory.isError || incidents.isError,

    // Utility functions
    refetchAll: () => {
      appointments.refetch();
      students.refetch();
      health.refetch();
      medications.refetch();
      inventory.refetch();
      incidents.refetch();
    },
  };
}
