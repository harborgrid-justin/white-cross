/**
 * Student Selection Redux Hook
 *
 * Hook for managing student selection with Redux integration.
 * Provides selection state and management functions.
 *
 * @module hooks/students/redux/selection
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
 * Hook for managing student selection with Redux integration
 *
 * @returns Selection state and management functions
 *
 * @example
 * ```tsx
 * const {
 *   selectedIds,
 *   isSelected,
 *   toggleSelection,
 *   selectAll,
 *   hasSelection
 * } = useStudentSelection();
 * ```
 */
export const useStudentSelection = () => {
  const selectedIds = useSelector(mockSelectors.selectSelectedStudentIds);
  const isSelectionMode = useSelector(mockSelectors.selectIsSelectionMode);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Get current students for bulk selection
  const currentStudents = useMemo(() => {
    const data = queryClient.getQueryData(studentQueryKeys.lists.active());
    return Array.isArray(data) ? data : data?.students || [];
  }, [queryClient]);

  const actions = useMemo(() => ({
    isSelected: (id: string) => selectedIds.includes(id),

    toggleSelection: (id: string) => {
      dispatch(mockActions.toggleSelection(id));
    },

    selectStudent: (id: string) => {
      if (!selectedIds.includes(id)) {
        dispatch(mockActions.selectStudent(id));
      }
    },

    deselectStudent: (id: string) => {
      if (selectedIds.includes(id)) {
        dispatch(mockActions.deselectStudent(id));
      }
    },

    selectAll: () => {
      const allIds = currentStudents.map((s: Student) => s.id);
      dispatch(mockActions.selectMultipleStudents(allIds));
    },

    selectNone: () => {
      dispatch(mockActions.clearSelection());
    },

    selectRange: (startId: string, endId: string) => {
      const startIndex = currentStudents.findIndex((s: Student) => s.id === startId);
      const endIndex = currentStudents.findIndex((s: Student) => s.id === endId);

      if (startIndex !== -1 && endIndex !== -1) {
        const rangeStart = Math.min(startIndex, endIndex);
        const rangeEnd = Math.max(startIndex, endIndex);
        const rangeIds = currentStudents
          .slice(rangeStart, rangeEnd + 1)
          .map((s: Student) => s.id);

        dispatch(mockActions.selectMultipleStudents([...selectedIds, ...rangeIds]));
      }
    },

    toggleSelectionMode: () => {
      dispatch(mockActions.setSelectionMode(!isSelectionMode));
      if (isSelectionMode) {
        dispatch(mockActions.clearSelection());
      }
    },
  }), [selectedIds, isSelectionMode, currentStudents, dispatch]);

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    hasSelection: selectedIds.length > 0,
    isSelectionMode,
    allSelected: selectedIds.length === currentStudents.length && currentStudents.length > 0,
    ...actions,
  };
};
