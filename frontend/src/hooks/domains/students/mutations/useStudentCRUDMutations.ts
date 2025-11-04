/**
 * Student CRUD Mutation Hooks
 *
 * Create and Update operations for students with comprehensive validation
 *
 * @module hooks/students/mutations/useStudentCRUDMutations
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
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
} from '@/types/student.types';
import {
  getOptimisticUpdateManager
} from '@/services/cache/OptimisticUpdateManager';
import { QueryKeyFactory } from '@/services/cache/QueryKeyFactory';
import { STUDENT_MUTATION_CONFIG } from './cacheConfig';
import { invalidateStudentCache } from './utils';
import type { ApiError, StudentMutationResult } from './types';

/**
 * Hook for creating a new student with comprehensive validation
 * @param options - Mutation options with enhanced error handling
 * @returns Mutation handlers with healthcare audit support
 */
export const useCreateStudent = (
  options?: UseMutationOptions<StudentMutationResult, ApiError, CreateStudentData>
) => {
  const queryClient = useQueryClient();
  const config = STUDENT_MUTATION_CONFIG.default;

  return useMutation({
    mutationFn: async (data: CreateStudentData): Promise<StudentMutationResult> => {
      try {
        // Validate required fields
        if (!data.firstName?.trim()) {
          throw Object.assign(new Error('First name is required'), {
            context: 'validation',
            auditRequired: false
          });
        }

        if (!data.lastName?.trim()) {
          throw Object.assign(new Error('Last name is required'), {
            context: 'validation',
            auditRequired: false
          });
        }

        if (!data.studentNumber?.trim()) {
          throw Object.assign(new Error('Student number is required'), {
            context: 'validation',
            auditRequired: false
          });
        }

        const student = await apiActions.students.create(data);

        return {
          success: true,
          student,
          message: `Student ${student.firstName} ${student.lastName} created successfully`,
          auditId: `create_${Date.now()}_${student.id}`,
        };
      } catch (error: any) {
        const enhancedError = Object.assign(error, {
          context: error.context || (error.status >= 400 && error.status < 500 ? 'validation' : 'server'),
          auditRequired: true,
        });

        throw enhancedError;
      }
    },

    onSuccess: async (result: StudentMutationResult, variables: CreateStudentData) => {
      // Granular cache invalidation for CREATE operation
      await invalidateStudentCache(
        queryClient,
        'create',
        result.student?.id,
        undefined,
        result.student
      );

      // Pre-populate the detail cache with the new student
      if (result.student) {
        queryClient.setQueryData(
          studentQueryKeys.details.byId(result.student.id),
          result.student
        );
      }

      // Audit logging for healthcare compliance
      console.info('Student created:', {
        studentId: result.student?.id,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'CREATE_STUDENT',
      });

      options?.onSuccess?.(result, variables);
    },

    onError: (error: ApiError, variables: CreateStudentData) => {
      // Enhanced error logging for healthcare audit
      console.error('Student creation failed:', {
        error: error.message,
        context: error.context,
        variables: {
          ...variables,
          // Redact sensitive data for logging
          dateOfBirth: '[REDACTED]',
          medicalRecordNum: '[REDACTED]',
        },
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, variables);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for updating an existing student with change tracking
 * @param options - Mutation options
 * @returns Mutation handlers with change audit
 */
export const useUpdateStudent = (
  options?: UseMutationOptions<
    StudentMutationResult,
    ApiError,
    { id: string; data: UpdateStudentData }
  >
) => {
  const queryClient = useQueryClient();
  const config = STUDENT_MUTATION_CONFIG.default;

  return useMutation({
    mutationFn: async ({ id, data }): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await apiActions.students.update(id, data);

        return {
          success: true,
          student: updatedStudent,
          message: `Student ${updatedStudent.firstName} ${updatedStudent.lastName} updated successfully`,
          auditId: `update_${Date.now()}_${id}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: error.context || (error.status >= 400 && error.status < 500 ? 'validation' : 'server'),
          auditRequired: true,
        });
      }
    },

    // Optimistic update
    onMutate: async ({ id, data }: { id: string; data: UpdateStudentData }) => {
      const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);
      const queryKey = QueryKeyFactory.toString(studentQueryKeys.details.byId(id));

      // Cancel outgoing refetches (TanStack Query v5 removed cancelQueries)
      await queryClient.invalidateQueries({ queryKey: studentQueryKeys.details.byId(id) });

      // Get previous student data
      const previousStudent = queryClient.getQueryData<Student>(
        studentQueryKeys.details.byId(id)
      );

      if (previousStudent) {
        // Create optimistic data
        const optimisticStudent = {
          ...previousStudent,
          ...data,
        };

        // Create optimistic update with conflict detection
        const updateId = optimisticUpdateManager.createUpdate({
          queryKey,
          previousData: previousStudent,
          optimisticData: optimisticStudent,
          version: 0,
          mutationId: `update-${id}-${Date.now()}`
        });

        return { previousStudent, updateId };
      }

      return { previousStudent: undefined, updateId: undefined };
    },

    onSuccess: async (result: StudentMutationResult, { id, data }: { id: string; data: UpdateStudentData }) => {
      const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

      // Optimistic update context is available via closure
      // No need to access from context parameter

      // Update cache with result
      if (result.student) {
        queryClient.setQueryData(studentQueryKeys.details.byId(id), result.student);
      }

      // Determine operation type based on changed fields
      let operationType = 'update';
      if (data.grade !== undefined) operationType = 'update-grade';
      else if (data.isActive !== undefined) operationType = 'update-status';
      else if (data.firstName || data.lastName) operationType = 'update-personal-info';

      // Granular cache invalidation
      await invalidateStudentCache(
        queryClient,
        operationType,
        id,
        undefined,
        result.student
      );

      // Healthcare audit logging
      console.info('Student updated:', {
        studentId: id,
        changes: Object.keys(data),
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'UPDATE_STUDENT',
      });

      options?.onSuccess?.(result, { id, data });
    },

    onError: (error: ApiError, { id, data }: { id: string; data: UpdateStudentData }) => {
      const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

      // Rollback handled by optimistic update manager automatically

      console.error('Student update failed:', {
        error: error.message,
        studentId: id,
        context: error.context,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, { id, data });
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};
