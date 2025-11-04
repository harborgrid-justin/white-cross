/**
 * Student Optimistic Update Utilities
 *
 * Utilities for performing optimistic updates with rollback capability,
 * providing instant UI feedback while ensuring data consistency.
 *
 * @module hooks/utilities/studentOptimisticUtils
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { useCacheManager } from './studentCacheUtils';
import { studentQueryKeys } from './queryKeys';
import type { Student } from '@/types/student.types';

/**
 * Hook for optimistic updates with rollback capability
 *
 * @returns Optimistic update utilities
 *
 * @example
 * ```tsx
 * const { performOptimisticUpdate, rollbackUpdate } = useOptimisticUpdates();
 *
 * const updateStudent = async (id: string, data: Partial<Student>) => {
 *   const rollback = performOptimisticUpdate('student-update', id, data);
 *
 *   try {
 *     await studentsApi.update(id, data);
 *   } catch (error) {
 *     rollback();
 *     throw error;
 *   }
 * };
 * ```
 */
export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();
  const { updateStudentInCache, invalidatePattern } = useCacheManager();
  const rollbacksRef = useRef<Map<string, () => void>>(new Map());

  /**
   * Perform optimistic update with rollback capability
   */
  const performOptimisticUpdate = useCallback(
    (updateId: string, studentId: string, updates: Partial<Student>): (() => void) => {
      // Store original data for rollback
      const originalData = queryClient.getQueryData(
        studentQueryKeys.details.byId(studentId)
      );

      // Perform optimistic update
      updateStudentInCache(studentId, updates);

      // Create rollback function
      const rollback = () => {
        if (originalData) {
          queryClient.setQueryData(
            studentQueryKeys.details.byId(studentId),
            originalData
          );
          invalidatePattern('student-lists');
        }
        rollbacksRef.current.delete(updateId);
      };

      // Store rollback function
      rollbacksRef.current.set(updateId, rollback);

      return rollback;
    },
    [queryClient, updateStudentInCache, invalidatePattern]
  );

  /**
   * Rollback specific update
   */
  const rollbackUpdate = useCallback((updateId: string) => {
    const rollback = rollbacksRef.current.get(updateId);
    if (rollback) {
      rollback();
    }
  }, []);

  /**
   * Clear all pending rollbacks
   */
  const clearRollbacks = useCallback(() => {
    rollbacksRef.current.clear();
  }, []);

  return {
    performOptimisticUpdate,
    rollbackUpdate,
    clearRollbacks,
    pendingUpdates: rollbacksRef.current.size,
  };
};
