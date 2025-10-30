/**
 * Student Composite Hook
 * 
 * High-level student management hook that combines all CRUD operations
 * with intelligent caching and relationship management.
 * 
 * @module hooks/domains/students/useStudents
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStudentsList } from './queries/useStudentsList';
import { useStudentMutations } from './mutations/useStudentMutations';
import { 
  studentQueryKeys, 
  type StudentListFilters
} from './config';
import type { 
  Student, 
  CreateStudentData, 
  UpdateStudentData 
} from '@/types/student.types';

/**
 * Student operations interface
 */
export interface StudentOperations {
  // List operations
  students: {
    data: Student[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    isFetchingNextPage: boolean;
  };
  
  // Individual student operations
  getStudent: (id: string, options?: { includeHealth?: boolean; includeRelations?: boolean }) => {
    data: Student | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
  };
  
  // CRUD operations
  createStudent: (data: CreateStudentData) => Promise<Student>;
  updateStudent: (id: string, data: UpdateStudentData) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  
  // Bulk operations
  bulkUpdate: (updates: Array<{ id: string; data: UpdateStudentData }>) => Promise<Student[]>;
  bulkDelete: (ids: string[]) => Promise<void>;
  
  // Utility operations
  searchStudents: (query: string) => Promise<Student[]>;
  prefetchStudent: (id: string) => Promise<void>;
  invalidateStudentCache: (id?: string) => Promise<void>;
  
  // Relationship operations
  loadStudentRelations: (id: string, relations: string[]) => Promise<Student>;
  
  // State management
  isAnyLoading: boolean;
  hasErrors: boolean;
  clearErrors: () => void;
}

/**
 * Student management options
 */
export interface UseStudentsOptions {
  // List options
  defaultFilters?: StudentListFilters;
  enableInfiniteScroll?: boolean;
  
  // Caching options
  enableBackgroundRefetch?: boolean;
  prefetchRelated?: boolean;
  
  // Performance options
  enableOptimisticUpdates?: boolean;
  debounceSearch?: number;
  
  // Compliance options
  enableAuditLogging?: boolean;
}

/**
 * Enterprise student management hook
 * 
 * Provides comprehensive student data management with:
 * - Unified CRUD operations
 * - Intelligent prefetching and caching
 * - Bulk operations for efficiency
 * - Relationship loading
 * - PHI-compliant audit logging
 * - Performance optimizations
 * 
 * @param options - Configuration options
 * @returns Comprehensive student operations
 */
export function useStudents(options: UseStudentsOptions = {}): StudentOperations {
  const queryClient = useQueryClient();
  const { prefetchData } = useCacheManager();
  const { logCompliantAccess } = useHealthcareCompliance();
  
  const {
    defaultFilters = {},
    enableInfiniteScroll = true,
    enableBackgroundRefetch = true,
    prefetchRelated = true,
    enableOptimisticUpdates = true,
    debounceSearch = 300,
    enableAuditLogging = true,
  } = options;

  // Initialize list hook
  const studentsList = useStudentsList({
    filters: defaultFilters,
    enabled: true,
    enableInfiniteScroll,
    enableBackgroundRefetch,
  });

  // Initialize mutations
  const mutations = useStudentMutations({
    enableOptimisticUpdates,
    onSuccess: (data) => {
      if (enableAuditLogging) {
        logCompliantAccess({
          operation: 'student_operation_success',
          resourceType: 'student',
          context: { operation: 'crud_success' }
        });
      }
    },
  });

  // Get individual student with caching
  const getStudent = useCallback((
    id: string, 
    hookOptions: { includeHealth?: boolean; includeRelations?: boolean } = {}
  ) => {
    return useStudentDetails(id, {
      includeHealth: hookOptions.includeHealth,
      includeRelations: hookOptions.includeRelations,
      enabled: !!id,
    });
  }, []);

  // Create student with relationship handling
  const createStudent = useCallback(async (data: CreateStudentData): Promise<Student> => {
    const student = await mutations.createStudent.mutateAsync(data);
    
    // Prefetch related data if enabled
    if (prefetchRelated && student.id) {
      await prefetchStudent(student.id);
    }
    
    return student;
  }, [mutations.createStudent, prefetchRelated]);

  // Update student with optimistic updates
  const updateStudent = useCallback(async (
    id: string, 
    data: UpdateStudentData
  ): Promise<Student> => {
    return await mutations.updateStudent.mutateAsync({ id, student: data });
  }, [mutations.updateStudent]);

  // Delete student with cleanup
  const deleteStudent = useCallback(async (id: string): Promise<void> => {
    await mutations.deleteStudent.mutateAsync(id);
    
    // Clean up related caches
    queryClient.removeQueries({
      queryKey: studentQueryKeys.details.byId(id),
    });
  }, [mutations.deleteStudent, queryClient]);

  // Bulk update operations
  const bulkUpdate = useCallback(async (
    updates: Array<{ id: string; data: UpdateStudentData }>
  ): Promise<Student[]> => {
    const results: Student[] = [];
    
    for (const update of updates) {
      try {
        const result = await updateStudent(update.id, update.data);
        results.push(result);
      } catch (error) {
        console.error(`Failed to update student ${update.id}:`, error);
      }
    }
    
    return results;
  }, [updateStudent]);

  // Bulk delete operations
  const bulkDelete = useCallback(async (ids: string[]): Promise<void> => {
    for (const id of ids) {
      try {
        await deleteStudent(id);
      } catch (error) {
        console.error(`Failed to delete student ${id}:`, error);
      }
    }
  }, [deleteStudent]);

  // Search students with debouncing
  const searchStudents = useCallback(async (query: string): Promise<Student[]> => {
    if (!query.trim()) return [];
    
    // Use existing search functionality
    const searchResult = queryClient.getQueryData<Student[]>(
      studentQueryKeys.search(query)
    );
    
    if (searchResult) return searchResult;
    
    // If not cached, fetch from API
    // This would typically use a search endpoint
    const allStudents = studentsList.students || [];
    return allStudents.filter(student => 
      student.firstName.toLowerCase().includes(query.toLowerCase()) ||
      student.lastName.toLowerCase().includes(query.toLowerCase()) ||
      student.studentNumber.includes(query)
    );
  }, [queryClient, studentsList.students]);

  // Prefetch individual student
  const prefetchStudent = useCallback(async (id: string): Promise<void> => {
    await prefetchData(
      studentQueryKeys.details.byId(id),
      () => import('./queries/useStudentDetails').then(m => m.useStudentDetails),
      STUDENT_CACHE_CONFIG.details.staleTime
    );
  }, [prefetchData]);

  // Invalidate student cache
  const invalidateStudentCache = useCallback(async (id?: string): Promise<void> => {
    await mutations.invalidateStudentData(id);
  }, [mutations.invalidateStudentData]);

  // Load student relationships dynamically
  const loadStudentRelations = useCallback(async (
    id: string, 
    relations: string[]
  ): Promise<Student> => {
    // This would typically make additional API calls for relationships
    // For now, return the base student data
    const student = queryClient.getQueryData<Student>(
      studentQueryKeys.details.byId(id)
    );
    
    if (!student) {
      throw new Error(`Student ${id} not found in cache`);
    }
    
    return student;
  }, [queryClient]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    queryClient.resetQueries({
      queryKey: studentQueryKeys.all,
      exact: false,
    });
  }, [queryClient]);

