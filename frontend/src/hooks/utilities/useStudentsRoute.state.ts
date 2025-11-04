/**
 * WF-ROUTE-001-STATE | useStudentsRoute.state.ts - State definitions
 * Purpose: State interfaces and defaults for Students route
 * Upstream: @/types | Dependencies: student.types
 * Downstream: useStudentsRoute | Called by: Students route hook
 * Related: useStudentsRoute
 * Exports: StudentsRouteState, defaultState | Key Features: State structure
 * Last Updated: 2025-11-04 | File Type: .ts
 * LLM Context: State management for student route
 */

import type {
  Student,
  StudentFilters,
  StudentSortColumn
} from '@/types/student.types';

/**
 * Students route state interface
 */
export interface StudentsRouteState {
  // View state
  selectedStudent: Student | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  showTransferModal: boolean;
  showDeleteModal: boolean;

  // Filter and pagination state
  filters: StudentFilters;
  sortColumn: StudentSortColumn | null;
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;

  // UI state
  loading: boolean;
  searchTerm: string;
}

/**
 * Default route state
 */
export const defaultState: StudentsRouteState = {
  selectedStudent: null,
  showCreateModal: false,
  showEditModal: false,
  showTransferModal: false,
  showDeleteModal: false,
  filters: {
    searchTerm: '',
    gradeFilter: '',
    genderFilter: undefined,
    statusFilter: '',
    showArchived: false,
  },
  sortColumn: null,
  sortDirection: 'asc',
  page: 1,
  pageSize: 20,
  loading: false,
  searchTerm: '',
};
