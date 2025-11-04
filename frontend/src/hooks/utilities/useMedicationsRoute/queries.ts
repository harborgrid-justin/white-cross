/**
 * WF-ROUTE-002 | queries.ts - Data fetching queries for useMedicationsRoute
 * Purpose: React Query hooks for fetching medication data
 * Upstream: @/lib/api, @/hooks/domains/medications | Dependencies: React Query
 * Downstream: useMedicationsRoute | Called by: Main hook
 * Related: medicationKeys, apiActions
 * Exports: useMedicationsQueries
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Centralized data fetching for medications route
 */

import { useQuery } from '@tanstack/react-query';
import { medicationKeys } from '@/hooks/domains/medications/mutations/useOptimisticMedications';
import { apiActions } from '@/lib/api';
import type { MedicationsRouteState } from './types';

/**
 * Hook for all medication-related queries
 */
export function useMedicationsQueries(state: MedicationsRouteState) {
  /**
   * Main medications query
   */
  const medicationsQuery = useQuery({
    queryKey: medicationKeys.list(state.filters),
    queryFn: async () => {
      const response = await apiActions.medications.getAll({
        page: state.page,
        limit: state.pageSize,
        ...state.filters,
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  } as any);

  /**
   * Medication schedule query
   */
  const scheduleQuery = useQuery({
    queryKey: medicationKeys.schedule(state.dateRange.startDate, state.dateRange.endDate),
    queryFn: async () => {
      const response = await apiActions.medications.getSchedule(
        state.dateRange.startDate,
        state.dateRange.endDate
      );
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (schedule changes frequently)
  } as any);

  /**
   * Medication inventory query
   */
  const inventoryQuery = useQuery({
    queryKey: medicationKeys.inventory(),
    queryFn: async () => {
      const response = await apiActions.medications.getInventory();
      return response;
    },
    staleTime: 10 * 60 * 1000,
  } as any);

  /**
   * Administration logs query
   */
  const administrationQuery = useQuery({
    queryKey: medicationKeys.administrationLogs(state.dateRange.startDate),
    queryFn: async () => {
      // Use logAdministration or another method since getAdministrationLogs doesn't exist
      return { data: [] }; // Placeholder - would need proper API method
    },
    enabled: state.activeTab === 'administration',
    staleTime: 1 * 60 * 1000, // 1 minute
  } as any);

  /**
   * Medication reminders query
   */
  const remindersQuery = useQuery({
    queryKey: medicationKeys.reminders(new Date().toISOString().split('T')[0]),
    queryFn: async () => {
      const response = await apiActions.medications.getReminders(new Date().toISOString().split('T')[0]);
      return response;
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 1 * 60 * 1000,
  } as any);

  return {
    medicationsQuery,
    scheduleQuery,
    inventoryQuery,
    administrationQuery,
    remindersQuery,
  };
}
