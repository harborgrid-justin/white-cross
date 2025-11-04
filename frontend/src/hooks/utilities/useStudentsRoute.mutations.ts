/**
 * WF-ROUTE-001-MUTATIONS | useStudentsRoute.mutations.ts - Optimistic mutations
 * Purpose: Mutation hooks for student CRUD operations
 * Upstream: @/hooks | Dependencies: optimistic student hooks
 * Downstream: useStudentsRoute | Called by: Students route hook
 * Related: useStudentsRoute, useOptimisticStudents
 * Exports: useStudentMutations | Key Features: Optimistic updates with callbacks
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Mutations for student route
 */

import {
  useOptimisticStudentCreate,
  useOptimisticStudentUpdate,
  useOptimisticStudentDeactivate,
  useOptimisticStudentReactivate,
  useOptimisticStudentTransfer,
  useOptimisticStudentPermanentDelete,
} from '@/hooks/useOptimisticStudents';
import { useToast } from '@/hooks/useToast';
import type { Student } from '@/types/student.types';
import type { StudentsRouteState } from './useStudentsRoute.state';

export function useStudentMutations(
  setState: React.Dispatch<React.SetStateAction<StudentsRouteState>>
) {
  const { toast } = useToast();

  const createMutation = useOptimisticStudentCreate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} created successfully`);
      setState(prev => ({ ...prev, showCreateModal: false }));
    },
    onError: (error) => {
      toast.error(`Failed to create student: ${error.message}`);
    },
  });

  const updateMutation = useOptimisticStudentUpdate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} updated successfully`);
      setState(prev => ({ ...prev, showEditModal: false, selectedStudent: student }));
    },
    onError: (error) => {
      toast.error(`Failed to update student: ${error.message}`);
    },
  });

  const deactivateMutation = useOptimisticStudentDeactivate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} deactivated`);
      setState(prev => ({ ...prev, showDeleteModal: false, selectedStudent: null }));
    },
    onError: (error) => {
      toast.error(`Failed to deactivate student: ${error.message}`);
    },
  });

  const reactivateMutation = useOptimisticStudentReactivate({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} reactivated`);
    },
    onError: (error) => {
      toast.error(`Failed to reactivate student: ${error.message}`);
    },
  });

  const transferMutation = useOptimisticStudentTransfer({
    onSuccess: (student) => {
      toast.success(`Student ${student.firstName} ${student.lastName} transferred successfully`);
      setState(prev => ({ ...prev, showTransferModal: false, selectedStudent: null }));
    },
    onError: (error) => {
      toast.error(`Failed to transfer student: ${error.message}`);
    },
  });

  const deleteMutation = useOptimisticStudentPermanentDelete({
    onSuccess: () => {
      toast.success('Student permanently deleted');
      setState(prev => ({ ...prev, showDeleteModal: false, selectedStudent: null }));
    },
    onError: (error) => {
      toast.error(`Failed to delete student: ${error.message}`);
    },
  });

  return {
    createMutation,
    updateMutation,
    deactivateMutation,
    reactivateMutation,
    transferMutation,
    deleteMutation,
  };
}
