/**
 * WF-COMP-147 | useStudentMutations.ts - Student mutation hooks
 * Purpose: Mutation hooks for creating, updating, and deleting students
 * Upstream: @tanstack/react-query, @/services, Redux store
 * Downstream: Student forms, management components
 * Exports: useCreateStudent, useUpdateStudent, useDeleteStudent, useBulkImportStudents, useExportStudents
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiActions } from '@/lib/api';
import type {
  CreateStudentData,
  UpdateStudentData,
} from '@/types/student.types';
import { useAppDispatch } from '@/stores/hooks';
import { studentsActions } from '@/stores/slices/students';
import { studentKeys } from './studentQueryKeys';

// =====================
// MUTATION HOOKS
// =====================

/**
 * Hook for creating a new student.
 *
 * IMPORTANT: No optimistic updates for healthcare data - ensures data integrity.
 * Invalidates student list cache on success.
 *
 * @returns Mutation handlers for student creation
 *
 * @example
 * ```tsx
 * const createStudent = useCreateStudent();
 *
 * const handleSubmit = async (data: CreateStudentData) => {
 *   try {
 *     const newStudent = await createStudent.mutateAsync(data);
 *     toast.success('Student created successfully');
 *     navigate(`/students/${newStudent.id}`);
 *   } catch (error) {
 *     toast.error('Failed to create student');
 *   }
 * };
 * ```
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: CreateStudentData) => apiActions.students.create(data),
    onSuccess: (newStudent) => {
      // Invalidate all student list queries to refetch with new student
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Optionally pre-populate the detail cache with the new student
      queryClient.setQueryData(studentKeys.detail(newStudent.id), newStudent);

      // Also invalidate stats if they exist
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });

      // Update Redux store
      dispatch(studentsActions.addOne(newStudent));
    },
    onError: (error: Error) => {
      // Healthcare data errors should be logged for audit
      console.error('Failed to create student:', error);
    },
  });
};

/**
 * Hook for updating an existing student.
 *
 * IMPORTANT: No optimistic updates for healthcare data.
 * Invalidates both list and detail caches on success.
 *
 * @returns Mutation handlers for student updates
 *
 * @example
 * ```tsx
 * const updateStudent = useUpdateStudent();
 *
 * const handleUpdate = async (id: string, data: UpdateStudentData) => {
 *   try {
 *     await updateStudent.mutateAsync({ id, data });
 *     toast.success('Student updated successfully');
 *   } catch (error) {
 *     toast.error('Failed to update student');
 *   }
 * };
 * ```
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentData }) =>
      apiActions.students.update(id, data),
    onSuccess: (updatedStudent, variables) => {
      // Invalidate the specific student detail query
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(variables.id) });

      // Invalidate all list queries as the update might affect filtering/sorting
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Invalidate assigned students if this might affect assignment
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });

      // Update Redux store
      dispatch(studentsActions.updateOne({ id: variables.id, changes: updatedStudent }));
    },
    onError: (error: Error) => {
      console.error('Failed to update student:', error);
    },
  });
};

/**
 * Hook for deleting a student.
 *
 * IMPORTANT: Student deletion is a critical operation.
 * Consider implementing soft delete (isActive flag) instead of hard delete.
 *
 * @returns Mutation handlers for student deletion
 *
 * @example
 * ```tsx
 * const deleteStudent = useDeleteStudent();
 *
 * const handleDelete = async (id: string) => {
 *   if (!confirm('Are you sure you want to delete this student?')) return;
 *
 *   try {
 *     await deleteStudent.mutateAsync(id);
 *     toast.success('Student deleted successfully');
 *     navigate('/students');
 *   } catch (error) {
 *     toast.error('Failed to delete student');
 *   }
 * };
 * ```
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiActions.students.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from detail cache
      queryClient.removeQueries({ queryKey: studentKeys.detail(deletedId) });

      // Invalidate all list queries
      queryClient.invalidateQueries({ queryKey: studentKeys.lists() });

      // Invalidate assigned students
      queryClient.invalidateQueries({ queryKey: studentKeys.assigned() });

      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: studentKeys.stats() });
    },
    onError: (error: Error) => {
      console.error('Failed to delete student:', error);
    },
  });
};

/**
 * Hook for bulk importing students.
 *
 * @returns Mutation handlers for bulk student import
 *
 * @example
 * ```tsx
 * const bulkImport = useBulkImportStudents();
 *
 * const handleImport = async (students: CreateStudentData[]) => {
 *   try {
 *     const result = await bulkImport.mutateAsync(students);
 *     toast.success(`Imported ${result.success} students. ${result.failed} failed.`);
 *   } catch (error) {
 *     toast.error('Bulk import failed');
 *   }
 * };
 * ```
 */
export const useBulkImportStudents = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (students: CreateStudentData[]) => {
      // Since bulkImport might not exist, we'll process them individually
      const results = await Promise.allSettled(
        students.map(student => apiActions.students.create(student))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return { success: successful, failed, total: students.length };
    },
    onSuccess: () => {
      // Invalidate all student queries as bulk import affects everything
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
    onError: (error: Error) => {
      console.error('Bulk import failed:', error);
    },
  });
};

/**
 * Hook for exporting student data.
 *
 * @returns Mutation handlers for student export
 *
 * @example
 * ```tsx
 * const exportStudents = useExportStudents();
 *
 * const handleExport = async (studentId: string) => {
 *   try {
 *     const exportData = await exportStudents.mutateAsync(studentId);
 *     // Process export data
 *     console.log('Export successful:', exportData);
 *   } catch (error) {
 *     toast.error('Export failed');
 *   }
 * };
 * ```
 */
export const useExportStudents = () => {
  return useMutation({
    mutationFn: (studentId: string) =>
      apiActions.students.exportStudentData(studentId),
    onError: (error: Error) => {
      console.error('Export failed:', error);
    },
  });
};
