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

import { useMemo } from 'react';
import { useCreateStudentMutation } from './useCreateStudentMutation';
import { useUpdateStudentMutation } from './useUpdateStudentMutation';
import { useDeleteStudentMutation } from './useDeleteStudentMutation';
import { useStudentMutationUtils } from './useStudentMutationUtils';
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
  const createStudent = useCreateStudentMutation(options);
  const updateStudent = useUpdateStudentMutation(options);
  const deleteStudent = useDeleteStudentMutation(options);
  const {
    invalidateStudentData,
    optimisticallyUpdateStudent,
    rollbackOptimisticUpdate,
  } = useStudentMutationUtils();

  // Return mutation operations with consistent interface
  return useMemo(
    () => ({
      createStudent,
      updateStudent,
      deleteStudent,
      invalidateStudentData,
      optimisticallyUpdateStudent,
      rollbackOptimisticUpdate,
    }),
    [
      createStudent,
      updateStudent,
      deleteStudent,
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

// Re-export types and sub-hooks
export type {
  CreateStudentMutationOptions,
  CreateStudentMutationResult
} from './useCreateStudentMutation';
export type {
  UpdateStudentMutationOptions,
  UpdateStudentMutationResult
} from './useUpdateStudentMutation';
export type {
  DeleteStudentMutationOptions,
  DeleteStudentMutationResult
} from './useDeleteStudentMutation';

export { useCreateStudentMutation } from './useCreateStudentMutation';
export { useUpdateStudentMutation } from './useUpdateStudentMutation';
export { useDeleteStudentMutation } from './useDeleteStudentMutation';
export { useStudentMutationUtils } from './useStudentMutationUtils';
