/**
 * Student Cache Manipulation Utilities
 *
 * Direct cache manipulation operations for student data including
 * add, update, remove, and monitoring operations.
 *
 * @module hooks/utilities/studentCacheManipulation
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { studentQueryKeys } from './queryKeys';
import { useCacheInvalidation } from './studentCacheInvalidation';
import type { Student } from '@/types/student.types';
import type { CacheStats } from './studentUtilityTypes';

/**
 * Hook for direct cache manipulation operations
 *
 * @returns Cache manipulation utilities
 *
 * @example
 * ```tsx
 * const {
 *   updateStudentInCache,
 *   addStudentToCache,
 *   removeStudentFromCache
 * } = useCacheManipulation();
 *
 * // Update a student's data in cache
 * updateStudentInCache(studentId, { firstName: 'John' });
 *
 * // Add a new student to cache
 * addStudentToCache(newStudent);
 * ```
 */
export const useCacheManipulation = () => {
  const queryClient = useQueryClient();
  const { invalidatePattern } = useCacheInvalidation();

  /**
   * Remove specific student data from cache
   */
  const removeStudentFromCache = useCallback(
    (studentId: string) => {
      // Remove from all relevant query keys
      queryClient.removeQueries({
        queryKey: studentQueryKeys.details.byId(studentId),
      });

      queryClient.removeQueries({
        queryKey: studentQueryKeys.details.profile(studentId),
      });

      // Update lists to remove the student
      queryClient.setQueriesData(
        { queryKey: studentQueryKeys.lists.all() },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.filter((student: Student) => student.id !== studentId);
          }

          if (oldData.students) {
            return {
              ...oldData,
              students: oldData.students.filter(
                (student: Student) => student.id !== studentId
              ),
              pagination: oldData.pagination
                ? {
                    ...oldData.pagination,
                    total: Math.max(0, oldData.pagination.total - 1),
                  }
                : undefined,
            };
          }

          return oldData;
        }
      );
    },
    [queryClient]
  );

  /**
   * Update student data in cache
   */
  const updateStudentInCache = useCallback(
    (studentId: string, updates: Partial<Student>) => {
      // Update detail queries
      queryClient.setQueryData(
        studentQueryKeys.details.byId(studentId),
        (oldData: Student | undefined) =>
          oldData ? { ...oldData, ...updates } : undefined
      );

      queryClient.setQueryData(
        studentQueryKeys.details.profile(studentId),
        (oldData: Student | undefined) =>
          oldData ? { ...oldData, ...updates } : undefined
      );

      // Update in lists
      queryClient.setQueriesData(
        { queryKey: studentQueryKeys.lists.all() },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((student: Student) =>
              student.id === studentId ? { ...student, ...updates } : student
            );
          }

          if (oldData.students) {
            return {
              ...oldData,
              students: oldData.students.map((student: Student) =>
                student.id === studentId ? { ...student, ...updates } : student
              ),
            };
          }

          return oldData;
        }
      );
    },
    [queryClient]
  );

  /**
   * Add new student to cache
   */
  const addStudentToCache = useCallback(
    (newStudent: Student) => {
      // Set detail data
      queryClient.setQueryData(
        studentQueryKeys.details.byId(newStudent.id),
        newStudent
      );

      // Add to lists (prepend to maintain chronological order)
      queryClient.setQueriesData(
        { queryKey: studentQueryKeys.lists.all() },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return [newStudent, ...oldData];
          }

          if (oldData.students) {
            return {
              ...oldData,
              students: [newStudent, ...oldData.students],
              pagination: oldData.pagination
                ? {
                    ...oldData.pagination,
                    total: oldData.pagination.total + 1,
                  }
                : undefined,
            };
          }

          return oldData;
        }
      );

      // Invalidate statistics since counts have changed
      invalidatePattern('student-statistics');
    },
    [queryClient, invalidatePattern]
  );

  /**
   * Get cache statistics and health
   */
  const getCacheStats = useCallback((): CacheStats => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();

    const studentQueries = queries.filter((query) => query.queryKey[0] === 'students');

    const stats: CacheStats = {
      totalQueries: queries.length,
      studentQueries: studentQueries.length,
      freshQueries: studentQueries.filter(
        (q) => q.state.dataUpdatedAt > Date.now() - 300000
      ).length, // 5 min
      staleQueries: studentQueries.filter((q) => q.isStale()).length,
      errorQueries: studentQueries.filter((q) => q.state.error).length,
      loadingQueries: studentQueries.filter((q) => q.state.isFetching).length,
      cacheSize: JSON.stringify(studentQueries.map((q) => q.state.data)).length,
    };

    return stats;
  }, [queryClient]);

  return {
    removeStudentFromCache,
    updateStudentInCache,
    addStudentToCache,
    getCacheStats,
  };
};
