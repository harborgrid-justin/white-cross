/**
 * Student List Query Hooks
 *
 * Hooks for fetching paginated and infinite lists of students.
 *
 * @module hooks/students/listQueries
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useQuery,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { studentQueryKeys, type StudentFilters } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { apiActions } from '@/lib/api';
import type { ApiError, UseStudentsReturn, UseInfiniteStudentsReturn } from './types';

/**
 * Hook for fetching paginated student list with comprehensive filtering
 *
 * @param filters - Student filters and pagination options
 * @param options - Additional query options
 * @returns Student list with enhanced metadata
 *
 * @example
 * ```tsx
 * const { students, pagination, isLoading } = useStudents({
 *   grade: '5',
 *   isActive: true,
 *   page: 1,
 *   limit: 25
 * });
 *
 * return (
 *   <div>
 *     {isLoading ? (
 *       <SkeletonLoader count={5} />
 *     ) : (
 *       <StudentTable
 *         students={students}
 *         pagination={pagination}
 *       />
 *     )}
 *   </div>
 * );
 * ```
 */
export const useStudents = (
  filters: StudentFilters = {},
  options?: {
    enabled?: boolean;
    keepPreviousData?: boolean;
    refetchOnMount?: boolean;
  }
): UseStudentsReturn => {
  const config = cacheConfig.lists;

  const queryResult = useQuery({
    queryKey: studentQueryKeys.lists.filtered(filters),
    queryFn: async () => {
      const response = await apiActions.students.getAll(filters);

      // Validate response structure
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from students API');
      }

      return response;
    },
    enabled: options?.enabled !== false,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: options?.refetchOnMount ?? config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    placeholderData: options?.keepPreviousData ? (previousData) => previousData : undefined,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error('Failed to fetch students:', error);
        // In production, log to healthcare audit system
      }
    }
  });

  // Extract and memoize students array
  const students = useMemo(() => {
    return queryResult.data?.students || [];
  }, [queryResult.data?.students]);

  // Extract and enhance pagination metadata
  const pagination = useMemo(() => {
    if (!queryResult.data?.pagination) return undefined;

    const { total, page, limit, pages } = queryResult.data.pagination;

    return {
      total,
      page,
      limit,
      totalPages: pages,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1,
    };
  }, [queryResult.data?.pagination]);

  // Enhanced refetch with error handling
  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Manual refetch failed:', error);
    });
  }, [queryResult.refetch]);

  return {
    data: queryResult.data,
    students,
    pagination,
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    isInitialLoading: queryResult.isLoading && queryResult.isFetching,
    isStale: queryResult.isStale,
    refetch,
    isSuccess: queryResult.isSuccess,
    status: queryResult.status,
  };
};

/**
 * Hook for infinite loading of students (virtual scrolling)
 *
 * @param filters - Base filters for the query
 * @param options - Additional options including page size
 * @returns Infinite query result with flattened students array
 *
 * @example
 * ```tsx
 * const {
 *   students,
 *   fetchNextPage,
 *   hasNextPage,
 *   isFetchingNextPage
 * } = useInfiniteStudents({ grade: '5' });
 *
 * return (
 *   <VirtualizedList
 *     items={students}
 *     onEndReached={fetchNextPage}
 *     loading={isFetchingNextPage}
 *     hasMore={hasNextPage}
 *   />
 * );
 * ```
 */
export const useInfiniteStudents = (
  filters: Omit<StudentFilters, 'page'> = {},
  options?: {
    pageSize?: number;
    enabled?: boolean;
  }
): UseInfiniteStudentsReturn => {
  const config = cacheConfig.lists;
  const pageSize = options?.pageSize || 25;

  const queryResult = useInfiniteQuery({
    queryKey: studentQueryKeys.lists.filtered({ ...filters, limit: pageSize }),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiActions.students.getAll({
        ...filters,
        page: pageParam,
        limit: pageSize,
      });

      return response;
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
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
        console.error('Failed to fetch infinite students:', error);
      }
    }
  });

  // Flatten all pages into a single array
  const students = useMemo(() => {
    return queryResult.data?.pages.flatMap(page => page.students) || [];
  }, [queryResult.data?.pages]);

  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Failed to refetch infinite students:', error);
    });
  }, [queryResult.refetch]);

  return {
    data: queryResult.data,
    students,
    isLoading: queryResult.isLoading,
    isFetching: queryResult.isFetching,
    isFetchingNextPage: queryResult.isFetchingNextPage,
    error: queryResult.error as ApiError | null,
    fetchNextPage: queryResult.fetchNextPage,
    hasNextPage: queryResult.hasNextPage,
    refetch,
  };
};
