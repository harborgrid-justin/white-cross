/**
 * @module stores/slices/students/basic-selectors
 *
 * Basic Students State Selectors
 *
 * Provides simple selector functions for accessing UI state properties directly.
 * These selectors are lightweight and don't perform any computations.
 *
 * @remarks
 * **Performance:** These selectors are simple property accessors and don't require
 * memoization. They return primitive values or shallow references from state.
 *
 * **Type Safety:** All selectors use proper RootState typing for compile-time
 * type checking and IDE support.
 *
 * @since 1.0.0
 */

import {
  RootState,
  StudentUIState,
  StudentFilters,
  SortConfig,
  PaginationConfig,
} from './types';

/**
 * Selector for complete student UI state.
 *
 * @param {RootState} state - Redux root state
 * @returns {StudentUIState} Complete UI state object
 *
 * @example
 * ```typescript
 * const uiState = useSelector(selectStudentUIState);
 * console.log(uiState.viewMode, uiState.filters, uiState.selectedIds);
 * ```
 */
export const selectStudentUIState = (state: RootState): StudentUIState => state.students.ui;

/**
 * Selector for selected student IDs.
 *
 * @param {RootState} state - Redux root state
 * @returns {string[]} Array of selected student IDs
 *
 * @example
 * ```typescript
 * const selectedIds = useSelector(selectSelectedStudentIds);
 * const selectedCount = selectedIds.length;
 * ```
 */
export const selectSelectedStudentIds = (state: RootState): string[] => state.students.ui.selectedIds;

/**
 * Selector for current view mode.
 *
 * @param {RootState} state - Redux root state
 * @returns {StudentUIState['viewMode']} Current view mode ('grid' | 'list' | 'table')
 *
 * @example
 * ```typescript
 * const viewMode = useSelector(selectStudentViewMode);
 * ```
 */
export const selectStudentViewMode = (state: RootState): StudentUIState['viewMode'] => state.students.ui.viewMode;

/**
 * Selector for active filters.
 *
 * @param {RootState} state - Redux root state
 * @returns {StudentFilters} Current filter criteria
 *
 * @example
 * ```typescript
 * const filters = useSelector(selectStudentFilters);
 * if (filters.grade) {
 *   console.log(`Filtering by grade: ${filters.grade}`);
 * }
 * ```
 */
export const selectStudentFilters = (state: RootState): StudentFilters => state.students.ui.filters;

/**
 * Selector for current sort configuration.
 *
 * @param {RootState} state - Redux root state
 * @returns {SortConfig} Sort configuration object
 *
 * @example
 * ```typescript
 * const { sortBy, sortOrder } = useSelector(selectStudentSort);
 * console.log(`Sorted by ${sortBy} ${sortOrder}`);
 * ```
 */
export const selectStudentSort = (state: RootState): SortConfig => ({
  sortBy: state.students.ui.sortBy,
  sortOrder: state.students.ui.sortOrder,
});

/**
 * Selector for pagination configuration.
 *
 * @param {RootState} state - Redux root state
 * @returns {PaginationConfig} Pagination configuration
 *
 * @example
 * ```typescript
 * const { currentPage, pageSize } = useSelector(selectStudentPagination);
 * ```
 */
export const selectStudentPagination = (state: RootState): PaginationConfig => ({
  currentPage: state.students.ui.currentPage,
  pageSize: state.students.ui.pageSize,
});

/**
 * Selector for search query.
 *
 * @param {RootState} state - Redux root state
 * @returns {string} Current search query
 *
 * @example
 * ```typescript
 * const searchQuery = useSelector(selectStudentSearchQuery);
 * ```
 */
export const selectStudentSearchQuery = (state: RootState): string => state.students.ui.searchQuery;

/**
 * Selector for inactive students visibility.
 *
 * @param {RootState} state - Redux root state
 * @returns {boolean} Whether inactive students are shown
 *
 * @example
 * ```typescript
 * const showInactive = useSelector(selectShowInactiveStudents);
 * ```
 */
export const selectShowInactiveStudents = (state: RootState): boolean => state.students.ui.showInactive;

/**
 * Selector for bulk select mode status.
 *
 * @param {RootState} state - Redux root state
 * @returns {boolean} Whether bulk select mode is active
 *
 * @example
 * ```typescript
 * const isBulkMode = useSelector(selectIsBulkSelectMode);
 * ```
 */
export const selectIsBulkSelectMode = (state: RootState): boolean => state.students.ui.bulkSelectMode;

/**
 * Selector for expanded student card IDs.
 *
 * @param {RootState} state - Redux root state
 * @returns {string[]} Array of expanded student IDs
 *
 * @example
 * ```typescript
 * const expandedCards = useSelector(selectExpandedStudentCards);
 * const isExpanded = expandedCards.includes(studentId);
 * ```
 */
export const selectExpandedStudentCards = (state: RootState): string[] => state.students.ui.expandedCards;
