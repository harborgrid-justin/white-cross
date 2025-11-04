/**
 * WF-ROUTE-002 | actions.ts - Action handlers for useMedicationsRoute
 * Purpose: Action handlers for medication route operations
 * Upstream: ./types, ./state | Dependencies: React
 * Downstream: useMedicationsRoute | Called by: Main hook
 * Related: MedicationsRouteState
 * Exports: useMedicationsActions
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: User action handlers for medication route
 */

import { useCallback } from 'react';
import type {
  Medication,
  StudentMedication,
  MedicationsRouteState,
  MedicationFilters,
  MedicationSortColumn,
} from './types';

interface ActionsParams {
  setState: React.Dispatch<React.SetStateAction<MedicationsRouteState>>;
  updateRouteState: (updates: Partial<MedicationsRouteState>) => void;
  state: MedicationsRouteState;
  queries: any;
}

/**
 * Hook for all medication route actions
 */
export function useMedicationsActions({ setState, updateRouteState, state, queries }: ActionsParams) {
  return {
    // Tab management
    setActiveTab: useCallback((tab: MedicationsRouteState['activeTab']) => {
      setState(prev => ({ ...prev, activeTab: tab }));
      updateRouteState({ activeTab: tab });
    }, [setState, updateRouteState]),

    // Medication selection
    selectMedication: useCallback((medication: Medication | null) => {
      setState(prev => ({ ...prev, selectedMedication: medication }));
    }, [setState]),

    selectStudentMedication: useCallback((studentMedication: StudentMedication | null) => {
      setState(prev => ({ ...prev, selectedStudentMedication: studentMedication }));
    }, [setState]),

    // Modal controls
    openCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: true }));
    }, [setState]),

    closeCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: false }));
    }, [setState]),

    openEditModal: useCallback((medication: Medication) => {
      setState(prev => ({ ...prev, selectedMedication: medication, showEditModal: true }));
    }, [setState]),

    closeEditModal: useCallback(() => {
      setState(prev => ({ ...prev, showEditModal: false }));
    }, [setState]),

    openDeleteModal: useCallback((medication: Medication) => {
      setState(prev => ({ ...prev, selectedMedication: medication, showDeleteModal: true }));
    }, [setState]),

    closeDeleteModal: useCallback(() => {
      setState(prev => ({ ...prev, showDeleteModal: false }));
    }, [setState]),

    openAdministrationModal: useCallback((studentMedication: StudentMedication) => {
      setState(prev => ({
        ...prev,
        selectedStudentMedication: studentMedication,
        showAdministrationModal: true
      }));
    }, [setState]),

    closeAdministrationModal: useCallback(() => {
      setState(prev => ({ ...prev, showAdministrationModal: false }));
    }, [setState]),

    openInventoryModal: useCallback((medication: Medication) => {
      setState(prev => ({ ...prev, selectedMedication: medication, showInventoryModal: true }));
    }, [setState]),

    closeInventoryModal: useCallback(() => {
      setState(prev => ({ ...prev, showInventoryModal: false }));
    }, [setState]),

    openAdverseReactionModal: useCallback((studentMedication: StudentMedication) => {
      setState(prev => ({
        ...prev,
        selectedStudentMedication: studentMedication,
        showAdverseReactionModal: true
      }));
    }, [setState]),

    closeAdverseReactionModal: useCallback(() => {
      setState(prev => ({ ...prev, showAdverseReactionModal: false }));
    }, [setState]),

    // Filters and search
    updateFilters: useCallback((newFilters: Partial<MedicationFilters>) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
        page: 1
      }));
      updateRouteState({ filters: { ...state.filters, ...newFilters }, page: 1 });
    }, [setState, state.filters, updateRouteState]),

    setSearchTerm: useCallback((searchTerm: string) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, searchTerm },
        page: 1
      }));
    }, [setState]),

    // Date range
    setDateRange: useCallback((startDate: string, endDate: string) => {
      setState(prev => ({ ...prev, dateRange: { startDate, endDate } }));
      updateRouteState({ dateRange: { startDate, endDate } });
    }, [setState, updateRouteState]),

    // Sorting
    updateSort: useCallback((column: MedicationSortColumn) => {
      setState(prev => ({
        ...prev,
        sortColumn: column,
        sortDirection: prev.sortColumn === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      }));
    }, [setState]),

    // Pagination
    goToPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, page }));
      updateRouteState({ page });
    }, [setState, updateRouteState]),

    setPageSize: useCallback((pageSize: number) => {
      setState(prev => ({ ...prev, pageSize, page: 1 }));
      updateRouteState({ pageSize, page: 1 });
    }, [setState, updateRouteState]),

    // Data refresh
    refetchData: useCallback(() => {
      queries.medicationsQuery.refetch();
      queries.scheduleQuery.refetch();
      queries.inventoryQuery.refetch();
      queries.remindersQuery.refetch();
    }, [queries]),
  };
}
