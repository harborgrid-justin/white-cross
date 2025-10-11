/**
 * Optimistic Student Management Hooks
 *
 * Custom TanStack Query mutation hooks with optimistic updates for
 * student CRUD operations with comprehensive error handling and rollback.
 *
 * @module useOptimisticStudents
 * @version 1.0.0
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { studentsApi } from '@/services/modules/studentsApi';
import type {
  Student,
  CreateStudentData,
  UpdateStudentData,
  TransferStudentRequest,
} from '@/types/student.types';
import {
  optimisticCreate,
  optimisticUpdate,
  optimisticDelete,
  confirmCreate,
  confirmUpdate,
  rollbackUpdate,
  generateTempId,
} from '@/utils/optimisticHelpers';
import {
  RollbackStrategy,
  ConflictResolutionStrategy,
} from '@/utils/optimisticUpdates';

// =====================
// QUERY KEYS
// =====================

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (filters?: any) => [...studentKeys.lists(), filters] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  byGrade: (grade: string) => [...studentKeys.all, 'grade', grade] as const,
  assigned: () => [...studentKeys.all, 'assigned'] as const,
  statistics: (id: string) => [...studentKeys.all, id, 'statistics'] as const,
  healthRecords: (id: string) => [...studentKeys.all, id, 'healthRecords'] as const,
};

// =====================
// STUDENT CREATE HOOK
// =====================

/**
 * Hook for creating students with optimistic updates
 *
 * @example
 * ```typescript
 * const createMutation = useOptimisticStudentCreate({
 *   onSuccess: (student) => console.log('Created:', student)
 * });
 *
 * createMutation.mutate({
 *   studentNumber: 'STU-2024-001',
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   dateOfBirth: '2010-05-15',
 *   grade: '8',
 *   gender: 'MALE',
 *   enrollmentDate: '2024-01-15'
 * });
 * ```
 */
export function useOptimisticStudentCreate(
  options?: UseMutationOptions<Student, Error, CreateStudentData>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentData) => studentsApi.create(data),

    onMutate: async (newStudent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.lists() });

      // Create optimistic update
      const { updateId, tempId, tempEntity } = optimisticCreate<Student>(
        queryClient,
        studentKeys.all,
        {
          ...newStudent,
          isActive: true,
          emergencyContacts: [],
        } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
          userId: newStudent.createdBy,
        }
      );

      return { updateId, tempId, tempEntity };
    },

    onSuccess: (response, variables, context) => {
      if (context) {
        // Replace temp ID with real server ID
        confirmCreate(
          queryClient,
          studentKeys.all,
          context.updateId,
          context.tempId,
          response
        );
      }

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      if (variables.grade) {
        queryClient.invalidateQueries({ queryKey: studentKeys.byGrade(variables.grade) });
      }
      if (variables.nurseId) {
        queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });
      }

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// STUDENT UPDATE HOOK
// =====================

/**
 * Hook for updating students with optimistic updates
 *
 * @example
 * ```typescript
 * const updateMutation = useOptimisticStudentUpdate({
 *   onSuccess: () => console.log('Updated successfully')
 * });
 *
 * updateMutation.mutate({
 *   id: 'student-123',
 *   data: { grade: '9', nurseId: 'nurse-456' }
 * });
 * ```
 */
export function useOptimisticStudentUpdate(
  options?: UseMutationOptions<
    Student,
    Error,
    { id: string; data: UpdateStudentData }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentsApi.update(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get previous student data for rollback
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic update
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        data as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
          conflictStrategy: ConflictResolutionStrategy.SERVER_WINS,
          userId: data.updatedBy,
        }
      );

      return { updateId, previousStudent };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        // Confirm with server data
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(variables.id), response);

      // Invalidate grade-specific queries if grade changed
      if (variables.data.grade && context?.previousStudent?.grade !== variables.data.grade) {
        if (context?.previousStudent?.grade) {
          queryClient.invalidateQueries({
            queryKey: studentKeys.byGrade(context.previousStudent.grade)
          });
        }
        queryClient.invalidateQueries({ queryKey: studentKeys.byGrade(variables.data.grade) });
      }

      // Invalidate assigned students if nurse changed
      if (variables.data.nurseId) {
        queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });
      }

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        // Rollback optimistic update
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// STUDENT DEACTIVATE HOOK
// =====================

/**
 * Hook for deactivating students (soft delete) with optimistic updates
 *
 * @example
 * ```typescript
 * const deactivateMutation = useOptimisticStudentDeactivate();
 * deactivateMutation.mutate('student-id');
 * ```
 */
export function useOptimisticStudentDeactivate(
  options?: UseMutationOptions<
    { success: boolean; message: string },
    Error,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.deactivate(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get previous student data
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic update to mark as inactive
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        { isActive: false } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, previousStudent };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId && context?.previousStudent) {
        // Confirm deactivation
        confirmUpdate(context.updateId, { ...context.previousStudent, isActive: false }, queryClient);
      }

      // Invalidate lists to remove from active lists
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Update detail cache
      const student = queryClient.getQueryData<Student>(studentKeys.detail(id));
      if (student) {
        queryClient.setQueryData(studentKeys.detail(id), { ...student, isActive: false });
      }

      // Invalidate assigned students
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      options?.onSuccess?.(response, id, context);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore active status
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, id, context);
    },
  });
}

// =====================
// STUDENT REACTIVATE HOOK
// =====================

/**
 * Hook for reactivating students with optimistic updates
 *
 * @example
 * ```typescript
 * const reactivateMutation = useOptimisticStudentReactivate();
 * reactivateMutation.mutate('student-id');
 * ```
 */
