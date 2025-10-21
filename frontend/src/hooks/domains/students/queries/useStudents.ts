/**
 * WF-COMP-147 | useStudents.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: @tanstack/react-query, @/services, react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, named exports | Key Features: useState, useMemo, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Enterprise Student Domain Hooks
 *
 * Comprehensive TanStack Query hooks for student management following enterprise patterns.
 * Implements proper query key factory, cache invalidation, optimistic updates where appropriate,
 * and healthcare-specific error handling.
 *
 * @module hooks/useStudents
 * @author White Cross Healthcare Platform
 * @see {@link https://tanstack.com/query/latest/docs/react/overview}
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
  type QueryKey
} from '@tanstack/react-query';
import { studentsApi } from '@/services';
import type {
  Student,
  StudentFilters,
  CreateStudentData,
  UpdateStudentData,
  PaginatedStudentsResponse,
  PaginationMetadata,
} from '@/types/student.types';
import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectStudentUIState,
  selectSelectedStudentIds,
  selectStudentViewMode,
  selectStudentFilters,
  selectStudentSort,
  selectStudentPagination,
  selectStudentSearchQuery,
  selectShowInactiveStudents,
  selectFilteredAndSortedStudents,
  selectPaginatedStudents,
  selectStudentPaginationInfo,
  selectSelectedStudents,
  selectIsBulkSelectMode,
  selectExpandedStudentCards,
  type StudentUIState,
} from '@/stores/slices/studentsSlice';

// =====================
// QUERY KEY FACTORY
// =====================

/**
 * Centralized query key factory for student-related queries.
 * Provides type-safe, consistent cache key generation.
 *
 * @pattern Query Key Factory
 * @see {@link https://tkdodo.eu/blog/effective-react-query-keys}
 */
export const studentKeys = {
  /** Base key for all student queries */
  all: ['students'] as const,

  /** Keys for student list queries */
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters: StudentFilters) => [...studentKeys.lists(), filters] as const,

  /** Keys for student detail queries */
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,

  /** Keys for search queries */
  searches: () => [...studentKeys.all, 'search'] as const,
  search: (query: string) => [...studentKeys.searches(), query] as const,

  /** Keys for assigned students queries */
  assigned: () => [...studentKeys.all, 'assigned'] as const,

  /** Keys for statistics queries */
  stats: () => [...studentKeys.all, 'stats'] as const,
} as const;

// =====================
// CONFIGURATION CONSTANTS
// =====================

/**
 * Cache configuration for student queries.
 * Healthcare data requires balance between freshness and performance.
 */
const CACHE_CONFIG = {
  /** Semi-static data - student lists don't change frequently */
  LIST_STALE_TIME: 10 * 60 * 1000, // 10 minutes

  /** Student details can be cached longer */
  DETAIL_STALE_TIME: 15 * 60 * 1000, // 15 minutes

  /** Search results should be fresh */
  SEARCH_STALE_TIME: 5 * 60 * 1000, // 5 minutes

  /** Statistics should be relatively fresh */
  STATS_STALE_TIME: 5 * 60 * 1000, // 5 minutes

  /** Default cache time (how long unused data stays in cache) */
  DEFAULT_CACHE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;

// =====================
// RETURN TYPES
// =====================

/**
 * Return type for useStudents hook with enhanced data access
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
  } | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching (including background refetch) */
  isFetching: boolean;
  /** Is initial load */
  isInitialLoading: boolean;
  /** Manual refetch function */
  refetch: () => void;
  
  // Redux UI state and actions
  /** Selected student IDs */
  selectedStudentIds: string[];
  /** Currently selected students */
  selectedStudents: Student[];
  /** View mode (grid, list, table) */
  viewMode: StudentUIState['viewMode'];
  /** Current filters */
  filters: StudentFilters;
  /** Search query */
  searchQuery: string;
  /** Sort configuration */
  sortConfig: { sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] };
  /** Pagination info */
  paginationInfo: any;
  /** Bulk select mode */
  isBulkSelectMode: boolean;
  /** Expanded card IDs */
  expandedCardIds: string[];
  
  // UI Actions
  /** Select a student */
  selectStudent: (id: string) => void;
  /** Deselect a student */
  deselectStudent: (id: string) => void;
  /** Select multiple students */
  selectMultipleStudents: (ids: string[]) => void;
  /** Select all students */
  selectAllStudents: (ids: string[]) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Toggle bulk select mode */
  toggleBulkSelectMode: () => void;
  /** Set view mode */
  setViewMode: (mode: StudentUIState['viewMode']) => void;
  /** Set filters */
  setFilters: (filters: Partial<StudentFilters>) => void;
  /** Clear filters */
  clearFilters: () => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Set sorting */
  setSorting: (config: { sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] }) => void;
  /** Set page */
  setPage: (page: number) => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Toggle card expansion */
  toggleCardExpansion: (id: string) => void;
}

