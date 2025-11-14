/**
 * WF-COMP-147 | useStudentCoreQueries.ts - Core student query hooks
 * Purpose: Basic student fetching hooks (list, detail, search)
 * Upstream: @tanstack/react-query, @/services, Redux store
 * Downstream: Student components and pages
 * Exports: useStudents, useStudentDetail, useStudentSearch
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

import { useQuery } from '@tanstack/react-query';
import { apiActions } from '@/lib/api';
import type { StudentFilters } from '@/types/student.types';
import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  studentsActions,
  selectSelectedStudentIds,
  selectStudentViewMode,
  selectStudentFilters,
  selectStudentSort,
  selectStudentPaginationInfo,
  selectStudentSearchQuery,
  selectSelectedStudents,
  selectIsBulkSelectMode,
  selectExpandedStudentCards,
  type StudentUIState,
} from '@/stores/slices/students';
import { studentKeys, CACHE_CONFIG } from './studentQueryKeys';
import type {
  UseStudentsReturn,
  UseStudentDetailReturn,
  UseStudentSearchReturn,
} from './studentQueryTypes';

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
    queryFn: () => apiActions.students.getAll(filters),
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
    queryFn: () => apiActions.students.getById(studentId!),
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
    queryFn: () => apiActions.students.search(trimmedQuery),
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
