/**
 * Medication Dashboard Composite Hook
 *
 * Combined hook aggregating multiple medication queries for dashboard views.
 * Provides unified loading/error states and bulk refetch capability.
 *
 * @module hooks/domains/medications/queries/useMedicationDashboard
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMedicationsList } from './useMedicationCoreQueries';
import { useUpcomingReminders } from './useMedicationScheduleQueries';
import {
  useMedicationInventory,
  useMedicationAlerts,
  useMedicationStatistics
} from './useMedicationMonitoringQueries';

/**
 * Combined hook for medication dashboard
 */
export function useMedicationDashboard() {
  const medications = useMedicationsList({ limit: 20 });
  const inventory = useMedicationInventory();
  const upcomingReminders = useUpcomingReminders(24);
  const alerts = useMedicationAlerts();
  const statistics = useMedicationStatistics();

  return {
    medications,
    inventory,
    upcomingReminders,
    alerts,
    statistics,
    isLoading: medications.isLoading || inventory.isLoading || upcomingReminders.isLoading,
    isError: medications.isError || inventory.isError || upcomingReminders.isError,
    refetchAll: () => {
      medications.refetch();
      inventory.refetch();
      upcomingReminders.refetch();
      alerts.refetch();
      statistics.refetch();
    },
  };
}
