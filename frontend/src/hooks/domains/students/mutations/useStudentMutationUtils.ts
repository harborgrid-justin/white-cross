/**
 * Student Mutation Utilities
 *
 * @module hooks/domains/students/mutations/useStudentMutationUtils
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useCacheManager } from '@/hooks/shared/useCacheManager';
import { studentQueryKeys } from '../config';
import type { Student } from '@/types/student.types';

/**
 * Hook for student mutation utility functions
 */
export function useStudentMutationUtils() {
  const queryClient = useQueryClient();
  const { invalidateCacheManager } = useCacheManager();

  // Cache invalidation utility
  const invalidateStudentData = useCallback(async (studentId?: string) => {
    if (studentId) {
      // Invalidate specific student
      await invalidateCacheManager([...studentQueryKeys.details.byId(studentId)], 'exact');
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.details.byId(studentId),
      });
    } else {
      // Invalidate all student data
      await invalidateCacheManager([...studentQueryKeys.all], 'prefix');
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.all,
      });
    }
  }, [invalidateCacheManager, queryClient]);

  // Optimistic update utility
  const optimisticallyUpdateStudent = useCallback(
    (studentId: string, updates: Partial<Student>) => {
      const previousData = queryClient.getQueryData<Student>(
        studentQueryKeys.details.byId(studentId)
      );

      if (previousData) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(studentId),
          { ...previousData, ...updates }
        );
      }
    },
    [queryClient]
  );

  // Rollback optimistic update utility
  const rollbackOptimisticUpdate = useCallback(
    (studentId: string) => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.details.byId(studentId),
      });
    },
    [queryClient]
  );

  return {
    invalidateStudentData,
    optimisticallyUpdateStudent,
    rollbackOptimisticUpdate,
  };
}
