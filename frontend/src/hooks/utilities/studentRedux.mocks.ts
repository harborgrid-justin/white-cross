/**
 * Mock Redux Selectors and Actions
 *
 * Mock implementations of Redux selectors and actions for student management.
 * In a real application, these would be imported from your Redux store.
 *
 * @module hooks/students/redux/mocks
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import type { StudentUIState, StudentUIActions } from './studentRedux.types';

/**
 * Mock Redux selectors
 * In a real application, these would be imported from your Redux store
 */
export const mockSelectors = {
  selectStudentUIState: (state: any): StudentUIState => ({
    selectedStudentIds: [],
    lastSelectedId: null,
    isSelectionMode: false,
    showInactiveStudents: false,
    viewMode: 'list' as const,
    sortPreference: { field: 'lastName', direction: 'asc' as const },
    appliedFilters: {},
    isCreateModalOpen: false,
    isEditModalOpen: false,
    editingStudentId: null,
    bulkOperationMode: false,
    selectedForBulkOperation: [],
    recentlyViewedIds: [],
    recentSearchQueries: [],
  }),
  selectSelectedStudentIds: (state: any): string[] => [],
  selectIsSelectionMode: (state: any): boolean => false,
  selectViewMode: (state: any): 'list' | 'grid' | 'table' => 'list',
  selectAppliedFilters: (state: any): Record<string, any> => ({}),
};

/**
 * Mock Redux actions
 * In a real application, these would be imported from your Redux store
 */
export const mockActions: StudentUIActions = {
  selectStudent: () => {},
  selectMultipleStudents: () => {},
  deselectStudent: () => {},
  clearSelection: () => {},
  toggleSelection: () => {},
  setSelectionMode: () => {},
  setShowInactiveStudents: () => {},
  setViewMode: () => {},
  setSortPreference: () => {},
  setFilters: () => {},
  clearFilters: () => {},
  openCreateModal: () => {},
  closeCreateModal: () => {},
  openEditModal: () => {},
  closeEditModal: () => {},
  enterBulkMode: () => {},
  exitBulkMode: () => {},
  selectForBulkOperation: () => {},
  addToRecentlyViewed: () => {},
  addToRecentSearches: () => {},
};
