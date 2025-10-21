/**
 * Core Student Query Hooks
 * 
 * Primary TanStack Query hooks for student data fetching with comprehensive error handling,
 * optimistic loading states, and healthcare compliance considerations.
 * 
 * @module hooks/students/coreQueries
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useQuery,
  useInfiniteQuery,
  useQueryClient,
  type UseQueryResult,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';
import { studentQueryKeys, type StudentFilters } from './queryKeys';
import { cacheConfig } from './cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type { 
  Student, 
  CreateStudentData, 
  UpdateStudentData,
  PaginatedStudentsResponse
} from '@/types/student.types';

// Define basic API error type
interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  response?: any;
}

// Define basic paginated response type
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Define student profile type
interface StudentProfile extends Student {
  healthRecords?: any[];
  medications?: any[];
  incidents?: any[];
  emergencyContacts?: any[];
}

/**
 * Types for hook return values
 */
export interface UseStudentsReturn {
  /** Paginated student data */
  data: PaginatedStudentsResponse | undefined;
  /** Array of students for convenience */
  students: Student[];
  /** Pagination metadata */
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Is fetching (including background refetch) */
  isFetching: boolean;
  /** Is initial load */
  isInitialLoading: boolean;
  /** Is stale (needs refetch) */
  isStale: boolean;
  /** Manual refetch function */
  refetch: () => void;
  /** Has data been fetched at least once */
  isSuccess: boolean;
  /** Query status */
  status: 'pending' | 'error' | 'success';
}

export interface UseStudentDetailReturn {
  /** Student data */
  student: Student | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Is fetching */
  isFetching: boolean;
  /** Manual refetch function */
  refetch: () => void;
  /** Has data been fetched */
  isSuccess: boolean;
  /** Is stale */
  isStale: boolean;
  /** Query status */
  status: 'pending' | 'error' | 'success';
}

export interface UseStudentProfileReturn {
  /** Student profile with extended data */
  profile: StudentProfile | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ApiError | null;
  /** Is fetching */
  isFetching: boolean;
  /** Manual refetch function */
  refetch: () => void;
  /** Has data been fetched */
  isSuccess: boolean;
}

export interface UseInfiniteStudentsReturn {
  /** Infinite query data */
  data: UseInfiniteQueryResult<PaginatedStudentsResponse, ApiError>['data'];
  /** Flattened array of all students */
  students: Student[];
  /** Loading states */
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  /** Error state */
  error: ApiError | null;
  /** Pagination functions */
  fetchNextPage: () => void;
  hasNextPage: boolean;
  /** Manual refetch */
  refetch: () => void;
}

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
      const response = await studentsApi.getAll(filters);
      
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
 * Hook for fetching a single student by ID with enhanced error handling
 * 
 * @param studentId - Student ID to fetch
 * @param options - Additional query options
 * @returns Student detail with comprehensive metadata
 * 
 * @example
 * ```tsx
 * const { student, isLoading, error } = useStudentDetail('student-123', {
 *   enabled: !!studentId
 * });
 * 
 * if (isLoading) return <StudentDetailSkeleton />;
 * if (error) return <ErrorDisplay error={error} />;
 * if (!student) return <NotFound message="Student not found" />;
 * 
 * return <StudentProfile student={student} />;
 * ```
 */
export const useStudentDetail = (
  studentId: string | undefined,
  options?: {
    enabled?: boolean;
    includeHealthRecords?: boolean;
    includeMedications?: boolean;
    includeIncidents?: boolean;
  }
): UseStudentDetailReturn => {
  const config = cacheConfig.details;

  // Determine which query key to use based on includes
  const queryKey = useMemo(() => {
    if (!studentId) return studentQueryKeys.details.byId('');
    
    if (options?.includeHealthRecords) {
      return studentQueryKeys.details.withHealthRecords(studentId);
    }
    if (options?.includeMedications) {
      return studentQueryKeys.details.withMedications(studentId);
    }
    if (options?.includeIncidents) {
      return studentQueryKeys.details.withIncidents(studentId);
    }
    
    return studentQueryKeys.details.byId(studentId);
  }, [studentId, options]);

  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      
      const response = await studentsApi.getById(studentId);
      
      if (!response) {
        throw new Error(`Student with ID ${studentId} not found`);
      }
      
      return response;
    },
    enabled: !!studentId && (options?.enabled !== false),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error(`Failed to fetch student ${studentId}:`, error);
      }
    }
  });

  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Failed to refetch student detail:', error);
    });
  }, [queryResult.refetch]);

  return {
    student: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch,
    isSuccess: queryResult.isSuccess,
    isStale: queryResult.isStale,
    status: queryResult.status,
  };
};

/**
 * Hook for fetching comprehensive student profile with all related data
 * 
 * @param studentId - Student ID to fetch profile for
 * @param options - Additional query options
 * @returns Complete student profile with health records, contacts, etc.
 * 
 * @example
 * ```tsx
 * const { profile, isLoading } = useStudentProfile('student-123');
 * 
 * return (
 *   <StudentProfileView
 *     profile={profile}
 *     loading={isLoading}
 *   />
 * );
 * ```
 */
export const useStudentProfile = (
  studentId: string | undefined,
  options?: {
    enabled?: boolean;
  }
): UseStudentProfileReturn => {
  const config = cacheConfig.details;

  const queryResult = useQuery({
    queryKey: studentQueryKeys.details.profile(studentId || ''),
    queryFn: async () => {
      if (!studentId) throw new Error('Student ID is required');
      
      // For now, use regular getById - can be extended later
      const response = await studentsApi.getById(studentId);
      
      if (!response) {
        throw new Error(`Student profile for ID ${studentId} not found`);
      }
      
      return response;
    },
    enabled: !!studentId && (options?.enabled !== false),
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    refetchOnWindowFocus: config.refetchOnWindowFocus,
    refetchOnMount: config.refetchOnMount,
    refetchOnReconnect: config.refetchOnReconnect,
    retry: config.retry,
    retryDelay: config.retryDelay,
    meta: {
      errorHandler: (error: ApiError) => {
        console.error(`Failed to fetch student profile ${studentId}:`, error);
      }
    }
  });

  const refetch = useCallback(() => {
    queryResult.refetch().catch((error) => {
      console.error('Failed to refetch student profile:', error);
    });
  }, [queryResult.refetch]);

  return {
    profile: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as ApiError | null,
    isFetching: queryResult.isFetching,
    refetch,
    isSuccess: queryResult.isSuccess,
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
      const response = await studentsApi.getAll({
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
      const response = await studentsApi.getAssignedStudents();
      
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
      
      const response = await studentsApi.getAll({
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
      
      const response = await studentsApi.getAll({ grade });
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

/**
 * Export all core query hooks
 */
export default {
  useStudents,
  useStudentDetail,
  useStudentProfile,
  useInfiniteStudents,
  useAssignedStudents,
  useRecentStudents,
  useStudentsByGrade,
};