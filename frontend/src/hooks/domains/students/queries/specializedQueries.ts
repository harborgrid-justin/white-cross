/**
 * Specialized Student Query Hooks
 *
 * Hooks for specialized student queries (assigned, recent, by grade).
 *
 * @module hooks/students/specializedQueries
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { studentQueryKeys } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { apiActions } from '@/lib/api';
import type { ApiError } from './types';

/**
 * Hook for fetching students assigned to the current nurse
 *
 * @param options - Query options
 * @returns Assigned students with metadata
 *
 * @example
 * ```tsx
 * const { students, isLoading, refetch } = useAssignedStudents();
 *
 * return (
 *   <MyStudentsPanel
 *     students={students}
 *     loading={isLoading}
 *     onRefresh={refetch}
 *   />
 * );
 * ```
 */
export const useAssignedStudents = (
  options?: {
    enabled?: boolean;
    includeInactive?: boolean;
  }
) => {
  const config = cacheConfig.assignments;

  const queryResult = useQuery({
    queryKey: studentQueryKeys.assignments.assigned(),
    queryFn: async () => {
      const response = await apiActions.students.getAssignedStudents();

      return response;
    },
    enabled: options?.enabled !== false,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error('Failed to fetch assigned students:', error);
      }
    }
  });

  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Failed to refetch assigned students:', error);
    });
  }, [queryResult.refetch]);

  return {
    students: queryResult.data || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch,
    isSuccess: queryResult.isSuccess,
  };
};

/**
 * Hook for fetching recently enrolled students
 *
 * @param days - Number of days to look back (default: 30)
 * @param options - Query options
 * @returns Recently enrolled students
 *
 * @example
 * ```tsx
 * const { students, isLoading } = useRecentStudents(7); // Last 7 days
 *
 * return (
 *   <RecentEnrollmentsWidget
 *     students={students}
 *     loading={isLoading}
 *   />
 * );
 * ```
 */
export const useRecentStudents = (
  days: number = 30,
  options?: {
    enabled?: boolean;
  }
) => {
  const config = cacheConfig.lists;

  const queryResult = useQuery({
    queryKey: studentQueryKeys.lists.recent(days),
    queryFn: async () => {
      // For now, use getAll with date filter - can be extended later
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const response = await apiActions.students.getAll({
        // This would need backend support for enrollment date filtering
        // For now, return empty array as placeholder
      });

      // Filter on frontend for now (should be done on backend)
      return response.students.filter(student => {
        if (!student.enrollmentDate) return false;
        const enrollmentDate = new Date(student.enrollmentDate);
        return enrollmentDate >= cutoffDate;
      });
    },
    enabled: options?.enabled !== false,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error('Failed to fetch recent students:', error);
      }
    }
  });

  return {
    students: queryResult.data || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
    isSuccess: queryResult.isSuccess,
  };
};

/**
 * Hook for fetching students by grade with caching optimization
 *
 * @param grade - Grade level to filter by
 * @param options - Query options
 * @returns Students in specified grade
 */
export const useStudentsByGrade = (
  grade: string | undefined,
  options?: {
    enabled?: boolean;
  }
) => {
  const config = cacheConfig.lists;

  const queryResult = useQuery({
    queryKey: studentQueryKeys.lists.byGrade(grade || ''),
    queryFn: async () => {
      if (!grade) throw new Error('Grade is required');

      const response = await apiActions.students.getAll({ grade });
      return response;
    },
    enabled: !!grade && (options?.enabled !== false),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error(`Failed to fetch students for grade ${grade}:`, error);
      }
    }
  });

  return {
    students: queryResult.data?.students || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
    isSuccess: queryResult.isSuccess,
  };
};
