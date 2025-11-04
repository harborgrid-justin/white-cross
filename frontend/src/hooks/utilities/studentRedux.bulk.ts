/**
 * Bulk Operations Redux Hook
 *
 * Hook for managing bulk operations with Redux state.
 * Handles bulk selection and bulk action execution.
 *
 * @module hooks/students/redux/bulk
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useDispatch, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';
import { mockSelectors, mockActions } from './studentRedux.mocks';
import type { Student } from '@/types/student.types';

/**
 * Hook for managing bulk operations with Redux state
 *
 * @returns Bulk operation state and controls
 *
 * @example
 * ```tsx
 * const {
 *   isBulkMode,
 *   selectedForBulk,
 *   enterBulkMode,
 *   selectAllForBulk,
 *   performBulkAction
 * } = useBulkOperations();
 * ```
 */
export const useBulkOperations = () => {
  const uiState = useSelector(mockSelectors.selectStudentUIState);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const selectedStudents = useMemo(() => {
    const data = queryClient.getQueryData(studentQueryKeys.lists.active());
    const students = Array.isArray(data) ? data : data?.students || [];
    return students.filter((s: Student) =>
      uiState.selectedForBulkOperation.includes(s.id)
    );
  }, [queryClient, uiState.selectedForBulkOperation]);

  const actions = useMemo(() => ({
    enterBulkMode: () => {
      dispatch(mockActions.enterBulkMode());
    },

    exitBulkMode: () => {
      dispatch(mockActions.exitBulkMode());
    },

    selectAllForBulk: () => {
      const data = queryClient.getQueryData(studentQueryKeys.lists.active());
      const students = Array.isArray(data) ? data : data?.students || [];
      const allIds = students.map((s: Student) => s.id);
      dispatch(mockActions.selectForBulkOperation(allIds));
    },

    clearBulkSelection: () => {
      dispatch(mockActions.selectForBulkOperation([]));
    },

    toggleBulkSelection: (id: string) => {
      const current = uiState.selectedForBulkOperation;
      const newSelection = current.includes(id)
        ? current.filter(sid => sid !== id)
        : [...current, id];
      dispatch(mockActions.selectForBulkOperation(newSelection));
    },

    performBulkAction: async (action: string, data?: any) => {
      // This would implement actual bulk operations
      // For now, just log the action
      console.log('Bulk action:', action, 'on', uiState.selectedForBulkOperation.length, 'students');

      // After successful bulk action, clear selections
      dispatch(mockActions.selectForBulkOperation([]));
      dispatch(mockActions.exitBulkMode());
    },
  }), [dispatch, queryClient, uiState.selectedForBulkOperation]);

  return {
    isBulkMode: uiState.bulkOperationMode,
    selectedForBulk: uiState.selectedForBulkOperation,
    selectedStudents,
    selectedCount: uiState.selectedForBulkOperation.length,
    hasSelection: uiState.selectedForBulkOperation.length > 0,
    ...actions,
  };
};
