/**
 * Redux Type Definitions for Student Management
 *
 * Type definitions for Redux state shape, actions, and UI state
 * for student management features.
 *
 * @module hooks/students/redux/types
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

/**
 * Redux state shape for student UI state
 * This would typically be defined in your Redux store structure
 */
export interface StudentUIState {
  // Selection state
  selectedStudentIds: string[];
  lastSelectedId: string | null;

  // UI state
  isSelectionMode: boolean;
  showInactiveStudents: boolean;

  // View preferences
  viewMode: 'list' | 'grid' | 'table';
  sortPreference: {
    field: string;
    direction: 'asc' | 'desc';
  };

  // Filters applied in UI
  appliedFilters: Record<string, any>;

  // Modal and form state
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  editingStudentId: string | null;

  // Bulk operations
  bulkOperationMode: boolean;
  selectedForBulkOperation: string[];

  // Recent interactions
  recentlyViewedIds: string[];
  recentSearchQueries: string[];
}

/**
 * Redux actions for student UI state
 * These would typically be defined in your Redux slice
 */
export interface StudentUIActions {
  // Selection actions
  selectStudent: (id: string) => void;
  selectMultipleStudents: (ids: string[]) => void;
  deselectStudent: (id: string) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;

  // UI state actions
  setSelectionMode: (enabled: boolean) => void;
  setShowInactiveStudents: (show: boolean) => void;
  setViewMode: (mode: 'list' | 'grid' | 'table') => void;
  setSortPreference: (field: string, direction: 'asc' | 'desc') => void;

  // Filter actions
  setFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (studentId: string) => void;
  closeEditModal: () => void;

  // Bulk operation actions
  enterBulkMode: () => void;
  exitBulkMode: () => void;
  selectForBulkOperation: (ids: string[]) => void;

  // Recent items actions
  addToRecentlyViewed: (id: string) => void;
  addToRecentSearches: (query: string) => void;
}
