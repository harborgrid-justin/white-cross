/**
 * Student Mutation Hooks
 * 
 * Production-grade TanStack Query mutation hooks for student CRUD operations 
 * with comprehensive error handling, cache management, and healthcare compliance.
 * 
 * @module hooks/students/mutations
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { studentQueryKeys } from './queryKeys';
import { cacheConfig, CACHE_INVALIDATION_STRATEGIES } from './cacheConfig';
import { studentsApi } from '@/services/modules/studentsApi';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  TransferStudentRequest,
  BulkUpdateStudentsRequest
} from '@/types/student.types';
import {
  getInvalidationStrategy,
  createStudentUpdateOperation
} from '@/services/cache/InvalidationStrategy';
import {
  getOptimisticUpdateManager
} from '@/services/cache/OptimisticUpdateManager';
import { QueryKeyFactory } from '@/services/cache/QueryKeyFactory';

/**
 * Enhanced API error type with healthcare-specific context
 */
interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  response?: any;
  context?: 'validation' | 'authorization' | 'server' | 'network' | 'compliance';
  auditRequired?: boolean;
}

/**
 * Mutation result types with enhanced metadata
 */
export interface StudentMutationResult {
  success: boolean;
  student?: Student;
  message?: string;
  errors?: Record<string, string[]>;
  auditId?: string;
}

export interface BulkMutationResult {
  success: boolean;
  successCount: number;
  failureCount: number;
  results: Array<{
    id: string;
    success: boolean;
    student?: Student;
    error?: string;
  }>;
  auditId?: string;
}

/**
 * Granular cache invalidation utility with surgical precision
 *
 * Replaces over-aggressive invalidation with operation-specific invalidation
 * Target: 60% reduction in cache invalidations
 */
const invalidateStudentCache = async (
  queryClient: ReturnType<typeof useQueryClient>,
  operationType: string,
  studentId?: string,
  previousValues?: Partial<Student>,
  newValues?: Partial<Student>
) => {
  const invalidationStrategy = getInvalidationStrategy(queryClient);

  // Determine changed fields
  const changedFields = previousValues && newValues
    ? Object.keys(newValues).filter(
        (key) => previousValues[key as keyof Student] !== newValues[key as keyof Student]
      )
    : undefined;

  // Create invalidation operation
  const operation = createStudentUpdateOperation(
    operationType,
    studentId || '',
    previousValues || {},
    newValues || {}
  );

  // Execute granular invalidation
  await invalidationStrategy.invalidate(operation);
};

/**
 * Hook for creating a new student with comprehensive validation
 * 
 * @param options - Mutation options with enhanced error handling
 * @returns Mutation handlers with healthcare audit support
 * 
 * @example
 * ```tsx
 * const createStudent = useCreateStudent({
 *   onSuccess: (result, context) => {
 *     toast.success(`Student ${result.student?.firstName} created successfully`);
 *     navigate(`/students/${result.student?.id}`);
 *   },
 *   onError: (error) => {
 *     if (error.context === 'validation') {
 *       setFormErrors(error.response?.data?.errors);
 *     } else {
 *       toast.error('Failed to create student. Please try again.');
 *     }
 *   }
 * });
 * 
 * const handleSubmit = async (data: CreateStudentData) => {
 *   try {
 *     await createStudent.mutateAsync(data);
 *   } catch (error) {
 *     // Error handling is done in onError callback
 *   }
 * };
 * ```
 */
