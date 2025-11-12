/**
 * @module stores/slices/students/ui-state-config
 *
 * Students UI State Configuration
 *
 * Defines the initial UI state configuration for student management views.
 * This module provides the default values for view preferences, sorting,
 * pagination, and other UI-related settings.
 *
 * @remarks
 * **Separation of Concerns:** Configuration is separated from reducers to
 * improve maintainability and testability.
 *
 * **HIPAA Compliance:** Default settings prioritize data minimization by
 * hiding inactive students and using appropriate page sizes.
 *
 * @since 1.0.0
 */

import { StudentUIState } from './types';

/**
 * Initial UI state for student management views.
 *
 * Provides sensible defaults for student list display: table view with 20 items
 * per page, sorted alphabetically by name, showing only active students.
 *
 * @const {StudentUIState}
 *
 * @remarks
 * **Default Values:**
 * - View Mode: Table (best for data-dense school nurse workflows)
 * - Page Size: 20 (balances performance with usability)
 * - Sort: By last name, ascending (alphabetical order)
 * - Active Only: Hide inactive students by default (HIPAA data minimization)
 * - No Initial Selection: Empty selection array for clean start
 * - First Page: Start at page 1 for consistent UX
 *
 * **Customization:** These defaults can be overridden by:
 * - User preferences from localStorage
 * - URL parameters for deep linking
 * - Application configuration settings
 *
 * @example
 * ```typescript
 * // Using initial state in tests
 * const testState = {
 *   ...initialUIState,
 *   viewMode: 'grid', // Override for test
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Resetting UI state to defaults
 * dispatch(studentsActions.resetUIState());
 * // This will restore all values to initialUIState
 * ```
 */
export const initialUIState: StudentUIState = {
  selectedIds: [],
  viewMode: 'table',
  filters: {},
  sortBy: 'name',
  sortOrder: 'asc',
  searchQuery: '',
  showInactive: false,
  bulkSelectMode: false,
  expandedCards: [],
  pageSize: 20,
  currentPage: 1,
};