export function useOptimisticStudentReactivate(
  options?: UseMutationOptions<Student, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.reactivate(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Create optimistic update to mark as active
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        { isActive: true } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId) {
        // Confirm reactivation
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(id), response);
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      options?.onSuccess?.(response, id, context);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore inactive status
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, id, context);
    },
  });
}

// =====================
// STUDENT TRANSFER HOOK
// =====================

/**
 * Hook for transferring students to a different nurse with optimistic updates
 *
 * @example
 * ```typescript
 * const transferMutation = useOptimisticStudentTransfer();
 * transferMutation.mutate({
 *   id: 'student-123',
 *   data: { nurseId: 'nurse-456', reason: 'Caseload balancing' }
 * });
 * ```
 */
export function useOptimisticStudentTransfer(
  options?: UseMutationOptions<
    Student,
    Error,
    { id: string; data: TransferStudentRequest }
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentsApi.transfer(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get previous student data
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic update
      const updateId = optimisticUpdate<Student>(
        queryClient,
        studentKeys.all,
        id,
        { nurseId: data.nurseId } as any,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, previousStudent };
    },

    onSuccess: (response, variables, context) => {
      if (context?.updateId) {
        // Confirm transfer
        confirmUpdate(context.updateId, response, queryClient);
      }

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.setQueryData(studentKeys.detail(variables.id), response);

      // Invalidate assigned students for both old and new nurses
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      options?.onSuccess?.(response, variables, context);
    },

    onError: (error, variables, context) => {
      if (context?.updateId) {
        // Rollback transfer
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, variables, context);
    },
  });
}

// =====================
// STUDENT PERMANENT DELETE HOOK
// =====================

/**
 * Hook for permanently deleting students (use with extreme caution)
 * This is for HIPAA compliance and data purging only
 *
 * @example
 * ```typescript
 * const deleteMutation = useOptimisticStudentPermanentDelete();
 * deleteMutation.mutate('student-id');
 * ```
 */
export function useOptimisticStudentPermanentDelete(
  options?: UseMutationOptions<
    { success: boolean; message: string },
    Error,
    string
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => studentsApi.permanentDelete(id),

    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(id) });

      // Get student data for potential rollback
      const previousStudent = queryClient.getQueryData<Student>(studentKeys.detail(id));

      // Create optimistic delete
      const updateId = optimisticDelete<Student>(
        queryClient,
        studentKeys.all,
        id,
        {
          rollbackStrategy: RollbackStrategy.RESTORE_PREVIOUS,
        }
      );

      return { updateId, previousStudent };
    },

    onSuccess: (response, id, context) => {
      if (context?.updateId) {
        // Confirm deletion
        confirmUpdate(context.updateId, null as any, queryClient);
      }

      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      // Remove related data
      if (context?.previousStudent?.grade) {
        queryClient.invalidateQueries({
          queryKey: studentKeys.byGrade(context.previousStudent.grade)
        });
      }

      options?.onSuccess?.(response, id, context);
    },

    onError: (error, id, context) => {
      if (context?.updateId) {
        // Rollback - restore the deleted student
        rollbackUpdate(queryClient, context.updateId, {
          message: error.message,
          statusCode: (error as any).statusCode,
        });
      }

      options?.onError?.(error, id, context);
    },
  });
}

// =====================
// COMPOSITE HOOK
// =====================

/**
 * Composite hook that provides all student optimistic operations
 *
 * @example
 * ```typescript
 * const {
 *   createStudent,
 *   updateStudent,
 *   deactivateStudent,
 *   reactivateStudent,
 *   transferStudent,
 *   deleteStudent,
 *   isCreating,
 *   isUpdating,
 *   isDeleting
 * } = useOptimisticStudents();
 *
 * await createStudent.mutateAsync({ ... });
 * ```
 */
export function useOptimisticStudents() {
  const createStudent = useOptimisticStudentCreate();
  const updateStudent = useOptimisticStudentUpdate();
  const deactivateStudent = useOptimisticStudentDeactivate();
  const reactivateStudent = useOptimisticStudentReactivate();
  const transferStudent = useOptimisticStudentTransfer();
  const deleteStudent = useOptimisticStudentPermanentDelete();

  return {
    // Mutations
    createStudent,
    updateStudent,
    deactivateStudent,
    reactivateStudent,
    transferStudent,
    deleteStudent,

    // Convenience mutation functions
    createWithOptimism: createStudent.mutate,
    updateWithOptimism: updateStudent.mutate,
    deactivateWithOptimism: deactivateStudent.mutate,
    reactivateWithOptimism: reactivateStudent.mutate,
    transferWithOptimism: transferStudent.mutate,
    deleteWithOptimism: deleteStudent.mutate,

    // Loading states
    isCreating: createStudent.isPending,
    isUpdating: updateStudent.isPending,
    isDeactivating: deactivateStudent.isPending,
    isReactivating: reactivateStudent.isPending,
    isTransferring: transferStudent.isPending,
    isDeleting: deleteStudent.isPending,

    // Error states
    createError: createStudent.error,
    updateError: updateStudent.error,
    deactivateError: deactivateStudent.error,
    reactivateError: reactivateStudent.error,
    transferError: transferStudent.error,
    deleteError: deleteStudent.error,

    // Success flags
    createSuccess: createStudent.isSuccess,
    updateSuccess: updateStudent.isSuccess,
    deactivateSuccess: deactivateStudent.isSuccess,
    reactivateSuccess: reactivateStudent.isSuccess,
    transferSuccess: transferStudent.isSuccess,
    deleteSuccess: deleteStudent.isSuccess,

    // Reset functions
    resetCreate: createStudent.reset,
    resetUpdate: updateStudent.reset,
    resetDeactivate: deactivateStudent.reset,
    resetReactivate: reactivateStudent.reset,
    resetTransfer: transferStudent.reset,
    resetDelete: deleteStudent.reset,
  };
}
