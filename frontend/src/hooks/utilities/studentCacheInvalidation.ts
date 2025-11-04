/**
 * Student Cache Invalidation Utilities
 *
 * Cache invalidation patterns and clearing operations for student data
 * using TanStack Query.
 *
 * @module hooks/utilities/studentCacheInvalidation
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { studentQueryKeys } from './queryKeys';
import type { InvalidationPattern } from './studentUtilityTypes';

/**
 * Hook for cache invalidation operations
 *
 * @returns Cache invalidation utilities
 *
 * @example
 * ```tsx
 * const { invalidatePattern, clearStudentCache } = useCacheInvalidation();
 *
 * // Invalidate all student lists after creating a new student
 * await invalidatePattern('student-lists');
 *
 * // Clear all student-related cache
 * await clearStudentCache();
 * ```
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate cache patterns based on data changes
   */
  const invalidatePattern = useCallback(
    async (pattern: InvalidationPattern, studentId?: string) => {
      const promises: Promise<void>[] = [];

      switch (pattern) {
        case 'all-students':
          promises.push(
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.base.all(),
            })
          );
          break;

        case 'student-lists':
          promises.push(
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.lists.all(),
            })
          );
          break;

        case 'student-details':
          if (studentId) {
            promises.push(
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.details.byId(studentId),
              })
            );
          } else {
            promises.push(
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.details.all(),
              })
            );
          }
          break;

        case 'student-statistics':
          promises.push(
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.statistics.all(),
            })
          );
          break;

        case 'student-searches':
          promises.push(
            queryClient.invalidateQueries({
              queryKey: studentQueryKeys.searches.all(),
            })
          );
          break;

        case 'student-relationships':
          if (studentId) {
            promises.push(
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.relationships.emergencyContacts(studentId),
              })
            );
          } else {
            promises.push(
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.relationships.all(),
              })
            );
          }
          break;

        case 'specific-student':
          if (studentId) {
            // Invalidate all queries related to a specific student
            promises.push(
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.details.byId(studentId),
              }),
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.details.profile(studentId),
              }),
              queryClient.invalidateQueries({
                queryKey: studentQueryKeys.relationships.emergencyContacts(studentId),
              })
            );
          }
          break;
      }

      await Promise.all(promises);
    },
    [queryClient]
  );

  /**
   * Clear all student-related cache
   */
  const clearStudentCache = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: studentQueryKeys.base.all(),
    });
  }, [queryClient]);

  return {
    invalidatePattern,
    clearStudentCache,
  };
};
