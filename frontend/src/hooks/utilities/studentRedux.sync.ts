/**
 * Redux Synchronization Hook
 *
 * Hook for synchronizing server state changes with Redux UI state.
 * Handles cleanup and validation of selections when data changes.
 *
 * @module hooks/students/redux/sync
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';
import { useCacheManager } from './utils';
import { mockSelectors, mockActions } from './studentRedux.mocks';
import type { Student } from '@/types/student.types';

/**
 * Hook for synchronizing server state changes with Redux UI state
 *
 * @returns Synchronization utilities
 *
 * @example
 * ```tsx
 * const { syncSelectedStudents, clearInvalidSelections } = useReduxSync();
 *
 * // Automatically clear selections for deleted students
 * useEffect(() => {
 *   clearInvalidSelections();
 * }, [clearInvalidSelections]);
 * ```
 */
export const useReduxSync = () => {
  const dispatch = useDispatch();
  const selectedIds = useSelector(mockSelectors.selectSelectedStudentIds);
  const queryClient = useQueryClient();
  const { updateStudentInCache } = useCacheManager();

  /**
   * Sync selected students when server data changes
   */
  const syncSelectedStudents = useCallback(() => {
    const currentData = queryClient.getQueryData(studentQueryKeys.lists.active());
    const currentStudents = Array.isArray(currentData) ? currentData : currentData?.students || [];
    const currentIds = currentStudents.map((s: Student) => s.id);

    // Remove selections for students that no longer exist
    const validSelectedIds = selectedIds.filter(id => currentIds.includes(id));

    if (validSelectedIds.length !== selectedIds.length) {
      dispatch(mockActions.selectMultipleStudents(validSelectedIds));
    }
  }, [queryClient, selectedIds, dispatch]);

  /**
   * Clear selections for students that no longer exist
   */
  const clearInvalidSelections = useCallback(() => {
    syncSelectedStudents();
  }, [syncSelectedStudents]);

  /**
   * Update Redux state when specific student is updated
   */
  const syncStudentUpdate = useCallback((studentId: string, updates: Partial<Student>) => {
    // Update cache first
    updateStudentInCache(studentId, updates);

    // Add to recently viewed if not already there
    dispatch(mockActions.addToRecentlyViewed(studentId));
  }, [updateStudentInCache, dispatch]);

  /**
   * Handle student deletion in Redux state
   */
  const syncStudentDeletion = useCallback((studentId: string) => {
    // Remove from selections
    dispatch(mockActions.deselectStudent(studentId));

    // Close edit modal if this student was being edited
    // This would check if the editing student ID matches
    dispatch(mockActions.closeEditModal());
  }, [dispatch]);

  // Auto-sync on mount and when selected IDs change
  useEffect(() => {
    syncSelectedStudents();
  }, [syncSelectedStudents]);

  return {
    syncSelectedStudents,
    clearInvalidSelections,
    syncStudentUpdate,
    syncStudentDeletion,
  };
};
