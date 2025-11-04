/**
 * WF-ROUTE-001-ACTIONS | useStudentsRoute.actions.ts - Action handlers
 * Purpose: Action handlers for student route interactions
 * Upstream: @/hooks | Dependencies: React, useRouteState
 * Downstream: useStudentsRoute | Called by: Students route hook
 * Related: useStudentsRoute
 * Exports: useStudentActions | Key Features: Modal controls, filters, pagination
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: Actions for student route
 */

import { useCallback } from 'react';
import { useRouteState } from '@/hooks/useRouteState';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Student, StudentFilters, StudentSortColumn } from '@/types/student.types';
import type { StudentsRouteState } from './useStudentsRoute.state';

export function useStudentActions(
  state: StudentsRouteState,
  setState: React.Dispatch<React.SetStateAction<StudentsRouteState>>,
  studentsQuery: UseQueryResult<any, Error>
) {
  // Persist certain state to URL/localStorage
  const { updateRouteState } = useRouteState('students', {
    page: state.page,
    pageSize: state.pageSize,
    filters: state.filters,
    sortColumn: state.sortColumn,
    sortDirection: state.sortDirection,
  });

  return {
    // Student selection
    selectStudent: useCallback((student: Student | null) => {
      setState(prev => ({ ...prev, selectedStudent: student }));
    }, [setState]),

    // Modal controls
    openCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: true }));
    }, [setState]),

    closeCreateModal: useCallback(() => {
      setState(prev => ({ ...prev, showCreateModal: false }));
    }, [setState]),

    openEditModal: useCallback((student: Student) => {
      setState(prev => ({ ...prev, selectedStudent: student, showEditModal: true }));
    }, [setState]),

    closeEditModal: useCallback(() => {
      setState(prev => ({ ...prev, showEditModal: false }));
    }, [setState]),

    openTransferModal: useCallback((student: Student) => {
      setState(prev => ({ ...prev, selectedStudent: student, showTransferModal: true }));
    }, [setState]),

    closeTransferModal: useCallback(() => {
      setState(prev => ({ ...prev, showTransferModal: false }));
    }, [setState]),

    openDeleteModal: useCallback((student: Student) => {
      setState(prev => ({ ...prev, selectedStudent: student, showDeleteModal: true }));
    }, [setState]),

    closeDeleteModal: useCallback(() => {
      setState(prev => ({ ...prev, showDeleteModal: false }));
    }, [setState]),

    // Filters and search
    updateFilters: useCallback((newFilters: Partial<StudentFilters>) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters },
        page: 1 // Reset to first page when filtering
      }));
      updateRouteState({ filters: { ...state.filters, ...newFilters }, page: 1 });
    }, [state.filters, updateRouteState, setState]),

    setSearchTerm: useCallback((searchTerm: string) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, searchTerm },
        page: 1
      }));
      updateRouteState({ filters: { ...state.filters, searchTerm }, page: 1 });
    }, [state.filters, updateRouteState, setState]),

    // Sorting
    updateSort: useCallback((column: StudentSortColumn) => {
      setState(prev => ({
        ...prev,
        sortColumn: column,
        sortDirection: prev.sortColumn === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      }));
    }, [setState]),

    // Pagination
    goToPage: useCallback((page: number) => {
      setState(prev => ({ ...prev, page }));
      updateRouteState({ page });
    }, [updateRouteState, setState]),

    setPageSize: useCallback((pageSize: number) => {
      setState(prev => ({ ...prev, pageSize, page: 1 }));
      updateRouteState({ pageSize, page: 1 });
    }, [updateRouteState, setState]),

    // Data refresh
    refetchStudents: useCallback(() => {
      studentsQuery.refetch();
    }, [studentsQuery]),
  };
}
