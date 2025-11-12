/**
 * Student View State Hooks
 *
 * Hooks for managing view mode, search, and active filter state
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectStudentViewMode,
  selectStudentSearchQuery,
  selectShowInactiveStudents,
  type StudentUIState,
} from '@/stores/slices/students';

/**
 * Hook for managing student view mode (grid, list, table)
 *
 * @example
 * ```tsx
 * const { viewMode, setViewMode, isGridView, isListView, isTableView } = useStudentViewMode();
 *
 * // Switch to grid view
 * setViewMode('grid');
 *
 * // Check current view
 * if (isGridView) {
 *   return <StudentGridView />;
 * }
 * ```
 */
export const useStudentViewMode = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector(selectStudentViewMode);

  const setViewMode = useCallback((mode: StudentUIState['viewMode']) => {
    dispatch(studentsActions.setViewMode(mode));
  }, [dispatch]);

  const setGridView = useCallback(() => setViewMode('grid'), [setViewMode]);
  const setListView = useCallback(() => setViewMode('list'), [setViewMode]);
  const setTableView = useCallback(() => setViewMode('table'), [setViewMode]);

  return {
    viewMode,
    setViewMode,
    setGridView,
    setListView,
    setTableView,
    isGridView: viewMode === 'grid',
    isListView: viewMode === 'list',
    isTableView: viewMode === 'table',
  };
};

/**
 * Hook for managing student search
 *
 * @example
 * ```tsx
 * const {
 *   searchQuery,
 *   setSearchQuery,
 *   clearSearch,
 *   hasSearch
 * } = useStudentSearch();
 *
 * // Set search query
 * setSearchQuery('John Doe');
 *
 * // Clear search
 * clearSearch();
 * ```
 */
export const useStudentSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectStudentSearchQuery);

  const setSearchQuery = useCallback((query: string) => {
    dispatch(studentsActions.setSearchQuery(query));
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, [setSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    hasSearch: searchQuery.trim().length > 0,
  };
};

/**
 * Hook for managing inactive student visibility
 *
 * @example
 * ```tsx
 * const { showInactive, toggleShowInactive, showOnlyActive, showAll } = useStudentActiveFilter();
 * ```
 */
export const useStudentActiveFilter = () => {
  const dispatch = useAppDispatch();
  const showInactive = useAppSelector(selectShowInactiveStudents);

  const toggleShowInactive = useCallback(() => {
    dispatch(studentsActions.toggleShowInactive());
  }, [dispatch]);

  const showOnlyActive = useCallback(() => {
    if (showInactive) {
      toggleShowInactive();
    }
  }, [showInactive, toggleShowInactive]);

  const showAll = useCallback(() => {
    if (!showInactive) {
      toggleShowInactive();
    }
  }, [showInactive, toggleShowInactive]);

  return {
    showInactive,
    toggleShowInactive,
    showOnlyActive,
    showAll,
    showingOnlyActive: !showInactive,
  };
};
