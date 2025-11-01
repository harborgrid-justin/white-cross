/**
 * TanStack Query Hooks for Students Domain
 *
 * Provides React Query hooks for:
 * - Fetching students list with pagination and filtering
 * - Fetching individual student details
 * - Creating, updating, and deleting students
 * - Optimistic updates and cache management
 *
 * @module lib/query/hooks/useStudents
 * @version 1.0.0
 */

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';
import type { Student, PaginatedStudentsResponse } from '@/types/student.types';
import toast from 'react-hot-toast';

// ==========================================
// TYPES
// ==========================================

export interface StudentsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  grade?: string;
  isActive?: boolean;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  studentNumber?: string;
  medicalRecordNum?: string;
  enrollmentDate?: string;
}

export interface UpdateStudentData extends Partial<CreateStudentData> {
  id: string;
}

// ==========================================
// QUERY KEYS
// ==========================================

export const studentsKeys = {
  all: ['students'] as const,
  lists: () => [...studentsKeys.all, 'list'] as const,
  list: (params?: StudentsQueryParams) => [...studentsKeys.lists(), params] as const,
  details: () => [...studentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentsKeys.details(), id] as const,
  healthRecords: (id: string) => [...studentsKeys.detail(id), 'health-records'] as const,
  medications: (id: string) => [...studentsKeys.detail(id), 'medications'] as const,
  appointments: (id: string) => [...studentsKeys.detail(id), 'appointments'] as const,
  emergencyContacts: (id: string) => [...studentsKeys.detail(id), 'emergency-contacts'] as const,
};

// ==========================================
// QUERY HOOKS
// ==========================================

/**
 * Fetch paginated list of students with filtering
 */
export function useStudents(
  params?: StudentsQueryParams,
  options?: Omit<UseQueryOptions<PaginatedStudentsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: studentsKeys.list(params),
    queryFn: async () => {
      const queryParams: Record<string, string | number | boolean> = {
        page: params?.page || 1,
        limit: params?.limit || 20,
      };

      if (params?.search) {
        queryParams.search = params.search;
      }

      if (params?.grade) {
        queryParams.grade = params.grade;
      }

      if (params?.isActive !== undefined) {
        queryParams.isActive = params.isActive;
      }

      return apiClient.get<PaginatedStudentsResponse>(
        API_ENDPOINTS.students,
        queryParams
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    meta: {
      cacheTags: ['students'],
      errorMessage: 'Failed to load students',
    },
    ...options,
  });
}

/**
 * Fetch individual student details
 */
export function useStudent(
  id: string,
  options?: Omit<UseQueryOptions<Student>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: studentsKeys.detail(id),
    queryFn: async () => {
      return apiClient.get<Student>(API_ENDPOINTS.studentById(id));
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for individual records)
    gcTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      cacheTags: ['students', `student-${id}`],
      containsPHI: true,
      auditLog: true,
      errorMessage: 'Failed to load student details',
    },
    ...options,
  });
}

// ==========================================
// MUTATION HOOKS
// ==========================================

/**
 * Create new student
 */
export function useCreateStudent(
  options?: UseMutationOptions<Student, Error, CreateStudentData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateStudentData) => {
      return apiClient.post<Student>(API_ENDPOINTS.students, data);
    },
    onSuccess: (newStudent, variables, context) => {
      // Invalidate students list
      queryClient.invalidateQueries({ queryKey: studentsKeys.lists() });

      // Optionally add the new student to the cache
      queryClient.setQueryData(
        studentsKeys.detail(newStudent.id),
        newStudent
      );

      toast.success('Student created successfully');

      // Call custom success handler
      options?.onSuccess?.(newStudent, variables);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to create student');
      console.error('Create student error:', error);
      options?.onError?.(error, variables);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'CREATE_STUDENT',
      successMessage: 'Student created successfully',
      errorMessage: 'Failed to create student',
    },
    ...options,
  });
}

/**
 * Update existing student
 */
export function useUpdateStudent(
  options?: UseMutationOptions<Student, Error, UpdateStudentData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateStudentData) => {
      return apiClient.put<Student>(API_ENDPOINTS.studentById(id), data);
    },
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: studentsKeys.detail(variables.id),
      });

      // Snapshot previous value
      const previousStudent = queryClient.getQueryData<Student>(
        studentsKeys.detail(variables.id)
      );

      // Optimistically update the cache
      if (previousStudent) {
        queryClient.setQueryData<Student>(
          studentsKeys.detail(variables.id),
          { ...previousStudent, ...variables }
        );
      }

      return { previousStudent };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousStudent) {
        queryClient.setQueryData(
          studentsKeys.detail(variables.id),
          context.previousStudent
        );
      }

      toast.error('Failed to update student');
      console.error('Update student error:', error);
      options?.onError?.(error, variables);
    },
    onSuccess: (updatedStudent, variables, context) => {
      // Update the cache with server response
      queryClient.setQueryData(
        studentsKeys.detail(updatedStudent.id),
        updatedStudent
      );

      // Invalidate students list to reflect changes
      queryClient.invalidateQueries({ queryKey: studentsKeys.lists() });

      toast.success('Student updated successfully');
      options?.onSuccess?.(updatedStudent, variables);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'UPDATE_STUDENT',
      successMessage: 'Student updated successfully',
      errorMessage: 'Failed to update student',
    },
    ...options,
  });
}

/**
 * Delete (deactivate) student
 */
export function useDeleteStudent(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(API_ENDPOINTS.studentDeactivate(id), {});
    },
    onSuccess: (data, id, context) => {
      // Invalidate students list
      queryClient.invalidateQueries({ queryKey: studentsKeys.lists() });

      // Remove from detail cache
      queryClient.removeQueries({ queryKey: studentsKeys.detail(id) });

      toast.success('Student deactivated successfully');
      options?.onSuccess?.(data, id);
    },
    onError: (error, variables, context) => {
      toast.error('Failed to deactivate student');
      console.error('Delete student error:', error);
      options?.onError?.(error, variables);
    },
    meta: {
      affectsPHI: true,
      auditAction: 'DELETE_STUDENT',
      successMessage: 'Student deactivated successfully',
      errorMessage: 'Failed to deactivate student',
    },
    ...options,
  });
}

// ==========================================
// PREFETCH UTILITIES
// ==========================================

/**
 * Prefetch student details (useful for hover interactions)
 */
export function usePrefetchStudent() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: studentsKeys.detail(id),
      queryFn: async () => {
        return apiClient.get<Student>(API_ENDPOINTS.studentById(id));
      },
      staleTime: 2 * 60 * 1000,
    });
  };
}

/**
 * Prefetch students list
 */
export function usePrefetchStudents() {
  const queryClient = useQueryClient();

  return (params?: StudentsQueryParams) => {
    queryClient.prefetchQuery({
      queryKey: studentsKeys.list(params),
      queryFn: async () => {
        const queryParams: Record<string, string | number | boolean> = {
          page: params?.page || 1,
          limit: params?.limit || 20,
        };

        if (params?.search) {
          queryParams.search = params.search;
        }

        if (params?.grade) {
          queryParams.grade = params.grade;
        }

        if (params?.isActive !== undefined) {
          queryParams.isActive = params.isActive;
        }

        return apiClient.get<PaginatedStudentsResponse>(
          API_ENDPOINTS.students,
          queryParams
        );
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}