/**
 * Return type for useStudentDetail hook
 */
export interface UseStudentDetailReturn {
  /** Student data */
  student: Student | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching */
  isFetching: boolean;
  /** Manual refetch function */
  refetch: () => void;
}

/**
 * Return type for useStudentSearch hook
 */
export interface UseStudentSearchReturn {
  /** Search results */
  students: Student[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching */
  isFetching: boolean;
}

/**
 * Statistics data structure
 */
export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  byGrade: Record<string, number>;
  bySchool?: Record<string, number>;
  recentEnrollments: number;
}

// =====================
// QUERY HOOKS
// =====================

/**
 * Hook for fetching paginated student list with filters and Redux integration.
 *
 * @param filters - Optional filters for student list
 * @returns Student list with pagination, loading states, and UI management
 *
 * @example
 * ```tsx
 * const { 
 *   students, 
 *   pagination, 
 *   isLoading,
 *   selectedStudentIds,
 *   viewMode,
 *   setViewMode,
 *   selectStudent
 * } = useStudents({
 *   grade: '5',
 *   isActive: true,
 *   page: 1,
 *   limit: 20
 * });
 * ```
 */
export const useStudents = (filters: StudentFilters = {}): UseStudentsReturn => {
  const dispatch = useAppDispatch();
  
  // TanStack Query for server state
  const queryResult = useQuery({
    queryKey: studentKeys.list(filters),
    queryFn: () => studentsApi.getAll(filters),
    staleTime: CACHE_CONFIG.LIST_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    // Keep previous data while fetching new page for better UX
    placeholderData: (previousData) => previousData,
  });

  // Redux UI state selectors
  const selectedStudentIds = useAppSelector(selectSelectedStudentIds);
  const selectedStudents = useAppSelector(selectSelectedStudents);
  const viewMode = useAppSelector(selectStudentViewMode);
  const uiFilters = useAppSelector(selectStudentFilters);
  const searchQuery = useAppSelector(selectStudentSearchQuery);
  const sortConfig = useAppSelector(selectStudentSort);
  const paginationInfo = useAppSelector(selectStudentPaginationInfo);
  const isBulkSelectMode = useAppSelector(selectIsBulkSelectMode);
  const expandedCardIds = useAppSelector(selectExpandedStudentCards);

  // Extract students array and pagination from response
  const students = useMemo(() => queryResult.data?.students || [], [queryResult.data?.students]);

  const pagination = useMemo(() => {
    if (!queryResult.data?.pagination) return undefined;

    return {
      total: queryResult.data.pagination.total,
      page: queryResult.data.pagination.page,
      limit: queryResult.data.pagination.limit,
      totalPages: queryResult.data.pagination.pages,
    };
  }, [queryResult.data]);

  // UI action creators
  const selectStudent = useCallback((id: string) => {
    dispatch(studentsActions.selectStudent(id));
  }, [dispatch]);

  const deselectStudent = useCallback((id: string) => {
    dispatch(studentsActions.deselectStudent(id));
  }, [dispatch]);

  const selectMultipleStudents = useCallback((ids: string[]) => {
    dispatch(studentsActions.selectMultipleStudents(ids));
  }, [dispatch]);

  const selectAllStudents = useCallback((ids: string[]) => {
    dispatch(studentsActions.selectAllStudents(ids));
  }, [dispatch]);

  const clearSelection = useCallback(() => {
    dispatch(studentsActions.clearSelection());
  }, [dispatch]);

  const toggleBulkSelectMode = useCallback(() => {
    dispatch(studentsActions.toggleBulkSelectMode());
  }, [dispatch]);

  const setViewMode = useCallback((mode: StudentUIState['viewMode']) => {
    dispatch(studentsActions.setViewMode(mode));
  }, [dispatch]);

  const setFilters = useCallback((newFilters: Partial<StudentFilters>) => {
    dispatch(studentsActions.setFilters(newFilters));
  }, [dispatch]);

  const clearFilters = useCallback(() => {
    dispatch(studentsActions.clearFilters());
  }, [dispatch]);

  const setSearchQuery = useCallback((query: string) => {
    dispatch(studentsActions.setSearchQuery(query));
  }, [dispatch]);

  const setSorting = useCallback((config: { sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] }) => {
    dispatch(studentsActions.setSorting(config));
  }, [dispatch]);

  const setPage = useCallback((page: number) => {
    dispatch(studentsActions.setPage(page));
  }, [dispatch]);

  const setPageSize = useCallback((size: number) => {
    dispatch(studentsActions.setPageSize(size));
  }, [dispatch]);

  const toggleCardExpansion = useCallback((id: string) => {
    dispatch(studentsActions.toggleCardExpansion(id));
  }, [dispatch]);

  return {
    // Server state
    data: queryResult.data,
    students,
    pagination,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isFetching: queryResult.isFetching,
    isInitialLoading: queryResult.isLoading && queryResult.isFetching,
    refetch: queryResult.refetch,
    
    // Redux UI state
    selectedStudentIds,
    selectedStudents,
    viewMode,
    filters: uiFilters,
    searchQuery,
    sortConfig,
    paginationInfo,
    isBulkSelectMode,
    expandedCardIds,
    
    // UI Actions
    selectStudent,
    deselectStudent,
    selectMultipleStudents,
    selectAllStudents,
    clearSelection,
    toggleBulkSelectMode,
    setViewMode,
    setFilters,
    clearFilters,
    setSearchQuery,
    setSorting,
    setPage,
    setPageSize,
    toggleCardExpansion,
  };
};

