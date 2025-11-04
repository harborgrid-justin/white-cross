/**
 * WF-ROUTE-001-QUERIES | useStudentsRoute.queries.ts - Data fetching
 * Purpose: React Query hooks for Students data
 * Upstream: @/lib/api, @/hooks | Dependencies: React Query, optimistic hooks
 * Downstream: useStudentsRoute | Called by: Students route hook
 * Related: useStudentsRoute
 * Exports: useStudentsQuery, useStatisticsQuery | Key Features: Data fetching with caching
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Data queries for student route
 */

import { useQuery } from '@tanstack/react-query';
import { studentKeys } from '@/hooks/useOptimisticStudents';
import { apiActions } from '@/lib/api';
import type { StudentsRouteState } from './useStudentsRoute.state';

/**
 * Main students query with caching and error handling
 */
export function useStudentsQuery(state: StudentsRouteState) {
  return useQuery({
    queryKey: studentKeys.list(state.filters),
    queryFn: () => apiActions.students.getAll({
      page: state.page,
      limit: state.pageSize,
      ...state.filters,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Student statistics query
 */
export function useStatisticsQuery() {
  return useQuery({
    queryKey: [...studentKeys.all, 'statistics'],
    queryFn: () => apiActions.students.getStatistics(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
}
