/**
 * Student Update Mutation
 *
 * @module hooks/domains/students/mutations/useUpdateStudentMutation
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
import type {
  Student,
  UpdateStudentData
} from '@/types/student.types';

export interface UpdateStudentMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  enableOptimisticUpdates?: boolean;
}

export interface UpdateStudentMutationResult {
  mutate: (data: { id: string; student: UpdateStudentData }) => void;
  mutateAsync: (data: { id: string; student: UpdateStudentData }) => Promise<Student>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Hook for updating students with PHI compliance and optimistic updates
 */
export function useUpdateStudentMutation(
  options: UpdateStudentMutationOptions = {}
): UpdateStudentMutationResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  const mutation = useMutation({
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

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