/**
 * Hook for fetching a single student by ID.
 *
 * @param studentId - Student ID to fetch
 * @param options - Additional query options
 * @returns Student detail with loading states
 *
 * @example
 * ```tsx
 * const { student, isLoading } = useStudentDetail('student-123');
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (!student) return <NotFound />;
 *
 * return <StudentProfile student={student} />;
 * ```
 */
export const useStudentDetail = (
  studentId: string | undefined,
  options?: {
    enabled?: boolean;
  }
): UseStudentDetailReturn => {
  const queryResult = useQuery({
    queryKey: studentKeys.detail(studentId || ''),
    queryFn: () => studentsApi.getById(studentId!),
    enabled: !!studentId && (options?.enabled !== false),
    staleTime: CACHE_CONFIG.DETAIL_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
  });

  return {
    student: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
  };
};

/**
 * Hook for searching students by query string.
 * Automatically debounced by the API layer.
 *
 * @param query - Search query string
 * @param options - Additional query options
 * @returns Search results with loading states
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('');
 * const { students, isLoading } = useStudentSearch(searchQuery);
 *
 * return (
 *   <>
 *     <SearchInput value={searchQuery} onChange={setSearchQuery} />
 *     {isLoading ? <LoadingSpinner /> : <StudentList students={students} />}
 *   </>
 * );
 * ```
 */
