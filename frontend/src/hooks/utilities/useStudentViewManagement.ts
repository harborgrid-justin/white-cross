/**
 * Student View Management Hooks
 *
 * Specialized Redux hooks for managing student view state including
 * view modes, filters, sorting, pagination, and UI preferences.
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectStudentUIState,
  selectFilteredAndSortedStudents,
  selectPaginatedStudents,
} from '@/stores/slices/studentsSlice';

// Re-export individual hooks from modular files
export {
  useStudentViewMode,
  useStudentSearch,
  useStudentActiveFilter,
} from './useStudentViewState';

export {
  useStudentFilters,
  useStudentSorting,
} from './useStudentFiltersAndSort';

export {
  useStudentPagination,
  useStudentCardExpansion,
} from './useStudentPaginationAndCards';

// Import for composite hook
import { useStudentViewMode, useStudentSearch, useStudentActiveFilter } from './useStudentViewState';
import { useStudentFilters, useStudentSorting } from './useStudentFiltersAndSort';
import { useStudentPagination, useStudentCardExpansion } from './useStudentPaginationAndCards';

/**
 * Composite hook that combines all student view management
 *
 * @example
 * ```tsx
 * const studentView = useStudentViewManagement();
 *
 * // Access all view management features
 * const {
 *   viewMode,
 *   filters,
 *   sorting,
 *   pagination,
 *   search,
 *   selection,
 *   cards,
 *   activeFilter,
 *   resetAllUIState
 * } = studentView;
 * ```
 */
export const useStudentViewManagement = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector(selectStudentUIState);

  const viewMode = useStudentViewMode();
  const filters = useStudentFilters();
  const search = useStudentSearch();
  const sorting = useStudentSorting();
  const pagination = useStudentPagination();
  const cards = useStudentCardExpansion();
  const activeFilter = useStudentActiveFilter();

  const resetAllUIState = useCallback(() => {
    dispatch(studentsActions.resetUIState());
  }, [dispatch]);

  // Get filtered and paginated data
  const filteredStudents = useAppSelector(selectFilteredAndSortedStudents);
  const paginatedStudents = useAppSelector(selectPaginatedStudents);

  return {
    // Individual hook objects
    viewMode,
    filters,
    search,
    sorting,
    pagination,
    cards,
    activeFilter,

    // Raw UI state
    uiState,

    // Data
    filteredStudents,
    paginatedStudents,

    // Actions
    resetAllUIState,

    // Computed state
    hasAnyFilters: filters.hasActiveFilters || search.hasSearch,
    totalFiltered: filteredStudents.length,
  };
};
