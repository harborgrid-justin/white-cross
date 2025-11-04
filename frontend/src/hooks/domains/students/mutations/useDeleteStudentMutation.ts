/**
 * Student Delete Mutation
 *
 * @module hooks/domains/students/mutations/useDeleteStudentMutation
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiActions } from '@/lib/api';
import { useApiError } from '@/hooks/shared/useApiError';
import { useHealthcareCompliance } from '@/hooks/shared/useHealthcareCompliance';
import {
  studentQueryKeys,
  STUDENT_OPERATIONS,
  STUDENT_ERROR_CODES,
  STUDENT_CACHE_CONFIG
} from '../config';
import type { Student } from '@/types/student.types';

export interface DeleteStudentMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enableOptimisticUpdates?: boolean;
}

export interface DeleteStudentMutationResult {
  mutate: (id: string) => void;
  mutateAsync: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Hook for deleting students with PHI compliance and optimistic updates
 */
export function useDeleteStudentMutation(
  options: DeleteStudentMutationOptions = {}
): DeleteStudentMutationResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  const mutation = useMutation({
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

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
