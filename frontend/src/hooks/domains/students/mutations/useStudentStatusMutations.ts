/**
 * Student Status Mutation Hooks
 *
 * Deactivation and reactivation operations for students
 *
 * @module hooks/students/mutations/useStudentStatusMutations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { studentQueryKeys } from './queryKeys';
import { apiActions } from '@/lib/api';
import { STUDENT_MUTATION_CONFIG } from './cacheConfig';
import { invalidateStudentCache } from './utils';
import type { ApiError, StudentMutationResult } from './types';

/**
 * Hook for soft-deleting a student (deactivation)
 *
 * Healthcare systems typically use soft deletes to maintain audit trails
 *
 * @param options - Mutation options
 * @returns Mutation handlers for deactivation
 */
export const useDeactivateStudent = (
  options?: UseMutationOptions<StudentMutationResult, ApiError, string>
) => {
  const queryClient = useQueryClient();
  const config = STUDENT_MUTATION_CONFIG.default;

  return useMutation({
    mutationFn: async (studentId: string): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await apiActions.students.update(studentId, { isActive: false });

        return {
          success: true,
          student: updatedStudent,
          message: `Student ${updatedStudent.firstName} ${updatedStudent.lastName} deactivated`,
          auditId: `deactivate_${Date.now()}_${studentId}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: error.context || 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result: StudentMutationResult, studentId: string) => {
      // Update cache to reflect deactivation
      if (result.student) {
        queryClient.setQueryData(studentQueryKeys.details.byId(studentId), result.student);
      }

      // Granular invalidation for status change
      await invalidateStudentCache(
        queryClient,
        'update-status',
        studentId,
        { isActive: true },
        { isActive: false }
      );

      console.info('Student deactivated:', {
        studentId,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'DEACTIVATE_STUDENT',
      });

      options?.onSuccess?.(result, studentId);
    },

    onError: (error: ApiError, studentId: string) => {
      console.error('Student deactivation failed:', {
        error: error.message,
        studentId,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, studentId);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for reactivating a deactivated student
 *
 * @param options - Mutation options
 * @returns Mutation handlers for reactivation
 */
export const useReactivateStudent = (
  options?: UseMutationOptions<StudentMutationResult, ApiError, string>
) => {
  const queryClient = useQueryClient();
  const config = STUDENT_MUTATION_CONFIG.default;

  return useMutation({
    mutationFn: async (studentId: string): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await apiActions.students.update(studentId, { isActive: true });

        return {
          success: true,
          student: updatedStudent,
          message: `Student ${updatedStudent.firstName} ${updatedStudent.lastName} reactivated`,
          auditId: `reactivate_${Date.now()}_${studentId}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: error.context || 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result: StudentMutationResult, studentId: string) => {
      if (result.student) {
        queryClient.setQueryData(studentQueryKeys.details.byId(studentId), result.student);
      }

      // Granular invalidation for status change
      await invalidateStudentCache(
        queryClient,
        'update-status',
        studentId,
        { isActive: false },
        { isActive: true }
      );

      console.info('Student reactivated:', {
        studentId,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'REACTIVATE_STUDENT',
      });

      options?.onSuccess?.(result, studentId);
    },

    onError: (error: ApiError, studentId: string) => {
      console.error('Student reactivation failed:', {
        error: error.message,
        studentId,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, studentId);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};
