/**
 * Student Create Mutation
 *
 * @module hooks/domains/students/mutations/useCreateStudentMutation
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
  CreateStudentData
} from '@/types/student.types';

export interface CreateStudentMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface CreateStudentMutationResult {
  mutate: (data: CreateStudentData) => void;
  mutateAsync: (data: CreateStudentData) => Promise<Student>;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
}

/**
 * Hook for creating students with PHI compliance
 */
export function useCreateStudentMutation(
  options: CreateStudentMutationOptions = {}
): CreateStudentMutationResult {
  const queryClient = useQueryClient();
  const { handleApiError } = useApiError();
  const { logCompliantAccess } = useHealthcareCompliance();

  const mutation = useMutation({
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

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
