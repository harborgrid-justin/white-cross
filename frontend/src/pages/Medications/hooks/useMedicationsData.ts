/**
 * useMedicationsData Hook
 *
 * Manages data fetching and state for medications
 *
 * @module hooks/useMedicationsData
 */

import { useQuery } from '@tanstack/react-query';
import { medicationsApi } from '@/services/api';
import { QUERY_INTERVALS } from '@/constants';
import type { MedicationTab, MedicationFilters } from '../types';

interface UseMedicationsDataParams {
  activeTab: MedicationTab;
  filters: MedicationFilters;
  page: number;
  pageSize: number;
  isRestored: boolean;
}

/**
 * Custom hook for managing medications data across different tabs
 */
export function useMedicationsData({
  activeTab,
  filters,
  page,
  pageSize,
  isRestored,
}: UseMedicationsDataParams) {
  // Medications list query
  const {
    data: medicationsData,
    isLoading: medicationsLoading,
    isFetching: medicationsFetching,
  } = useQuery({
    queryKey: [
      'medications',
      filters.searchTerm,
      page,
      pageSize,
      filters.dosageForm,
      filters.controlledStatus,
    ],
    queryFn: () =>
      medicationsApi.getAll({
        page,
        limit: pageSize,
        search: filters.searchTerm,
        dosageForm: filters.dosageForm,
        controlled: filters.controlledStatus,
      }),
    enabled: activeTab === 'medications' && isRestored,
  });

  // Inventory query
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['medication-inventory'],
    queryFn: () => medicationsApi.getInventory(),
    enabled: activeTab === 'inventory',
  });

  // Reminders query with auto-refresh
  const { data: remindersData, isLoading: remindersLoading } = useQuery({
    queryKey: ['medication-reminders'],
    queryFn: () => medicationsApi.getReminders(),
    enabled: activeTab === 'reminders',
    refetchInterval: QUERY_INTERVALS.REMINDERS,
  });

  // Adverse reactions query
  const {
    data: adverseReactionsData,
    isLoading: adverseReactionsLoading,
  } = useQuery({
    queryKey: ['adverse-reactions'],
    queryFn: () => medicationsApi.getAdverseReactions(''),
    enabled: activeTab === 'adverse-reactions',
  });

  return {
    // Medications data
    medications: (medicationsData as any)?.data || [],
    medicationsLoading: medicationsLoading || !isRestored,
    medicationsFetching,

    // Inventory data
    inventory: (inventoryData as any)?.data || { inventory: [], alerts: {} },
    inventoryLoading,

    // Reminders data
    reminders: (remindersData as any)?.data || { reminders: [] },
    remindersLoading,

    // Adverse reactions data
    adverseReactions: (adverseReactionsData as any)?.data || { reactions: [] },
    adverseReactionsLoading,
  };
}