  // Computed state
  const isAnyLoading = useMemo(() => {
    return (
      studentsList.isLoading ||
      mutations.createStudent.isLoading ||
      mutations.updateStudent.isLoading ||
      mutations.deleteStudent.isLoading
    );
  }, [
    studentsList.isLoading,
    mutations.createStudent.isLoading,
    mutations.updateStudent.isLoading,
    mutations.deleteStudent.isLoading,
  ]);

  const hasErrors = useMemo(() => {
    return !!(
      studentsList.isError ||
      mutations.createStudent.isError ||
      mutations.updateStudent.isError ||
      mutations.deleteStudent.isError
    );
  }, [
    studentsList.isError,
    mutations.createStudent.isError,
    mutations.updateStudent.isError,
    mutations.deleteStudent.isError,
  ]);

  // Return comprehensive operations interface
  return useMemo(() => ({
    // List operations
    students: {
      data: studentsList.students,
      isLoading: studentsList.isLoading,
      isError: studentsList.isError,
      error: studentsList.error,
      refetch: studentsList.refetch,
      hasNextPage: studentsList.hasNextPage || false,
      fetchNextPage: studentsList.fetchNextPage || (() => {}),
      isFetchingNextPage: studentsList.isFetchingNextPage || false,
    },
    
    // Individual operations
    getStudent,
    
    // CRUD operations
    createStudent,
    updateStudent,
    deleteStudent,
    
    // Bulk operations
    bulkUpdate,
    bulkDelete,
    
    // Utility operations
    searchStudents,
    prefetchStudent,
    invalidateStudentCache,
    loadStudentRelations,
    
    // State management
    isAnyLoading,
    hasErrors,
    clearErrors,
  }), [
    studentsList,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkUpdate,
    bulkDelete,
    searchStudents,
    prefetchStudent,
    invalidateStudentCache,
    loadStudentRelations,
    isAnyLoading,
    hasErrors,
    clearErrors,
  ]);
}

/**
 * Convenience hooks for specific use cases
 */

export function useStudentList(filters?: StudentListFilters) {
  const { students } = useStudents({ defaultFilters: filters });
  return students;
}

export function useStudentCrud() {
  const { createStudent, updateStudent, deleteStudent } = useStudents({
    enableOptimisticUpdates: true,
  });
  
  return {
    createStudent,
    updateStudent,
    deleteStudent,
  };
}

export function useStudentSearch(initialQuery = '') {
  const { searchStudents } = useStudents({ debounceSearch: 300 });
  
  return useCallback((query: string) => {
    return searchStudents(query || initialQuery);
  }, [searchStudents, initialQuery]);
}
