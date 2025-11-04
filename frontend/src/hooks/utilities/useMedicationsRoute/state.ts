/**
 * WF-ROUTE-002 | state.ts - State management for useMedicationsRoute
 * Purpose: Default state and state update utilities
 * Upstream: ./types | Dependencies: React
 * Downstream: useMedicationsRoute | Called by: Main hook
 * Related: MedicationsRouteState
 * Exports: defaultState, useRouteState
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Default state configuration and state management hooks
 */

import { useState, useCallback } from 'react';
import type { MedicationsRouteState } from './types';

/**
 * Default route state
 */
export const defaultState: MedicationsRouteState = {
  selectedMedication: null,
  selectedStudentMedication: null,
  activeTab: 'medications',
  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,
  showAdministrationModal: false,
  showInventoryModal: false,
  showAdverseReactionModal: false,
  filters: {
    searchTerm: '',
    categoryFilter: '',
    statusFilter: 'active',
    studentFilter: '',
    nurseFilter: '',
    urgencyFilter: '',
  },
  sortColumn: null,
  sortDirection: 'asc',
  page: 1,
  pageSize: 20,
  dateRange: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
  },
  loading: false,
  searchTerm: '',
};

/**
 * Hook for managing route state with URL persistence support
 */
export function useRouteState() {
  const [state, setState] = useState<MedicationsRouteState>(defaultState);

  // Simple state update function (URL persistence could be added later with Next.js router)
  const updateRouteState = useCallback((updates: Partial<MedicationsRouteState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    state,
    setState,
    updateRouteState,
  };
}
