/**
 * @module stores/slices/students/view-reducers
 *
 * Students View Reducers
 *
 * Redux reducers for managing view-related state including filters, sorting,
 * pagination, search, and view mode preferences.
 *
 * @remarks
 * **Auto-Pagination Reset:** Most reducers automatically reset pagination to
 * page 1 when changing filters, search, or other data-affecting settings.
 *
 * @since 1.0.0
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { StudentUIState, StudentFilters } from './types';
import { initialUIState } from './ui-state-config';

/**
 * View reducer collection for student UI state.
 *
 * Contains all reducers related to viewing, filtering, sorting, and
 * paginating student data.
 */
export const viewReducers = {
  /**
   * Sets the view mode for student display.
   *
   * @param state - Current UI state
   * @param action - Action with view mode payload
   *
   * @remarks
   * **Persistence:** View mode preference should be persisted to localStorage.
   *
   * **View Modes:**
   * - **Grid:** Card-based layout with photos, best for visual browsing
   * - **List:** Compact list with key info, good for quick scanning
   * - **Table:** Data-dense table with all fields, best for data entry/editing
   */
  setViewMode: (state: StudentUIState, action: PayloadAction<'grid' | 'list' | 'table'>) => {
    state.viewMode = action.payload;
  },

  /**
   * Sets filter criteria for students.
   *
   * @param state - Current UI state
   * @param action - Action with filter criteria
   *
   * @remarks
   * **Pagination Reset:** Automatically resets to page 1 when filters change to ensure
   * user sees the beginning of the newly filtered results.
   *
   * **Merge Behavior:** Merges with existing filters, allowing partial filter updates.
   * To clear a specific filter, pass undefined or null for that filter key.
   *
   * **Available Filters:**
   * - grade: Filter by grade level
   * - nurseId: Filter by assigned nurse
   * - hasAllergies: Filter students with/without allergies
   * - hasMedications: Filter students with/without medications
   * - isActive: Filter by active/inactive status
   */
  setFilters: (state: StudentUIState, action: PayloadAction<Partial<StudentFilters>>) => {
    state.filters = { ...state.filters, ...action.payload };
    state.currentPage = 1; // Reset to first page when filters change
  },

  /**
   * Clears all active filters.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Pagination Reset:** Automatically resets to page 1 when clearing filters.
   *
   * **Use Cases:**
   * - User clicks "Clear Filters" button
   * - Resetting view to show all students
   * - Starting a fresh search/filter operation
   */
  clearFilters: (state: StudentUIState) => {
    state.filters = {};
    state.currentPage = 1;
  },

  /**
   * Sets search query for text-based filtering.
   *
   * @param state - Current UI state
   * @param action - Action with search query string
   *
   * @remarks
   * **Client-Side Search:** Search is performed client-side on loaded students.
   * Searches across multiple fields: firstName, lastName, studentNumber, grade.
   *
   * **Pagination Reset:** Automatically resets to page 1 when search query changes.
   *
   * **Case Insensitive:** Search comparison is case-insensitive for better UX.
   *
   * **Performance:** For very large student populations (500+), consider debouncing
   * the search input and implementing server-side search.
   */
  setSearchQuery: (state: StudentUIState, action: PayloadAction<string>) => {
    state.searchQuery = action.payload;
    state.currentPage = 1; // Reset to first page when searching
  },

  /**
   * Toggles visibility of inactive students.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Default Behavior:** Inactive students are hidden by default per HIPAA data
   * minimization principle (limit exposure of potentially outdated PHI).
   *
   * **Pagination Reset:** Automatically resets to page 1 when toggling to ensure
   * user sees the beginning of the updated results.
   *
   * **Use Cases:**
   * - Reviewing historical student records
   * - Restoring accidentally deactivated students
   * - Administrative data cleanup operations
   */
  toggleShowInactive: (state: StudentUIState) => {
    state.showInactive = !state.showInactive;
    state.currentPage = 1;
  },

  /**
   * Sets sorting criteria for students.
   *
   * @param state - Current UI state
   * @param action - Action with sort configuration
   *
   * @remarks
   * **Sort Fields:**
   * - name: Sorts by lastName, firstName (standard alphabetical)
   * - grade: Sorts by grade level (K, 1, 2, ..., 12)
   * - enrollmentDate: Sorts by enrollment date (newest/oldest first)
   * - lastVisit: Sorts by most recent health visit date
   *
   * **Performance:** Sorting is performed client-side using memoized selectors.
   * For very large datasets, consider server-side sorting.
   */
  setSorting: (state: StudentUIState, action: PayloadAction<{ sortBy: 'name' | 'grade' | 'enrollmentDate' | 'lastVisit'; sortOrder: 'asc' | 'desc' }>) => {
    state.sortBy = action.payload.sortBy;
    state.sortOrder = action.payload.sortOrder;
  },

  /**
   * Toggles sort order between ascending and descending.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Toggle Behavior:** Switches asc ↔ desc without changing sort field.
   * Useful for column header clicks in table view.
   */
  toggleSortOrder: (state: StudentUIState) => {
    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
  },

  /**
   * Sets the current page number.
   *
   * @param state - Current UI state
   * @param action - Action with page number (1-indexed)
   *
   * @remarks
   * **Page Numbering:** Pages are 1-indexed for user-facing display.
   *
   * **Bounds Checking:** UI components should disable navigation buttons when
   * at first/last page, but this reducer doesn't enforce bounds to support
   * dynamic data changes.
   */
  setPage: (state: StudentUIState, action: PayloadAction<number>) => {
    state.currentPage = action.payload;
  },

  /**
   * Sets the number of items per page.
   *
   * @param state - Current UI state
   * @param action - Action with page size (typically 10, 20, 50, 100)
   *
   * @remarks
   * **Pagination Reset:** Automatically resets to page 1 when page size changes to
   * maintain data consistency and prevent showing empty pages.
   *
   * **Performance:** Smaller page sizes improve rendering performance for large lists.
   * Recommend 20-50 for typical school nurse workflows.
   *
   * **Persistence:** Page size preference should be persisted to localStorage.
   */
  setPageSize: (state: StudentUIState, action: PayloadAction<number>) => {
    state.pageSize = action.payload;
    state.currentPage = 1; // Reset to first page when page size changes
  },

  /**
   * Navigates to the next page.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Bounds Checking:** UI should disable next button on last page. This reducer
   * doesn't enforce upper bounds to support dynamic data changes.
   */
  nextPage: (state: StudentUIState) => {
    state.currentPage += 1;
  },

  /**
   * Navigates to the previous page.
   *
   * @param state - Current UI state
   *
   * @remarks
   * **Bounds Checking:** Does not go below page 1. UI should disable previous
   * button on first page for better UX.
   */
  previousPage: (state: StudentUIState) => {
    if (state.currentPage > 1) {
      state.currentPage -= 1;
    }
  },

  /**
   * Resets all UI state to initial values.
   *
   * @returns Fresh initial state
   *
   * @remarks
   * **Use Cases:**
   * - User logout (clear all preferences and selections)
   * - Switching schools (reset view for new context)
   * - Resetting view preferences to defaults
   * - Admin-triggered state cleanup
   *
   * **PHI Considerations:** Clears all selections to prevent PHI leakage across sessions.
   */
  resetUIState: () => initialUIState,
};
