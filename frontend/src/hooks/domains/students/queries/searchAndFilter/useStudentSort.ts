/**
 * Student Sorting Hook
 *
 * Client-side sorting functionality for student data with multiple sort criteria.
 * Provides flexible sorting with support for computed fields and custom sort logic.
 *
 * @module hooks/students/searchAndFilter/useStudentSort
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useMemo, useCallback, useState } from 'react';
import type { Student } from '@/types/student.types';
import type { SortOption } from './searchFilterTypes';
import { SORT_OPTIONS } from './searchFilterTypes';

/**
 * Hook for sorting students with multiple criteria
 *
 * @param students - Array of students to sort
 * @param initialSort - Initial sort option
 * @returns Sorted students and sort controls
 *
 * @example
 * ```tsx
 * const {
 *   sortedStudents,
 *   sortBy,
 *   updateSort,
 *   toggleDirection
 * } = useStudentSorting(students, {
 *   field: 'lastName',
 *   direction: 'asc',
 *   label: 'Last Name (A-Z)'
 * });
 * ```
 */
export const useStudentSorting = (
  students: Student[],
  initialSort?: SortOption
) => {
  const [sortBy, setSortBy] = useState<SortOption>(
    initialSort || SORT_OPTIONS[0]
  );

  const sortedStudents = useMemo(() => {
    if (!students.length) return [];

    return [...students].sort((a, b) => {
      const { field, direction } = sortBy;
      let aValue: any;
      let bValue: any;

      // Handle special computed fields
      switch (field) {
        case 'fullName':
          aValue = `${a.lastName}, ${a.firstName}`;
          bValue = `${b.lastName}, ${b.firstName}`;
          break;
        case 'enrollmentDate':
          aValue = a.enrollmentDate ? new Date(a.enrollmentDate) : new Date(0);
          bValue = b.enrollmentDate ? new Date(b.enrollmentDate) : new Date(0);
          break;
        default:
          aValue = a[field as keyof Student];
          bValue = b[field as keyof Student];
      }

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return direction === 'asc' ? 1 : -1;
      if (bValue == null) return direction === 'asc' ? -1 : 1;

      // Convert to strings for comparison if needed
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      else if (aValue > bValue) comparison = 1;

      return direction === 'desc' ? -comparison : comparison;
    });
  }, [students, sortBy]);

  const updateSort = useCallback((newSort: SortOption) => {
    setSortBy(newSort);
  }, []);

  const toggleDirection = useCallback(() => {
    setSortBy(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    sortedStudents,
    sortBy,
    updateSort,
    toggleDirection,
    sortOptions: SORT_OPTIONS,
  };
};
