/**
 * Composite Student Mutation Hook
 *
 * Provides all student mutation operations in a single hook
 *
 * @module hooks/students/mutations/useStudentMutationsComposite
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useCallback } from 'react';
import { useCreateStudent, useUpdateStudent } from './useStudentCRUDMutations';
import { useDeactivateStudent, useReactivateStudent } from './useStudentStatusMutations';
import { useTransferStudent } from './useStudentTransferMutations';
import { useBulkUpdateStudents } from './useStudentBulkMutations';
import { usePermanentDeleteStudent } from './useStudentDeleteMutations';

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
 * } = useStudentMutationsComposite();
 * ```
 */
export const useStudentMutationsComposite = () => {
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
