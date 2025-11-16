/**
 * WF-COMP-147 | useStudentSpecializedQueries.ts - Specialized student query hooks
 * Purpose: Specialized student queries (assigned students, statistics)
 * Upstream: @tanstack/react-query, @/services
 * Downstream: Dashboard components, specialized views
 * Exports: useAssignedStudents, useStudentStats
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

import { useQuery } from '@tanstack/react-query';
import { serverGet } from '@/lib/api/server';
import { STUDENTS_ENDPOINTS } from '@/constants/api/students';
import { useApiError } from '../../../shared/useApiError';
import { studentKeys, CACHE_CONFIG } from './studentQueryKeys';
import type {
  UseAssignedStudentsReturn,
  UseStudentStatsReturn,
  StudentStats,
} from './studentQueryTypes';

// =====================
// SPECIALIZED QUERY HOOKS
// =====================

/**
 * Hook for fetching students assigned to the current user (nurse).
 *
 * @returns Assigned students with loading states
 *
 * @example
 * ```tsx
 * const { students, isLoading } = useAssignedStudents();
 *
 * return <MyStudentsList students={students} loading={isLoading} />;
 * ```
 */
export const useAssignedStudents = (): UseAssignedStudentsReturn => {
  const { handleError } = useApiError();

  const queryResult = useQuery({
    queryKey: studentKeys.assigned(),
    queryFn: async () => {
      try {
        const response = await serverGet(STUDENTS_ENDPOINTS.ASSIGNED);
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.LIST_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    meta: {
      errorMessage: 'Failed to load assigned students'
    },
  });

  return {
    students: queryResult.data || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
  };
};

/**
 * Hook for fetching student statistics.
 *
 * @returns Student statistics with loading states
 *
 * @example
 * ```tsx
 * const { stats, isLoading } = useStudentStats();
 *
 * if (isLoading) return <LoadingSpinner />;
 *
 * return (
 *   <Dashboard>
 *     <StatCard label="Total Students" value={stats?.totalStudents} />
 *     <StatCard label="Active Students" value={stats?.activeStudents} />
 *   </Dashboard>
 * );
 * ```
 */
export const useStudentStats = (): UseStudentStatsReturn => {
  const { handleError } = useApiError();

  const queryResult = useQuery({
    queryKey: studentKeys.stats(),
    queryFn: async (): Promise<StudentStats> => {
      try {
        const response = await serverGet(STUDENTS_ENDPOINTS.STATISTICS('all'));
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.STATS_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    meta: {
      errorMessage: 'Failed to load student statistics'
    },
  });

  return {
    stats: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
  };
};
