/**
 * WF-COMP-243 | useStudentsData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useMemo
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * useStudentsData Hook
 *
 * Manages student data filtering, sorting, and pagination
 *
 * @module hooks/useStudentsData
 */

import { useMemo } from 'react';
import type { Student, StudentFiltersForm, StudentSortColumn } from '../types';

interface UseStudentsDataParams {
  students: Student[];
  filters: StudentFiltersForm;
  sortColumn: StudentSortColumn | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

/**
 * Custom hook for managing student data with filtering, sorting, and pagination
 */
export function useStudentsData({
  students,
  filters,
  sortColumn,
  sortDirection,
  page,
  pageSize,
}: UseStudentsDataParams) {
  /**
   * Apply filters to student list
   */
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.firstName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        student.studentNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesGrade = !filters.gradeFilter || student.grade === filters.gradeFilter;

      const matchesGender = !filters.genderFilter || student.gender === filters.genderFilter;

      const matchesStatus =
        !filters.statusFilter ||
        (filters.statusFilter === 'active' && student.isActive) ||
        (filters.statusFilter === 'inactive' && !student.isActive);

      const matchesArchived = filters.showArchived ? !student.isActive : student.isActive;

      return matchesSearch && matchesGrade && matchesGender && matchesStatus && matchesArchived;
    });
  }, [students, filters]);

  /**
   * Apply sorting to filtered students
   */
  const sortedStudents = useMemo(() => {
    if (!sortColumn) return filteredStudents;

    return [...filteredStudents].sort((a, b) => {
      let valueA: any = a[sortColumn];
      let valueB: any = b[sortColumn];

      // Handle different data types
      if (sortColumn === 'grade') {
        valueA = parseInt(valueA) || 0;
        valueB = parseInt(valueB) || 0;
      } else if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortColumn, sortDirection]);

  /**
   * Apply pagination
   */
  const paginatedStudents = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedStudents.slice(startIndex, endIndex);
  }, [sortedStudents, page, pageSize]);

  /**
   * Calculate pagination metadata
   */
  const totalPages = Math.ceil(sortedStudents.length / pageSize);
  const totalCount = sortedStudents.length;

  return {
    filteredStudents: sortedStudents,
    paginatedStudents,
    totalPages,
    totalCount,
  };
}
