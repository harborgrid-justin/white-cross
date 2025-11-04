/**
 * WF-COMP-147 | useStudentUtilities.ts - Student utility hooks
 * Purpose: Utility hooks for cache management and performance optimization
 * Upstream: @tanstack/react-query, @/services
 * Downstream: Student components needing cache control or prefetching
 * Exports: useStudentCacheInvalidation, useStudentPrefetch
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiActions } from '@/lib/api';
import type { StudentFilters } from '@/types/student.types';
import { studentKeys, CACHE_CONFIG } from './studentQueryKeys';

// =====================
// UTILITY HOOKS
// =====================

/**
 * Hook for programmatic cache invalidation.
 * Useful for manual refresh triggers or complex cache management.
 *
 * @returns Cache invalidation utilities
 *
 * @example
 * ```tsx
 * const { invalidateAll, invalidateStudent, invalidateLists } = useStudentCacheInvalidation();
 *
 * const handleManualRefresh = () => {
 *   invalidateAll();
 *   toast.info('Data refreshed');
 * };
 * ```
 */
export const useStudentCacheInvalidation = () => {
  const queryClient = useQueryClient();

  return {
    /** Invalidate all student-related queries */
    invalidateAll: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    }, [queryClient]),

    /** Invalidate a specific student's detail cache */
    invalidateStudent: useCallback((studentId: string) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });
    }, [queryClient]),

    /** Invalidate all student list queries */
    invalidateLists: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    }, [queryClient]),

    /** Invalidate all search queries */
    invalidateSearches: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: studentKeys.searches() });
    }, [queryClient]),

    /** Invalidate statistics */
    invalidateStats: useCallback(() => {
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
    }, [queryClient]),
  };
};

/**
 * Hook for prefetching student data.
 * Useful for performance optimization when you know data will be needed soon.
 *
 * @returns Prefetch utilities
 *
 * @example
 * ```tsx
 * const { prefetchStudent, prefetchStudents } = useStudentPrefetch();
 *
 * const handleRowHover = (studentId: string) => {
 *   // Prefetch student details on hover for instant navigation
 *   prefetchStudent(studentId);
 * };
 * ```
 */
export const useStudentPrefetch = () => {
  const queryClient = useQueryClient();

  return {
    /** Prefetch a specific student's details */
    prefetchStudent: useCallback(async (studentId: string) => {
      await queryClient.prefetchQuery({
        queryKey: studentKeys.detail(studentId),
        queryFn: () => apiActions.students.getById(studentId),
        staleTime: CACHE_CONFIG.DETAIL_STALE_TIME,
      });
    }, [queryClient]),

    /** Prefetch students list with filters */
    prefetchStudents: useCallback(async (filters: StudentFilters = {}) => {
      await queryClient.prefetchQuery({
        queryKey: studentKeys.list(filters),
        queryFn: () => apiActions.students.getAll(filters),
        staleTime: CACHE_CONFIG.LIST_STALE_TIME,
      });
    }, [queryClient]),
  };
};
