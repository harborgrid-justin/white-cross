/**
 * @module stores/slices/students/types
 *
 * Type Definitions for Students Redux Slice
 *
 * Defines all TypeScript interfaces and types used throughout the students
 * slice for type-safe state management, API integration, and UI state control.
 *
 * @since 1.0.0
 */

import { Student, StudentFilters as StudentFiltersType } from '@/types/student.types';

// Re-export StudentFilters type for external use
export type { StudentFiltersType as StudentFilters };

/**
 * UI state interface for student management views.
 *
 * Manages view preferences, selection state, filters, sorting, and pagination
 * for student list/grid/table views. This state is separate from entity data
 * to enable flexible UI state management without polluting entity state.
 *
 * @interface StudentUIState
 *
 * @property {string[]} selectedIds - IDs of currently selected students (for bulk operations)
 * @property {'grid' | 'list' | 'table'} viewMode - Current view mode for student display
 * @property {StudentFiltersType} filters - Active filter criteria (grade, nurse, allergies, etc.)
 * @property {'name' | 'grade' | 'enrollmentDate' | 'lastVisit'} sortBy - Field to sort students by
 * @property {'asc' | 'desc'} sortOrder - Sort direction (ascending/descending)
 * @property {string} searchQuery - Text search query for filtering students
 * @property {boolean} showInactive - Whether to show inactive students in lists
 * @property {boolean} bulkSelectMode - Whether bulk selection mode is active
 * @property {string[]} expandedCards - IDs of expanded student cards (in card view)
 * @property {number} pageSize - Number of students per page (default: 20)
 * @property {number} currentPage - Current page number (1-indexed)
 *
 * @remarks
 * **Persistence:** This UI state is persisted to localStorage (non-PHI data only)
 * to preserve user preferences across sessions. Entity data is NOT persisted due
 * to HIPAA requirements.
 *
 * **Selection Management:** Supports individual selection, multi-select with Ctrl/Cmd,
 * and bulk select mode for mass operations like printing reports or generating letters.
 *
 * **Performance:** Pagination reduces DOM size and rendering time for large student
 * populations. Filters are applied client-side for instant feedback, with server-side
 * filtering available for very large datasets.
 */
export interface StudentUIState {
  selectedIds: string[];
  viewMode: 'grid' | 'list' | 'table';
  filters: StudentFiltersType;
  sortBy: 'name' | 'grade' | 'enrollmentDate' | 'lastVisit';
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  showInactive: boolean;
  bulkSelectMode: boolean;
  expandedCards: string[];
  pageSize: number;
  currentPage: number;
}

/**
 * Combined state interface for students slice (entity + UI state).
 *
 * Merges normalized entity state from EntityAdapter with custom UI state
 * to provide comprehensive state management for student entities.
 *
 * @interface StudentsState
 *
 * @property {string[]} ids - Ordered array of student IDs (from EntityAdapter)
 * @property {Record<string, Student>} entities - Normalized student entities by ID
 * @property {StudentUIState} ui - UI state for views, filters, and interactions
 *
 * @remarks
 * **Entity Adapter:** The ids and entities properties are managed by Redux Toolkit's
 * EntityAdapter for efficient normalized state management with O(1) lookups.
 *
 * **Hybrid Approach:** Combines standardized entity management with custom UI state
 * for maximum flexibility while maintaining consistency with other entity slices.
 */
export interface StudentsState {
  // Entity state properties from EntityAdapter
  ids: string[];
  entities: Record<string, Student>;
  // UI state
  ui: StudentUIState;
}

/**
 * Root state interface for Redux store.
 *
 * Defines the shape of the Redux store with students slice. Other slices
 * should be added to this interface as the application grows.
 *
 * @interface RootState
 *
 * @property {StudentsState} students - Students slice state
 *
 * @remarks
 * **Type Safety:** This interface enables type-safe selector functions and
 * ensures proper typing throughout the Redux state tree.
 *
 * **Extension:** As new slices are added to the store, add their state
 * interfaces as properties to this RootState interface.
 */
export interface RootState {
  students: StudentsState;
  // Other slices would be added here as the application grows
}

/**
 * Pagination metadata interface.
 *
 * Provides comprehensive information about current pagination state including
 * navigation availability and display ranges.
 *
 * @interface PaginationInfo
 *
 * @property {number} totalStudents - Total count of filtered students
 * @property {number} currentPage - Current page number (1-indexed)
 * @property {number} pageSize - Number of students per page
 * @property {number} totalPages - Total number of pages available
 * @property {boolean} hasNextPage - Whether a next page exists
 * @property {boolean} hasPreviousPage - Whether a previous page exists
 * @property {number} startIndex - Starting student index for current page (1-based)
 * @property {number} endIndex - Ending student index for current page (inclusive)
 */
export interface PaginationInfo {
  totalStudents: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
}

/**
 * Sort configuration interface.
 *
 * Defines the current sorting state for student lists.
 *
 * @interface SortConfig
 *
 * @property {StudentUIState['sortBy']} sortBy - Field to sort by
 * @property {StudentUIState['sortOrder']} sortOrder - Sort direction
 */
export interface SortConfig {
  sortBy: StudentUIState['sortBy'];
  sortOrder: StudentUIState['sortOrder'];
}

/**
 * Pagination configuration interface.
 *
 * Defines the current pagination settings.
 *
 * @interface PaginationConfig
 *
 * @property {number} currentPage - Current page number
 * @property {number} pageSize - Items per page
 */
export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
}