export const useStudentSearch = (
  query: string,
  options?: {
    enabled?: boolean;
  }
): UseStudentSearchReturn => {
  const trimmedQuery = query.trim();

  const queryResult = useQuery({
    queryKey: studentKeys.search(trimmedQuery),
    queryFn: () => studentsApi.search(trimmedQuery),
    enabled: trimmedQuery.length > 0 && (options?.enabled !== false),
    staleTime: CACHE_CONFIG.SEARCH_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
  });

  return {
    students: queryResult.data || [],
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isFetching: queryResult.isFetching,
  };
};

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
export const useAssignedStudents = () => {
  const queryResult = useQuery({
    queryKey: studentKeys.assigned(),
    queryFn: () => studentsApi.getAssignedStudents(),
    staleTime: CACHE_CONFIG.LIST_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
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
 * NOTE: This is a placeholder - backend endpoint needs to be implemented.
 * Currently returns mock data structure.
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
export const useStudentStats = () => {
  // TODO: Implement backend endpoint for student statistics
  const queryResult = useQuery({
    queryKey: studentKeys.stats(),
    queryFn: async (): Promise<StudentStats> => {
      // Placeholder - replace with actual API call when backend is ready
      throw new Error('Student statistics endpoint not yet implemented');
    },
    staleTime: CACHE_CONFIG.STATS_STALE_TIME,
    gcTime: CACHE_CONFIG.DEFAULT_CACHE_TIME,
    enabled: false, // Disable until backend is ready
  });

  return {
    stats: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error as Error | null,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
  };
};

// =====================
// MUTATION HOOKS
// =====================

/**
 * Hook for creating a new student.
 *
 * IMPORTANT: No optimistic updates for healthcare data - ensures data integrity.
 * Invalidates student list cache on success.
 *
 * @returns Mutation handlers for student creation
 *
 * @example
 * ```tsx
 * const createStudent = useCreateStudent();
 *
 * const handleSubmit = async (data: CreateStudentData) => {
 *   try {
 *     const newStudent = await createStudent.mutateAsync(data);
 *     toast.success('Student created successfully');
 *     navigate(`/students/${newStudent.id}`);
 *   } catch (error) {
 *     toast.error('Failed to create student');
 *   }
 * };
 * ```
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),
    onSuccess: (newStudent) => {
      // Invalidate all student list queries to refetch with new student
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Optionally pre-populate the detail cache with the new student
      queryClient.setQueryData(studentKeys.detail(newStudent.id), newStudent);

      // Also invalidate stats if they exist
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });

      // Update Redux store
      dispatch(studentsActions.addOne(newStudent));
    },
    onError: (error: Error) => {
      // Healthcare data errors should be logged for audit
      console.error('Failed to create student:', error);
    },
  });
};

/**
 * Hook for updating an existing student.
 *
 * IMPORTANT: No optimistic updates for healthcare data.
 * Invalidates both list and detail caches on success.
 *
 * @returns Mutation handlers for student updates
 *
 * @example
 * ```tsx
 * const updateStudent = useUpdateStudent();
 *
 * const handleUpdate = async (id: string, data: UpdateStudentData) => {
 *   try {
 *     await updateStudent.mutateAsync({ id, data });
 *     toast.success('Student updated successfully');
 *   } catch (error) {
 *     toast.error('Failed to update student');
 *   }
 * };
 * ```
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) =>
      studentsApi.update(id, data),
    onSuccess: (updatedStudent, variables) => {
      // Invalidate the specific student detail query
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });

      // Invalidate all list queries as the update might affect filtering/sorting
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Invalidate assigned students if this might affect assignment
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });

      // Update Redux store
      dispatch(studentsActions.updateOne({ id: variables.id, changes: updatedStudent }));
    },
    onError: (error: Error) => {
      console.error('Failed to update student:', error);
    },
  });
};

/**
 * Hook for deleting a student.
 *
 * IMPORTANT: Student deletion is a critical operation.
 * Consider implementing soft delete (isActive flag) instead of hard delete.
 *
 * @returns Mutation handlers for student deletion
 *
 * @example
 * ```tsx
 * const deleteStudent = useDeleteStudent();
 *
 * const handleDelete = async (id: string) => {
 *   if (!confirm('Are you sure you want to delete this student?')) return;
 *
 *   try {
 *     await deleteStudent.mutateAsync(id);
 *     toast.success('Student deleted successfully');
 *     navigate('/students');
 *   } catch (error) {
 *     toast.error('Failed to delete student');
 *   }
 * };
 * ```
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: studentKeys.detail(deletedId) });

      // Invalidate all list queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Invalidate assigned students
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete student:', error);
    },
  });
};

/**
 * Hook for bulk importing students.
 *
 * @returns Mutation handlers for bulk student import
 *
 * @example
 * ```tsx
 * const bulkImport = useBulkImportStudents();
 *
 * const handleImport = async (students: CreateStudentData[]) => {
 *   try {
 *     const result = await bulkImport.mutateAsync(students);
 *     toast.success(`Imported ${result.success} students. ${result.failed} failed.`);
 *   } catch (error) {
 *     toast.error('Bulk import failed');
 *   }
 * };
 * ```
 */
export const useBulkImportStudents = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (students: CreateStudentData[]) => {
      // Since bulkImport might not exist, we'll process them individually
      const results = await Promise.allSettled(
        students.map(student => studentsApi.create(student))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      return { success: successful, failed, total: students.length };
    },
    onSuccess: () => {
      // Invalidate all student queries as bulk import affects everything
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
    onError: (error: Error) => {
      console.error('Bulk import failed:', error);
    },
  });
};

/**
 * Hook for exporting student data.
 *
 * @returns Mutation handlers for student export
 *
 * @example
 * ```tsx
 * const exportStudents = useExportStudents();
 *
 * const handleExport = async (studentId: string) => {
 *   try {
 *     const exportData = await exportStudents.mutateAsync(studentId);
 *     // Process export data
 *     console.log('Export successful:', exportData);
 *   } catch (error) {
 *     toast.error('Export failed');
 *   }
 * };
 * ```
 */
export const useExportStudents = () => {
  return useMutation({
    mutationFn: (studentId: string) =>
      studentsApi.exportStudentData(studentId),
    onError: (error: Error) => {
      console.error('Export failed:', error);
    },
  });
};

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
        queryFn: () => studentsApi.getById(studentId),
        staleTime: CACHE_CONFIG.DETAIL_STALE_TIME,
      });
    }, [queryClient]),

    /** Prefetch students list with filters */
    prefetchStudents: useCallback(async (filters: StudentFilters = {}) => {
      await queryClient.prefetchQuery({
        queryKey: studentKeys.list(filters),
        queryFn: () => studentsApi.getAll(filters),
        staleTime: CACHE_CONFIG.LIST_STALE_TIME,
      });
    }, [queryClient]),
  };
};

// =====================
// BACKWARD COMPATIBILITY EXPORTS
// =====================

/**
 * @deprecated Use useStudents instead
 * Maintained for backward compatibility
 */
export interface UseStudentsReturn_Legacy {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
}

/**
 * @deprecated Use useStudentSearch instead
 * Maintained for backward compatibility
 */
export { useStudentSearch as useStudentSearch_Legacy };
