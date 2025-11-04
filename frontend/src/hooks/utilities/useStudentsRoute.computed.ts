/**
 * WF-ROUTE-001-COMPUTED | useStudentsRoute.computed.ts - Data transformations
 * Purpose: Computed values with filtering, sorting, pagination
 * Upstream: None | Dependencies: React
 * Downstream: useStudentsRoute | Called by: Students route hook
 * Related: useStudentsRoute
 * Exports: useStudentsData | Key Features: Memoized data transformations
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Computed values for student route
 */

import { useMemo } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import type { StudentsRouteState } from './useStudentsRoute.state';

/**
 * Students data with filtering, sorting, and pagination applied
 */
export function useStudentsData(
  studentsQuery: UseQueryResult<any, Error>,
  state: StudentsRouteState
) {
  return useMemo(() => {
    const students = studentsQuery.data?.data?.students || [];

    // Apply search filter
    let filtered = students.filter((student: any) => {
      const searchLower = state.filters.searchTerm.toLowerCase();
      return (
        student.firstName.toLowerCase().includes(searchLower) ||
        student.lastName.toLowerCase().includes(searchLower) ||
        student.studentNumber.toLowerCase().includes(searchLower)
      );
    });

    // Apply other filters
    if (state.filters.gradeFilter) {
      filtered = filtered.filter((s: any) => s.grade === state.filters.gradeFilter);
    }
    if (state.filters.genderFilter) {
      filtered = filtered.filter((s: any) => s.gender === state.filters.genderFilter);
    }
    if (state.filters.statusFilter) {
      filtered = filtered.filter((s: any) =>
        state.filters.statusFilter === 'active' ? s.isActive : !s.isActive
      );
    }
    if (!state.filters.showArchived) {
      filtered = filtered.filter((s: any) => s.isActive);
    }

    // Apply sorting
    if (state.sortColumn) {
      filtered.sort((a: any, b: any) => {
        const valueA = a[state.sortColumn!];
        const valueB = b[state.sortColumn!];

        let comparison = 0;
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          comparison = valueA.localeCompare(valueB);
        } else {
          comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        }

        return state.sortDirection === 'desc' ? -comparison : comparison;
      });
    }

    // Calculate pagination
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / state.pageSize);
    const startIndex = (state.page - 1) * state.pageSize;
    const paginatedStudents = filtered.slice(startIndex, startIndex + state.pageSize);

    return {
      allStudents: students,
      filteredStudents: filtered,
      paginatedStudents,
      totalCount,
      totalPages,
      currentPage: state.page,
      pageSize: state.pageSize,
    };
  }, [studentsQuery.data, state.filters, state.sortColumn, state.sortDirection, state.page, state.pageSize]);
}
