/**
 * WF-COMP-147 | studentQueryTypes.ts - TypeScript types and interfaces
 * Purpose: Type definitions for student query hooks
 * Upstream: @/types/student.types
 * Downstream: Student query hooks
 * Exports: Hook return types and interfaces
 * Last Updated: 2025-11-04
 * File Type: .ts
 */

import type {
  Student,
  StudentFilters,
  PaginatedStudentsResponse,
} from '@/types/student.types';
import type { StudentUIState } from '@/stores/slices/students';

// =====================
// RETURN TYPES
// =====================

/**
 * Return type for useStudents hook with enhanced data access
 */
export interface UseStudentsReturn {
  /** Paginated student data */
  data: PaginatedStudentsResponse | undefined;
  /** Array of students for convenience */
  students: Student[];
  /** Pagination metadata */
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching (including background refetch) */
  isFetching: boolean;
  /** Is initial load */
  isInitialLoading: boolean;
  /** Manual refetch function */
  refetch: () => void;

  // Redux UI state and actions
  /** Selected student IDs */
  selectedStudentIds: string[];
  /** Currently selected students */
  selectedStudents: Student[];
  /** View mode (grid, list, table) */
  viewMode: StudentUIState['viewMode'];
  /** Current filters */
  filters: StudentFilters;
  /** Search query */
  searchQuery: string;
  /** Sort configuration */
  sortConfig: { sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] };
  /** Pagination info */
  paginationInfo: any;
  /** Bulk select mode */
  isBulkSelectMode: boolean;
  /** Expanded card IDs */
  expandedCardIds: string[];

  // UI Actions
  /** Select a student */
  selectStudent: (id: string) => void;
  /** Deselect a student */
  deselectStudent: (id: string) => void;
  /** Select multiple students */
  selectMultipleStudents: (ids: string[]) => void;
  /** Select all students */
  selectAllStudents: (ids: string[]) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Toggle bulk select mode */
  toggleBulkSelectMode: () => void;
  /** Set view mode */
  setViewMode: (mode: StudentUIState['viewMode']) => void;
  /** Set filters */
  setFilters: (filters: Partial<StudentFilters>) => void;
  /** Clear filters */
  clearFilters: () => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Set sorting */
  setSorting: (config: { sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] }) => void;
  /** Set page */
  setPage: (page: number) => void;
  /** Set page size */
  setPageSize: (size: number) => void;
  /** Toggle card expansion */
  toggleCardExpansion: (id: string) => void;
}

/**
 * Return type for useStudentDetail hook
 */
export interface UseStudentDetailReturn {
  /** Student data */
  student: Student | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching */
  isFetching: boolean;
  /** Manual refetch function */
  refetch: () => void;
}

/**
 * Return type for useStudentSearch hook
 */
export interface UseStudentSearchReturn {
  /** Search results */
  students: Student[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Is fetching */
  isFetching: boolean;
}

/**
 * Statistics data structure
 */
export interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  byGrade: Record<string, number>;
  bySchool?: Record<string, number>;
  recentEnrollments: number;
}

/**
 * Return type for useAssignedStudents hook
 */
export interface UseAssignedStudentsReturn {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
}

/**
 * Return type for useStudentStats hook
 */
export interface UseStudentStatsReturn {
  stats: StudentStats | undefined;
  isLoading: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
}

// =====================
// BACKWARD COMPATIBILITY
// =====================

/**
 * @deprecated Use useStudents instead
 * Maintained for backward compatibility
 */
export interface UseStudentsReturn_Legacy {
  students: Student[];
  isLoading: boolean;
  error: Error | null;
}
