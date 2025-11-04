/**
 * Main Redux Integration Hook
 *
 * Primary hook that combines TanStack Query server state with Redux UI state,
 * providing seamless integration between server data and global UI state.
 *
 * @module hooks/students/redux/hooks
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';
import { mockSelectors, mockActions } from './studentRedux.mocks';
import type { Student } from '@/types/student.types';

/**
 * Hook that combines TanStack Query data with Redux UI state
 *
 * @param filters - Additional filters for data fetching
 * @returns Combined server state and UI state with actions
 *
 * @example
 * ```tsx
 * const {
 *   students,
 *   selectedStudents,
 *   isLoading,
 *   selectStudent,
 *   toggleSelectionMode,
 *   appliedFilters
 * } = useStudentsWithRedux();
 *
 * return (
 *   <StudentList
 *     students={students}
 *     selectedIds={selectedStudents.map(s => s.id)}
 *     onSelect={selectStudent}
 *     loading={isLoading}
 *   />
 * );
 * ```
 */
export const useStudentsWithRedux = (filters?: Record<string, any>) => {
  // Redux state and actions
  const uiState = useSelector(mockSelectors.selectStudentUIState);
  const dispatch = useDispatch();

  // Combine filters from props and Redux state
  const combinedFilters = useMemo(() => ({
    ...filters,
    ...uiState.appliedFilters,
    isActive: uiState.showInactiveStudents ? undefined : true,
  }), [filters, uiState.appliedFilters, uiState.showInactiveStudents]);

  // TanStack Query for server state
  const studentsQuery = useQuery({
    queryKey: studentQueryKeys.lists.filtered(combinedFilters),
    queryFn: async () => {
      // This would use your actual API call
      return { students: [] as Student[], pagination: { total: 0, page: 1, limit: 50 } };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoized selected students
  const selectedStudents = useMemo(() => {
    if (!studentsQuery.data?.students || !uiState.selectedStudentIds.length) {
      return [];
    }

    return studentsQuery.data.students.filter(student =>
      uiState.selectedStudentIds.includes(student.id)
    );
  }, [studentsQuery.data?.students, uiState.selectedStudentIds]);

  // Enhanced action creators that dispatch Redux actions
  const actions = useMemo(() => ({
    // Selection actions
    selectStudent: (id: string) => {
      dispatch(mockActions.selectStudent(id));
      dispatch(mockActions.addToRecentlyViewed(id));
    },

    toggleSelection: (id: string) => {
      dispatch(mockActions.toggleSelection(id));
    },

    selectAll: () => {
      const allIds = studentsQuery.data?.students.map(s => s.id) || [];
      dispatch(mockActions.selectMultipleStudents(allIds));
    },

    clearSelection: () => {
      dispatch(mockActions.clearSelection());
    },

    // UI state actions
    toggleSelectionMode: () => {
      dispatch(mockActions.setSelectionMode(!uiState.isSelectionMode));
    },

    setViewMode: (mode: 'list' | 'grid' | 'table') => {
      dispatch(mockActions.setViewMode(mode));
    },

    toggleInactiveStudents: () => {
      dispatch(mockActions.setShowInactiveStudents(!uiState.showInactiveStudents));
    },

    // Filter actions
    updateFilters: (newFilters: Record<string, any>) => {
      dispatch(mockActions.setFilters({ ...uiState.appliedFilters, ...newFilters }));
    },

    clearFilters: () => {
      dispatch(mockActions.clearFilters());
    },

    // Modal actions
    openCreateModal: () => {
      dispatch(mockActions.openCreateModal());
    },

    openEditModal: (studentId: string) => {
      dispatch(mockActions.openEditModal(studentId));
    },

    closeModals: () => {
      dispatch(mockActions.closeCreateModal());
      dispatch(mockActions.closeEditModal());
    },

    // Bulk operations
    enterBulkMode: () => {
      dispatch(mockActions.enterBulkMode());
      dispatch(mockActions.setSelectionMode(true));
    },

    exitBulkMode: () => {
      dispatch(mockActions.exitBulkMode());
      dispatch(mockActions.clearSelection());
      dispatch(mockActions.setSelectionMode(false));
    },
  }), [dispatch, uiState, studentsQuery.data?.students]);

  return {
    // Server state from TanStack Query
    students: studentsQuery.data?.students || [],
    pagination: studentsQuery.data?.pagination,
    isLoading: studentsQuery.isLoading,
    isFetching: studentsQuery.isFetching,
    error: studentsQuery.error,
    refetch: studentsQuery.refetch,

    // Combined state
    selectedStudents,
    hasSelection: selectedStudents.length > 0,
    allSelected: selectedStudents.length === (studentsQuery.data?.students.length || 0),

    // UI state from Redux
    uiState,

    // Enhanced actions
    actions,
  };
};
