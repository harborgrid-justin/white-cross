/**
 * Student Composite Hook - Convenience Hooks
 *
 * Specialized convenience hooks for common use cases
 *
 * @module hooks/domains/students/useStudents.convenience
 * @author White Cross Healthcare Platform
 * @version 3.0.0
 */

import { useCallback } from 'react';
import { useStudents } from './useStudents.operations';
import type { StudentListFilters } from './config';

/**
 * Convenience hook for student list operations
 */
export function useStudentList(filters?: StudentListFilters) {
  const { students } = useStudents({ defaultFilters: filters });
  return students;
}

/**
 * Convenience hook for CRUD operations
 */
export function useStudentCrud() {
  const { createStudent, updateStudent, deleteStudent } = useStudents({
    enableOptimisticUpdates: true,
  });

  return {
    createStudent,
    updateStudent,
    deleteStudent,
  };
}

/**
 * Convenience hook for student search
 */
export function useStudentSearch(initialQuery = '') {
  const { searchStudents } = useStudents({ debounceSearch: 300 });

  return useCallback((query: string) => {
    return searchStudents(query || initialQuery);
  }, [searchStudents, initialQuery]);
}
