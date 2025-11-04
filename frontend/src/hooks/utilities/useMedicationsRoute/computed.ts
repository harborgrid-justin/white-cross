/**
 * WF-ROUTE-002 | computed.ts - Computed values for useMedicationsRoute
 * Purpose: Data processing and computed values for medications
 * Upstream: ./types, ./queries | Dependencies: React
 * Downstream: useMedicationsRoute | Called by: Main hook
 * Related: Medication types, query results
 * Exports: useMedicationsData, useScheduleData, useInventoryData, useUIState
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Computed values, filtering, sorting, and pagination
 */

import { useMemo } from 'react';
import type {
  Medication,
  InventoryItem,
  MedicationsRouteState,
} from './types';

/**
 * Process medications data with filtering, sorting, and pagination
 */
export function useMedicationsData(queryData: any, state: MedicationsRouteState) {
  return useMemo(() => {
    const apiResponse = queryData as any;
    const medications: Medication[] = apiResponse?.data?.medications || apiResponse?.medications || [];

    // Apply search filter
    let filtered = medications.filter((medication: Medication) => {
      const searchLower = state.filters.searchTerm.toLowerCase();
      const medAny = medication as any;
      return (
        medication.name.toLowerCase().includes(searchLower) ||
        (medication.genericName && medication.genericName.toLowerCase().includes(searchLower)) ||
        (medAny.brandName && medAny.brandName.toLowerCase().includes(searchLower))
      );
    });

    // Apply other filters
    if (state.filters.categoryFilter) {
      filtered = filtered.filter((m: Medication) => (m as any).category === state.filters.categoryFilter);
    }
    if (state.filters.statusFilter) {
      filtered = filtered.filter((m: Medication) =>
        state.filters.statusFilter === 'active' ? (m as any).isActive : !(m as any).isActive
      );
    }

    // Apply sorting
    if (state.sortColumn) {
      filtered.sort((a: Medication, b: Medication) => {
        const valueA = (a as any)[state.sortColumn!];
        const valueB = (b as any)[state.sortColumn!];

        let comparison = 0;
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else {
          comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }

        return state.sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / state.pageSize);
    const startIndex = (state.page - 1) * state.pageSize;
    const paginatedMedications = filtered.slice(startIndex, startIndex + state.pageSize);

    return {
      all: medications,
      filtered,
      paginated: paginatedMedications,
      totalCount,
      totalPages,
      currentPage: state.page,
      pageSize: state.pageSize,
    };
  }, [queryData, state.filters, state.sortColumn, state.sortDirection, state.page, state.pageSize]);
}

/**
 * Process schedule data
 */
export function useScheduleData(queryData: any) {
  return useMemo(() => {
    const apiResponse = queryData as any;
    const schedule: any[] = apiResponse?.data || apiResponse?.schedule || [];
    const today = new Date().toISOString().split('T')[0];

    return {
      all: schedule,
      today: schedule.filter((item: any) =>
        item.scheduledTime && item.scheduledTime.startsWith(today)
      ),
      upcoming: schedule.filter((item: any) =>
        item.scheduledTime && item.scheduledTime > new Date().toISOString()
      ),
      overdue: schedule.filter((item: any) =>
        item.scheduledTime && item.scheduledTime < new Date().toISOString() && !item.administered
      ),
    };
  }, [queryData]);
}

/**
 * Process inventory data with alerts
 */
export function useInventoryData(queryData: any) {
  return useMemo(() => {
    const apiResponse = queryData as any;
    const inventory: InventoryItem[] = apiResponse?.data || apiResponse?.inventory || [];

    return {
      all: inventory,
      lowStock: inventory.filter((item: InventoryItem) =>
        (item as any).currentStock <= (item as any).minimumStock
      ),
      expiringSoon: inventory.filter((item: InventoryItem) => {
        const expiryDate = new Date((item as any).expiryDate);
        const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return expiryDate <= thirtyDaysFromNow;
      }),
      expired: inventory.filter((item: InventoryItem) =>
        new Date((item as any).expiryDate) <= new Date()
      ),
    };
  }, [queryData]);
}

/**
 * Compute UI state from queries, mutations, and data
 */
export function useUIState(
  state: MedicationsRouteState,
  queries: any,
  mutations: any,
  medicationsData: any,
  scheduleData: any,
  inventoryData: any
) {
  return {
    // Loading states
    loading: queries.medicationsQuery.isLoading || queries.medicationsQuery.isFetching,
    loadingSchedule: queries.scheduleQuery.isLoading,
    loadingInventory: queries.inventoryQuery.isLoading,
    loadingAdministration: queries.administrationQuery.isLoading,

    // Error states
    error: queries.medicationsQuery.error || queries.scheduleQuery.error || queries.inventoryQuery.error,

    // Modal states
    showCreateModal: state.showCreateModal,
    showEditModal: state.showEditModal,
    showDeleteModal: state.showDeleteModal,
    showAdministrationModal: state.showAdministrationModal,
    showInventoryModal: state.showInventoryModal,
    showAdverseReactionModal: state.showAdverseReactionModal,

    // Tab state
    activeTab: state.activeTab,

    // Data states
    hasMedications: (medicationsData.all?.length || 0) > 0,
    hasSchedule: (scheduleData.today?.length || 0) > 0,
    hasOverdue: (scheduleData.overdue?.length || 0) > 0,
    hasLowStock: (inventoryData.lowStock?.length || 0) > 0,
    hasExpiring: (inventoryData.expiringSoon?.length || 0) > 0,

    // Alert counts
    alertCounts: {
      overdue: scheduleData.overdue?.length || 0,
      lowStock: inventoryData.lowStock?.length || 0,
      expiring: inventoryData.expiringSoon?.length || 0,
      expired: inventoryData.expired?.length || 0,
    },

    // Mutation states
    isCreating: (mutations.createMutation as any).isPending || mutations.createMutation.isLoading,
    isUpdating: (mutations.updateMutation as any).isPending || mutations.updateMutation.isLoading,
    isDeleting: (mutations.deleteMutation as any).isPending || mutations.deleteMutation.isLoading,
    isAdministering: (mutations.administrationMutation as any).isPending || mutations.administrationMutation.isLoading,
    isUpdatingInventory: (mutations.inventoryMutation as any).isPending || mutations.inventoryMutation.isLoading,
  };
}
