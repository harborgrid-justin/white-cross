/**
 * Student Mutations Hook
 * 
 * Enterprise-grade mutations for student data management with
 * proper PHI handling, optimistic updates, and compliance logging.
 * 
 * @module hooks/domains/students/mutations/useStudentMutations
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { apiActions } from '@/lib/api';
import { useApiError } from '@/hooks/shared/useApiError';
import { useCacheManager } from '@/hooks/shared/useCacheManager';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import { 
  studentQueryKeys, 
  STUDENT_OPERATIONS,
  STUDENT_ERROR_CODES,
  STUDENT_CACHE_CONFIG
} from '../config';
import type { 
  Student, 
  CreateStudentData, 
  UpdateStudentData 
} from '@/types/student.types';

/**
 * Student mutation operations interface
 */
export interface StudentMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enableOptimisticUpdates?: boolean;
}

/**
 * Student mutations result interface
 */
export interface StudentMutationsResult {
  // Create operations
  createStudent: {
    mutate: (data: CreateStudentData) => void;
    mutateAsync: (data: CreateStudentData) => Promise<Student>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Update operations
  updateStudent: {
    mutate: (data: { id: string; student: UpdateStudentData }) => void;
    mutateAsync: (data: { id: string; student: UpdateStudentData }) => Promise<Student>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Delete operations
  deleteStudent: {
    mutate: (id: string) => void;
    mutateAsync: (id: string) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
  };
  
  // Utility functions
  invalidateStudentData: (studentId?: string) => Promise<void>;
  optimisticallyUpdateStudent: (studentId: string, updates: Partial<Student>) => void;
  rollbackOptimisticUpdate: (studentId: string) => void;
}

/**
 * Enterprise student mutations hook
 * 
 * Provides CRUD operations for student management with:
 * - PHI-compliant audit logging
 * - Optimistic updates
 * - Intelligent cache invalidation
 * - Error handling with healthcare context
 * - Performance monitoring
 * 
 * @param options - Mutation configuration options
 * @returns Student mutation operations and state
 */
export function useStudentMutations(
  options: StudentMutationOptions = {}
): StudentMutationsResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { invalidateCacheManager } = useCacheManager();
  const { logCompliantAccess } = useHealthcareCompliance();

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationKey: [STUDENT_OPERATIONS.CREATE],
    mutationFn: async (studentData: CreateStudentData): Promise<Student> => {
      try {
        // Log compliance event
        await logCompliantAccess({
          operation: STUDENT_OPERATIONS.CREATE,
          resourceType: 'student',
          sensitivity: 'high',
          context: { operation: 'create_student' }
        });

        const student = await apiActions.students.create(studentData);

        if (!student) {
          throw new Error(STUDENT_ERROR_CODES.CREATE_FAILED);
        }

        return student;
      } catch (error: any) {
        throw handleApiError(error, STUDENT_OPERATIONS.CREATE);
      }
    },
    onSuccess: (student: Student) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.all,
      });

      // Update list cache optimistically
      queryClient.setQueryData(
        studentQueryKeys.details.byId(student.id),
        student
      );

      options.onSuccess?.(student);
    },
    onError: (error: Error) => {
      handleApiError(error, STUDENT_OPERATIONS.CREATE);
      options.onError?.(error);
    },
    gcTime: STUDENT_CACHE_CONFIG.mutations.gcTime,
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationKey: [STUDENT_OPERATIONS.UPDATE],
    mutationFn: async ({ id, student }: { id: string; student: UpdateStudentData }): Promise<Student> => {
      try {
        // Log compliance event
        await logCompliantAccess({
          operation: STUDENT_OPERATIONS.UPDATE,
          resourceType: 'student',
          resourceId: id,
          sensitivity: 'high',
          context: { operation: 'update_student', studentId: id }
        });

        const updatedStudent = await apiActions.students.update(id, student);

        if (!updatedStudent) {
          throw new Error(STUDENT_ERROR_CODES.UPDATE_FAILED);
        }

        return updatedStudent;
      } catch (error: any) {
        throw handleApiError(error, STUDENT_OPERATIONS.UPDATE);
      }
    },
    onMutate: async ({ id, student }: { id: string; student: UpdateStudentData }) => {
      if (!options.enableOptimisticUpdates) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: studentQueryKeys.details.byId(id),
      });

      // Snapshot previous value
      const previousStudent = queryClient.getQueryData<Student>(
        studentQueryKeys.details.byId(id)
      );

      // Optimistically update
      if (previousStudent) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(id),
          { ...previousStudent, ...student }
        );
      }

      return { previousStudent };
    },
    onSuccess: (student: Student, { id }) => {
      // Update cache with server response
      queryClient.setQueryData(
        studentQueryKeys.details.byId(id),
        student
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists._def,
      });

      options.onSuccess?.(student);
    },
    onError: (error: Error, { id }, context: any) => {
      // Rollback optimistic update
      if (context?.previousStudent) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(id),
          context.previousStudent
        );
      }

      handleApiError(error, STUDENT_OPERATIONS.UPDATE);
      options.onError?.(error);
    },
    gcTime: STUDENT_CACHE_CONFIG.mutations.gcTime,
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationKey: [STUDENT_OPERATIONS.DELETE],
    mutationFn: async (id: string): Promise<void> => {
      try {
        // Log compliance event
        await logCompliantAccess({
          operation: STUDENT_OPERATIONS.DELETE,
          resourceType: 'student',
          resourceId: id,
          sensitivity: 'critical',
          context: { operation: 'delete_student', studentId: id }
        });

        const result = await apiActions.students.delete(id);

        if (!result.success) {
          throw new Error(result.message || STUDENT_ERROR_CODES.DELETE_FAILED);
        }
      } catch (error: any) {
        throw handleApiError(error, STUDENT_OPERATIONS.DELETE);
      }
    },
    onMutate: async (id: string) => {
      if (!options.enableOptimisticUpdates) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: studentQueryKeys.details.byId(id),
      });

      // Snapshot previous value
      const previousStudent = queryClient.getQueryData<Student>(
        studentQueryKeys.details.byId(id)
      );

      // Optimistically remove from cache
      queryClient.removeQueries({
        queryKey: studentQueryKeys.details.byId(id),
      });

      return { previousStudent };
    },
    onSuccess: (_, id) => {
      // Remove from all caches
      queryClient.removeQueries({
        queryKey: studentQueryKeys.details.byId(id),
      });

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists._def,
      });

      options.onSuccess?.(id);
    },
    onError: (error: Error, id, context: any) => {
      // Rollback optimistic update
      if (context?.previousStudent) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(id),
          context.previousStudent
        );
      }

      handleApiError(error, STUDENT_OPERATIONS.DELETE);
      options.onError?.(error);
    },
    gcTime: STUDENT_CACHE_CONFIG.mutations.gcTime,
  });

  // Cache invalidation utility
  const invalidateStudentData = useCallback(async (studentId?: string) => {
    if (studentId) {
      // Invalidate specific student
      await invalidateCacheManager([...studentQueryKeys.details.byId(studentId)], 'exact');
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.details.byId(studentId),
      });
    } else {
      // Invalidate all student data
      await invalidateCacheManager([...studentQueryKeys.all], 'prefix');
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.all,
      });
    }
  }, [invalidateCacheManager, queryClient]);

  // Optimistic update utility
  const optimisticallyUpdateStudent = useCallback(
    (studentId: string, updates: Partial<Student>) => {
      const previousData = queryClient.getQueryData<Student>(
        studentQueryKeys.details.byId(studentId)
      );

      if (previousData) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(studentId),
          { ...previousData, ...updates }
        );
      }
    },
    [queryClient]
  );

  // Rollback optimistic update utility
  const rollbackOptimisticUpdate = useCallback(
    (studentId: string) => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.details.byId(studentId),
      });
    },
    [queryClient]
  );

  // Return mutation operations with consistent interface
  return useMemo(
    () => ({
      createStudent: {
        mutate: createStudentMutation.mutate,
        mutateAsync: createStudentMutation.mutateAsync,
        isLoading: createStudentMutation.isPending,
        error: createStudentMutation.error,
        isError: createStudentMutation.isError,
        isSuccess: createStudentMutation.isSuccess,
      },
      updateStudent: {
        mutate: updateStudentMutation.mutate,
        mutateAsync: updateStudentMutation.mutateAsync,
        isLoading: updateStudentMutation.isPending,
        error: updateStudentMutation.error,
        isError: updateStudentMutation.isError,
        isSuccess: updateStudentMutation.isSuccess,
      },
      deleteStudent: {
        mutate: deleteStudentMutation.mutate,
        mutateAsync: deleteStudentMutation.mutateAsync,
        isLoading: deleteStudentMutation.isPending,
        error: deleteStudentMutation.error,
        isError: deleteStudentMutation.isError,
        isSuccess: deleteStudentMutation.isSuccess,
      },
      invalidateStudentData,
      optimisticallyUpdateStudent,
      rollbackOptimisticUpdate,
    }),
    [
      createStudentMutation,
      updateStudentMutation,
      deleteStudentMutation,
      invalidateStudentData,
      optimisticallyUpdateStudent,
      rollbackOptimisticUpdate,
    ]
  );
}

/**
 * Convenience hook for student creation only
 */
export function useCreateStudent(options: StudentMutationOptions = {}) {
  const { createStudent } = useStudentMutations(options);
  return createStudent;
}

/**
 * Convenience hook for student updates only
 */
export function useUpdateStudent(options: StudentMutationOptions = {}) {
  const { updateStudent } = useStudentMutations(options);
  return updateStudent;
}

/**
 * Convenience hook for student deletion only
 */
export function useDeleteStudent(options: StudentMutationOptions = {}) {
  const { deleteStudent } = useStudentMutations(options);
  return deleteStudent;
}
