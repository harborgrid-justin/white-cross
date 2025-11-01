/**
 * Optimistic Students Hook
 * Provides optimistic UI updates for student operations
 */

'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Student } from '@/types/student.types';

export function useOptimisticStudents() {
  const queryClient = useQueryClient();

  const createStudent = useMutation({
    mutationFn: async (data: Partial<Student>) => {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create student');
      return response.json();
    },
    onMutate: async (newStudent) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);
      queryClient.setQueryData(['students'], (old: any) => ({
        ...old,
        students: [...(old?.students || []), { ...newStudent, id: 'temp-' + Date.now() }],
      }));
      return { previousStudents };
    },
    onError: (_err, _newStudent, context) => {
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Student> }) => {
      const response = await fetch(`/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update student');
      return response.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['students', id] });
      const previousStudent = queryClient.getQueryData(['students', id]);
      queryClient.setQueryData(['students', id], (old: any) => ({ ...old, ...data }));
      return { previousStudent };
    },
    onError: (_err, variables, context) => {
      queryClient.setQueryData(['students', variables.id], context?.previousStudent);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete student');
      return response.json();
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['students'] });
      const previousStudents = queryClient.getQueryData(['students']);
      queryClient.setQueryData(['students'], (old: any) => ({
        ...old,
        students: old?.students?.filter((s: Student) => s.id !== id) || [],
      }));
      return { previousStudents };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['students'], context?.previousStudents);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    createStudent,
    updateStudent,
    deleteStudent,
  };
}
