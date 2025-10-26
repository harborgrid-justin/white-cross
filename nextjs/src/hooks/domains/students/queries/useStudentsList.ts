/**
 * Students List Query Hook
 * 
 * Enterprise-grade hook for fetching student lists with proper caching,
 * error handling, and compliance features.
 * 
 * @module hooks/domains/students/queries/useStudentsList
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { studentsApi } from '@/services/modules/studentsApi';
import { useApiError } from '@/hooks/shared/useApiError';
import { useCacheManager } from '@/hooks/shared/useCacheManager';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { 
  studentQueryKeys, 
  STUDENT_OPERATIONS,
  type StudentListFilters,
  type PaginationParams 
} from '../config';
import type { 
  Student, 
  PaginatedStudentsResponse 
} from '@/types/student.types';

/**
 * Students list query options
 */
export interface UseStudentsListOptions {
  filters?: StudentListFilters;
  pagination?: PaginationParams;
  enabled?: boolean;
  enableRealtime?: boolean;
  enablePrefetch?: boolean;
}

/**
 * Students list query result
 */
export interface StudentsListResult extends UseQueryResult<PaginatedStudentsResponse> {
  students: Student[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  totalPages: number;
  refetchStudents: () => void;
  prefetchNextPage: () => Promise<void>;
  invalidateCache: () => Promise<void>;
}

/**
 * Students List Query Hook
 */
export function useStudentsList(options: UseStudentsListOptions = {}): StudentsListResult {
  const {
    filters = {},
    pagination = { page: 1, limit: 20 },
    enabled = true,
    enableRealtime = false,
    enablePrefetch = true,
  } = options;

  // Enterprise hooks
  const { handleError } = useApiError({ context: 'students_list' });
  const { getCacheStrategy, prefetchWithStrategy } = useCacheManager();
  const { logCompliantAccess, getComplianceLevel } = useHealthcareCompliance();

  // Cache configuration based on data sensitivity
  const cacheConfig = useMemo(() => {
    const sensitivity = getComplianceLevel(filters);
    const strategy = getCacheStrategy(sensitivity);
    
    return {
      staleTime: enableRealtime ? 0 : strategy.staleTime,
      gcTime: strategy.cacheTime,
    };
  }, [filters, enableRealtime, getCacheStrategy, getComplianceLevel]);

  // Query key generation
  const queryKey = useMemo(() => {
    if (Object.keys(filters).length > 0) {
      return studentQueryKeys.lists.filtered({ ...filters, ...pagination });
    }
    return studentQueryKeys.lists.paginated(pagination);
  }, [filters, pagination]);

  // Query function with compliance logging
  const queryFn = useCallback(async (): Promise<PaginatedStudentsResponse> => {
    try {
      // Log compliant access
      await logCompliantAccess(
        'student_list',
        'view',
        { filters, pagination }
      );

      // Fetch data from API
      const response = await studentsApi.getStudentsPaginated({
        ...pagination,
        ...filters,
      });

      return response;
    } catch (error) {
      const handledError = handleError(error, STUDENT_OPERATIONS.VIEW_LIST);
      throw handledError;
    }
  }, [filters, pagination, logCompliantAccess, handleError]);

  // Main query
  const queryResult = useQuery({
    queryKey,
    queryFn,
    enabled,
    ...cacheConfig,
    retry: (failureCount, error: any) => {
      // Don't retry on authorization or not-found errors
      if (error?.status === 401 || error?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Prefetch next page
  const prefetchNextPage = useCallback(async () => {
    if (!enablePrefetch || !queryResult.data?.hasNextPage) return;

    const nextPagination = {
      ...pagination,
      page: pagination.page + 1,
    };

    const nextQueryKey = Object.keys(filters).length > 0
      ? studentQueryKeys.lists.filtered({ ...filters, ...nextPagination })
      : studentQueryKeys.lists.paginated(nextPagination);

    await prefetchWithStrategy(
      nextQueryKey,
      () => studentsApi.getStudentsPaginated({
        ...nextPagination,
        ...filters,
      }),
      getComplianceLevel(filters)
    );
  }, [
    enablePrefetch,
    queryResult.data?.hasNextPage,
    pagination,
    filters,
    prefetchWithStrategy,
    getComplianceLevel,
  ]);

  // Cache invalidation
  const { invalidateCache: invalidateCacheManager } = useCacheManager();
  const invalidateCache = useCallback(async () => {
    await invalidateCacheManager(studentQueryKeys.lists.all(), 'prefix');
  }, [invalidateCacheManager]);

  // Manual refetch wrapper
  const refetchStudents = useCallback(() => {
    queryResult.refetch();
  }, [queryResult]);

  // Computed values
  const students = queryResult.data?.data || [];
  const totalCount = queryResult.data?.totalCount || 0;
  const hasNextPage = queryResult.data?.hasNextPage || false;
  const hasPreviousPage = pagination.page > 1;
  const currentPage = pagination.page;
  const totalPages = Math.ceil(totalCount / pagination.limit);

  // Auto-prefetch next page on successful load
  useCallback(() => {
    if (queryResult.isSuccess && enablePrefetch) {
      prefetchNextPage();
    }
  }, [queryResult.isSuccess, enablePrefetch, prefetchNextPage]);

  return {
    ...queryResult,
    students,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    totalPages,
    refetchStudents,
    prefetchNextPage,
    invalidateCache,
  };
}

/**
 * Hook for getting all active students (simplified interface)
 */
export function useActiveStudents() {
  return useStudentsList({
    filters: { isActive: true },
    pagination: { page: 1, limit: 100 }, // Reasonable limit for active students
  });
}

/**
 * Hook for getting students by grade
 */
export function useStudentsByGrade(grade: string) {
  return useStudentsList({
    filters: { grade, isActive: true },
    pagination: { page: 1, limit: 50 },
  });
}

/**
 * Hook for searching students with debouncing
 */
export function useStudentsSearch(searchQuery: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  return useStudentsList({
    filters: { search: debouncedQuery },
    pagination: { page: 1, limit: 20 },
    enabled: debouncedQuery.length >= 2, // Only search with 2+ characters
  });
}