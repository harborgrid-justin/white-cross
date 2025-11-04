/**
 * Student Transfer Mutation Hooks
 *
 * Transfer operations for students between nurses
 *
 * @module hooks/students/mutations/useStudentTransferMutations
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
import type { TransferStudentRequest } from '@/types/student.types';
import { STUDENT_MUTATION_CONFIG } from './cacheConfig';
import { invalidateStudentCache } from './utils';
import type { ApiError, StudentMutationResult } from './types';

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
  const config = STUDENT_MUTATION_CONFIG.default;

  return useMutation({
    mutationFn: async ({ id, data }): Promise<StudentMutationResult> => {
      try {
        const updatedStudent = await apiActions.students.update(id, { nurseId: data.nurseId });

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

    onSuccess: async (result: StudentMutationResult, { id, data }: { id: string; data: TransferStudentRequest }) => {
      if (result.student) {
        queryClient.setQueryData(studentQueryKeys.details.byId(id), result.student);
      }

      // Granular invalidation for nurse assignment change
      await invalidateStudentCache(
        queryClient,
        'update',
        id,
        undefined,
        { nurseId: data.nurseId }
      );

      console.info('Student transferred:', {
        studentId: id,
        newNurseId: data.nurseId,
        auditId: result.auditId,
        timestamp: new Date().toISOString(),
        action: 'TRANSFER_STUDENT',
      });

      options?.onSuccess?.(result, { id, data });
    },

    onError: (error: ApiError, { id, data }: { id: string; data: TransferStudentRequest }) => {
      console.error('Student transfer failed:', {
        error: error.message,
        studentId: id,
        newNurseId: data.nurseId,
        timestamp: new Date().toISOString(),
        auditRequired: error.auditRequired,
      });

      options?.onError?.(error, { id, data });
    },

    retry: config.retry,
    retryDelay: config.retryDelay,
  });
};