export const useCreateStudent = (
  options?: UseMutationOptions<StudentMutationResult, ApiError, CreateStudentData>
) => {
  const queryClient = useQueryClient();
  const config = cacheConfig.mutations || { retry: 3 };

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

        const student = await studentsApi.create(data);
        
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

    onSuccess: async (result, variables, context) => {
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

      options?.onSuccess?.(result, variables, context, queryClient);
    },

    onError: (error, variables, context) => {
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

      options?.onError?.(error, variables, context, queryClient);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for updating an existing student with change tracking
 * 
 * @param options - Mutation options
 * @returns Mutation handlers with change audit
 * 
 * @example
 * ```tsx
 * const updateStudent = useUpdateStudent({
 *   onSuccess: (result, context) => {
 *     toast.success('Student updated successfully');
 *   }
 * });
 * 
 * const handleUpdate = async (id: string, changes: UpdateStudentData) => {
 *   await updateStudent.mutateAsync({ id, data: changes });
 * };
 * ```
 */
export const useUpdateStudent = (
  options?: UseMutationOptions<
    StudentMutationResult,
    ApiError,
    { id: string; data: UpdateStudentData }
  >
) => {
  const queryClient = useQueryClient();
  const config = cacheConfig.mutations || { retry: 3 };

  return useMutation({
    mutationFn: async ({ id, data }): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await studentsApi.update(id, data);

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
    onMutate: async ({ id, data }) => {
      const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);
      const queryKey = QueryKeyFactory.toString(studentQueryKeys.details.byId(id));

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentQueryKeys.details.byId(id) });

      // Get previous student data
      const previousStudent = queryClient.getQueryData<Student>(
        studentQueryKeys.details.byId(id)
      );

      if (previousStudent) {
        // Create optimistic data
        const optimisticStudent = {
          ...previousStudent,
          ...data,
          version: (previousStudent.version || 0) + 1
        };

        // Create optimistic update with conflict detection
        const updateId = optimisticUpdateManager.createUpdate({
          queryKey,
          previousData: previousStudent,
          optimisticData: optimisticStudent,
          version: previousStudent.version || 0,
          mutationId: `update-${id}-${Date.now()}`
        });

        return { previousStudent, updateId };
      }

      return { previousStudent: undefined, updateId: undefined };
    },

    onSuccess: async (result, { id, data }, context) => {
      const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

      // Commit optimistic update if exists
      if (context?.updateId) {
        await optimisticUpdateManager.commitUpdate(context.updateId, result.student);
      } else {
        // No optimistic update, set data directly
        if (result.student) {
          queryClient.setQueryData(studentQueryKeys.details.byId(id), result.student);
        }
      }

      // Determine operation type based on changed fields
      let operationType = 'update';
      if (data.grade !== undefined) operationType = 'update-grade';
      else if (data.schoolId !== undefined) operationType = 'update-school';
      else if (data.isActive !== undefined) operationType = 'update-status';
      else if (data.firstName || data.lastName) operationType = 'update-personal-info';

      // Granular cache invalidation
      await invalidateStudentCache(
        queryClient,
        operationType,
        id,
        context?.previousStudent,
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

      options?.onSuccess?.(result, { id, data }, context, queryClient);
    },

    onError: (error, { id, data }, context) => {
      const optimisticUpdateManager = getOptimisticUpdateManager(queryClient);

      // Rollback optimistic update if exists
      if (context?.updateId) {
        optimisticUpdateManager.rollbackUpdate(context.updateId);
      }

      console.error('Student update failed:', {
        error: error.message,
        studentId: id,
        context: error.context,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, { id, data }, context, queryClient);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

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
  const config = cacheConfig.mutations || { retry: 3 };

  return useMutation({
    mutationFn: async (studentId: string): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await studentsApi.update(studentId, { isActive: false });
        
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

    onSuccess: async (result, studentId, context) => {
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

      options?.onSuccess?.(result, studentId, context, queryClient);
    },

    onError: (error, studentId, context) => {
      console.error('Student deactivation failed:', {
        error: error.message,
        studentId,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, studentId, context, queryClient);
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
  const config = cacheConfig.mutations || { retry: 3 };

  return useMutation({
    mutationFn: async (studentId: string): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await studentsApi.update(studentId, { isActive: true });
        
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

    onSuccess: async (result, studentId, context) => {
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

      options?.onSuccess?.(result, studentId, context, queryClient);
    },

    onError: (error, studentId, context) => {
      console.error('Student reactivation failed:', {
        error: error.message,
        studentId,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, studentId, context, queryClient);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for transferring a student to a different nurse
 * 
 * @param options - Mutation options
 * @returns Mutation handlers for transfer
 */
export const useTransferStudent = (
  options?: UseMutationOptions<
    StudentMutationResult, 
    ApiError, 
    { id: string; data: TransferStudentRequest }
  >
) => {
  const queryClient = useQueryClient();
  const config = cacheConfig.mutations || { retry: 3 };

  return useMutation({
    mutationFn: async ({ id, data }): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await studentsApi.update(id, { nurseId: data.nurseId });
        
        return {
          success: true,
          student: updatedStudent,
          message: `Student ${updatedStudent.firstName} ${updatedStudent.lastName} transferred successfully`,
          auditId: `transfer_${Date.now()}_${id}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: error.context || 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result, { id, data }, context) => {
      if (result.student) {
        queryClient.setQueryData(studentQueryKeys.details.byId(id), result.student);
      }

      // Granular invalidation for nurse assignment change
      await invalidateStudentCache(
        queryClient,
        'update',
        id,
        context?.previousStudent,
        { nurseId: data.nurseId }
      );

      console.info('Student transferred:', {
        studentId: id,
        newNurseId: data.nurseId,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'TRANSFER_STUDENT',
      });

      options?.onSuccess?.(result, { id, data }, context, queryClient);
    },

    onError: (error, { id, data }, context) => {
      console.error('Student transfer failed:', {
        error: error.message,
        studentId: id,
        newNurseId: data.nurseId,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, { id, data }, context, queryClient);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for bulk updating multiple students
 * 
 * @param options - Mutation options
 * @returns Mutation handlers for bulk operations
 */
export const useBulkUpdateStudents = (
  options?: UseMutationOptions<BulkMutationResult, ApiError, BulkUpdateStudentsRequest>
) => {
  const queryClient = useQueryClient();
  const config = cacheConfig.mutations || { retry: 2 }; // Fewer retries for bulk operations

  return useMutation({
    mutationFn: async (request: BulkUpdateStudentsRequest): Promise<BulkMutationResult> => {
      try {
        // Process in batches to avoid overwhelming the server
        const batchSize = 10;
        const batches = [];
        
        for (let i = 0; i < request.studentIds.length; i += batchSize) {
          batches.push(request.studentIds.slice(i, i + batchSize));
        }

        const results = [];
        let successCount = 0;
        let failureCount = 0;

        for (const batch of batches) {
          const batchResults = await Promise.allSettled(
            batch.map(async (id) => {
              try {
                const student = await studentsApi.update(id, request.updateData);
                return { id, success: true, student };
              } catch (error: any) {
                return { id, success: false, error: error.message };
              }
            })
          );

          for (const result of batchResults) {
            if (result.status === 'fulfilled') {
              results.push(result.value);
              if (result.value.success) {
                successCount++;
              } else {
                failureCount++;
              }
            } else {
              results.push({ id: 'unknown', success: false, error: result.reason?.message });
              failureCount++;
            }
          }
        }

        return {
          success: successCount > 0,
          successCount,
          failureCount,
          results,
          auditId: `bulk_update_${Date.now()}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result, request, context) => {
      // For bulk updates, invalidate conservatively
      // This could be optimized further by tracking which specific lists are affected
      await invalidateStudentCache(
        queryClient,
        'update',
        undefined,
        undefined,
        request.updateData
      );

      console.info('Bulk student update completed:', {
        totalRequested: request.studentIds.length,
        successCount: result.successCount,
        failureCount: result.failureCount,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'BULK_UPDATE_STUDENTS',
      });

      options?.onSuccess?.(result, request, context, queryClient);
    },

    onError: (error, request, context) => {
      console.error('Bulk student update failed:', {
        error: error.message,
        totalRequested: request.studentIds.length,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, request, context, queryClient);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Hook for permanent deletion (HIPAA compliance - use with extreme caution)
 * 
 * This should only be used for legal compliance requirements (e.g., data purging)
 * and requires appropriate authorization levels.
 * 
 * @param options - Mutation options with enhanced authorization checks
 * @returns Mutation handlers for permanent deletion
 */
export const usePermanentDeleteStudent = (
  options?: UseMutationOptions<
    { success: boolean; message: string; auditId: string }, 
    ApiError, 
    { id: string; reason: string; authorization: string }
  >
) => {
  const queryClient = useQueryClient();
  const config = cacheConfig.mutations || { retry: 1 }; // Minimal retry for destructive operations

  return useMutation({
    mutationFn: async ({ id, reason, authorization }) => {
      try {
        // Verify authorization (this would be more robust in production)
        if (!authorization || authorization.length < 10) {
          throw Object.assign(new Error('Valid authorization code required for permanent deletion'), {
            context: 'authorization',
            auditRequired: true,
          });
        }

        await studentsApi.delete(id);
        
        return {
          success: true,
          message: 'Student permanently deleted from system',
          auditId: `permanent_delete_${Date.now()}_${id}`,
        };
      } catch (error: any) {
        throw Object.assign(error, {
          context: error.context || 'server',
          auditRequired: true,
        });
      }
    },

    onSuccess: async (result, { id, reason, authorization }, context) => {
      // Remove from all caches
      queryClient.removeQueries({ queryKey: studentQueryKeys.details.byId(id) });

      // Use DELETE operation for cache invalidation
      await invalidateStudentCache(
        queryClient,
        'delete',
        id,
        undefined,
        undefined
      );

      // Critical audit log for permanent deletion
      console.warn('PERMANENT STUDENT DELETION:', {
        studentId: id,
        reason,
        authorization: '[REDACTED]',
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'PERMANENT_DELETE_STUDENT',
        severity: 'CRITICAL',
      });

      options?.onSuccess?.(result, { id, reason, authorization }, context, queryClient);
    },

    onError: (error, { id, reason, authorization }, context) => {
      console.error('Permanent student deletion failed:', {
        error: error.message,
        studentId: id,
        reason,
        context: error.context,
        timestamp: new Date().toISOString(),
        severity: 'CRITICAL',
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, { id, reason, authorization }, context, queryClient);
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};

/**
 * Composite hook that provides all mutation operations
 * 
 * @returns Object containing all mutation hooks
 * 
 * @example
 * ```tsx
 * const {
 *   createStudent,
 *   updateStudent,
 *   deactivateStudent,
 *   transferStudent,
 *   bulkUpdate,
 *   isCreating,
 *   isUpdating,
 *   isTransferring
 * } = useStudentMutations();
 * ```
 */
export const useStudentMutations = () => {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deactivateStudent = useDeactivateStudent();
  const reactivateStudent = useReactivateStudent();
  const transferStudent = useTransferStudent();
  const bulkUpdate = useBulkUpdateStudents();
  const permanentDelete = usePermanentDeleteStudent();

  return {
    // Mutation hooks
    createStudent,
    updateStudent,
    deactivateStudent,
    reactivateStudent,
    transferStudent,
    bulkUpdate,
    permanentDelete,

    // Convenience mutation functions
    create: createStudent.mutate,
    update: updateStudent.mutate,
    deactivate: deactivateStudent.mutate,
    reactivate: reactivateStudent.mutate,
    transfer: transferStudent.mutate,
    bulkUpdateStudents: bulkUpdate.mutate,
    deleteStudentPermanently: permanentDelete.mutate,

    // Async versions
    createAsync: createStudent.mutateAsync,
    updateAsync: updateStudent.mutateAsync,
    deactivateAsync: deactivateStudent.mutateAsync,
    reactivateAsync: reactivateStudent.mutateAsync,
    transferAsync: transferStudent.mutateAsync,
    bulkUpdateAsync: bulkUpdate.mutateAsync,
    deleteStudentPermanentlyAsync: permanentDelete.mutateAsync,

    // Loading states
    isCreating: createStudent.isPending,
    isUpdating: updateStudent.isPending,
    isDeactivating: deactivateStudent.isPending,
    isReactivating: reactivateStudent.isPending,
    isTransferring: transferStudent.isPending,
    isBulkUpdating: bulkUpdate.isPending,
    isDeleting: permanentDelete.isPending,

    // Any mutation in progress
    isMutating: createStudent.isPending || 
                updateStudent.isPending || 
                deactivateStudent.isPending || 
                reactivateStudent.isPending || 
                transferStudent.isPending || 
                bulkUpdate.isPending || 
                permanentDelete.isPending,

    // Error states
    createError: createStudent.error,
    updateError: updateStudent.error,
    deactivateError: deactivateStudent.error,
    reactivateError: reactivateStudent.error,
    transferError: transferStudent.error,
    bulkUpdateError: bulkUpdate.error,
    deleteError: permanentDelete.error,

    // Success states
    createSuccess: createStudent.isSuccess,
    updateSuccess: updateStudent.isSuccess,
    deactivateSuccess: deactivateStudent.isSuccess,
    reactivateSuccess: reactivateStudent.isSuccess,
    transferSuccess: transferStudent.isSuccess,
    bulkUpdateSuccess: bulkUpdate.isSuccess,
    deleteSuccess: permanentDelete.isSuccess,

    // Reset functions
    resetCreate: createStudent.reset,
    resetUpdate: updateStudent.reset,
    resetDeactivate: deactivateStudent.reset,
    resetReactivate: reactivateStudent.reset,
    resetTransfer: transferStudent.reset,
    resetBulkUpdate: bulkUpdate.reset,
    resetDelete: permanentDelete.reset,

    // Reset all mutations
    resetAll: useCallback(() => {
      createStudent.reset();
      updateStudent.reset();
      deactivateStudent.reset();
      reactivateStudent.reset();
      transferStudent.reset();
      bulkUpdate.reset();
      permanentDelete.reset();
    }, [
      createStudent.reset,
      updateStudent.reset,
      deactivateStudent.reset,
      reactivateStudent.reset,
      transferStudent.reset,
      bulkUpdate.reset,
      permanentDelete.reset,
    ]),
  };
};

/**
 * Export all mutation hooks
 */
export default {
  useCreateStudent,
  useUpdateStudent,
  useDeactivateStudent,
  useReactivateStudent,
  useTransferStudent,
  useBulkUpdateStudents,
  usePermanentDeleteStudent,
  useStudentMutations,
};








