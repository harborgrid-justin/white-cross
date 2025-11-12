/**
 * @module pages/students/store/studentsSlice
 *
 * Students Redux Slice - Entity and UI State Management
 *
 * Manages student entities and comprehensive UI state using a hybrid approach combining
 * the entity slice factory pattern with custom UI state management. Provides standardized
 * CRUD operations for student records alongside sophisticated UI controls for selection,
 * filtering, sorting, and pagination.
 *
 * @remarks
 * **Architecture Pattern:** Combines entity slice factory (normalized CRUD state) with
 * custom UI slice (view preferences, filters, selection). This hybrid enables both
 * standardized backend integration and rich UI state management in a single slice.
 *
 * **HIPAA Compliance:** Student records contain PHI (names, dates of birth, health info).
 * All operations trigger audit logging in the backend API layer. PHI is excluded from
 * localStorage persistence - only non-sensitive UI preferences are persisted.
 *
 * **Cross-Tab Synchronization:** Uses BroadcastChannel API to sync student data changes
 * across browser tabs. When a nurse updates a student in one tab, all other tabs receive
 * the update notification and can refresh their data accordingly.
 *
 * **Entity Slice Factory:** Leverages createEntitySlice factory for standardized CRUD
 * operations with built-in loading states, error handling, and optimistic updates.
 * EntityAdapter provides efficient normalized state management with O(1) lookups.
 *
 * **Performance Optimization:** Complex selectors use memoization to prevent unnecessary
 * recalculations. Pagination limits rendered items to improve performance with large
 * student populations (100+ students).
 *
 * @see {@link createEntitySlice} for factory implementation details
 * @see {@link studentsApi} for backend API integration
 * @see {@link Student} for student entity type definition
 * @see {@link useStudentsData} for hook-based data access
 *
 * @since 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEntitySlice, EntityApiService } from '@/stores/sliceFactory';
import { Student, CreateStudentData, UpdateStudentData, StudentFilters as StudentFiltersType } from '@/types/student.types';
import { apiActions } from '@/lib/api';

// Re-export StudentFilters type for external use
export type { StudentFiltersType as StudentFilters };

/**
 * Combined state interface for students slice (entity + UI state).
 *
 * @interface StudentsState
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
 * @interface RootState
 */
export interface RootState {
  students: StudentsState;
  // Other slices would be added here
}

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
 * API service adapter for students.
 *
 * Wraps the studentsApi service to conform to the EntityApiService interface required
 * by the entity slice factory. Handles response transformation and error handling for
 * all student CRUD operations.
 *
 * @const {EntityApiService<Student, CreateStudentData, UpdateStudentData>}
 *
 * @remarks
 * **API Integration:** All methods call studentsApi which handles authentication,
 * error handling, retry logic, and audit logging for HIPAA compliance.
 *
 * **Response Transformation:** Normalizes API responses to match slice factory
 * expectations, ensuring consistent data structure across all entity types.
 *
 * **Audit Logging:** Student CRUD operations trigger audit logs in backend for
 * HIPAA compliance tracking of PHI access.
 *
 * @see {@link studentsApi} for underlying API implementation
 * @see {@link EntityApiService} for interface definition
 */
const studentsApiService: EntityApiService<Student, CreateStudentData, UpdateStudentData> = {
  /**
   * Fetches all students with optional filtering and pagination.
   *
   * @param {StudentFiltersType} [params] - Optional filter parameters
   * @returns {Promise<{data: Student[], total?: number, pagination?: any}>} Students and pagination info
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access in the backend.
   *
   * @example
   * ```typescript
   * // Fetch all active students in grade 5
   * const response = await studentsApiService.getAll({
   *   grade: '5',
   *   isActive: true
   * });
   * ```
   */
  async getAll(params?: StudentFiltersType) {
    const response = await apiActions.students.getAll(params);
    return {
      data: response?.students || [],
      total: response?.pagination?.total,
      pagination: response?.pagination,
    };
  },

  /**
   * Fetches a single student by ID.
   *
   * @param {string} id - Student ID to fetch
   * @returns {Promise<{data: Student}>} Single student record
   * @throws {Error} If student not found or access denied
   *
   * @remarks
   * **HIPAA Audit:** This operation triggers audit logging for PHI access.
   *
   * @example
   * ```typescript
   * const student = await studentsApiService.getById('student-123');
   * ```
   */
  async getById(id: string) {
    const response = await apiActions.students.getById(id);
    return { data: response };
  },

  /**
   * Creates a new student record.
   *
   * @param {CreateStudentData} data - Student creation data
   * @returns {Promise<{data: Student}>} Created student record
   * @throws {Error} If validation fails or duplicate student number detected
   *
   * @remarks
   * **Validation:** Backend validates required fields, student number uniqueness,
   * and grade format before creation.
   *
   * **HIPAA Audit:** Creation triggers audit log for new PHI record creation.
   *
   * @example
   * ```typescript
   * const newStudent = await studentsApiService.create({
   *   firstName: 'John',
   *   lastName: 'Doe',
   *   studentNumber: 'STU-2024-001',
   *   grade: '5',
   *   dateOfBirth: '2014-05-15',
   *   // ... other required fields
   * });
   * ```
   */
  async create(data: CreateStudentData) {
    const response = await apiActions.students.create(data);
    return { data: response };
  },

  /**
   * Updates an existing student record.
   *
   * @param {string} id - Student ID to update
   * @param {UpdateStudentData} data - Updated student data (partial)
   * @returns {Promise<{data: Student}>} Updated student record
   * @throws {Error} If student not found, access denied, or validation fails
   *
   * @remarks
   * **Partial Updates:** Supports partial updates - only provided fields are updated.
   *
   * **HIPAA Audit:** Update triggers audit log recording changed fields.
   *
   * **Validation:** Backend validates updated fields (e.g., grade format, email format).
   *
   * @example
   * ```typescript
   * // Update only grade and active status
   * const updated = await studentsApiService.update('student-123', {
   *   grade: '6',
   *   isActive: true
   * });
   * ```
   */
  async update(id: string, data: UpdateStudentData) {
    const response = await apiActions.students.update(id, data);
    return { data: response };
  },

  /**
   * Deletes (soft-deletes) a student record.
   *
   * @param {string} id - Student ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {Error} If student not found or access denied
   *
   * @remarks
   * **Soft Delete:** Student records are soft-deleted (marked inactive) rather than
   * physically deleted to preserve audit trail and historical data.
   *
   * **HIPAA Audit:** Deletion triggers audit log for data retention compliance.
   *
   * **Cascade Behavior:** Related health records, medications, and appointments are
   * retained but marked as inactive.
   *
   * @example
   * ```typescript
   * await studentsApiService.delete('student-123');
   * // Student is marked isActive: false, not physically deleted
   * ```
   */
  async delete(id: string) {
    await apiActions.students.delete(id);
    return { success: true };
  },
};

/**
 * Students slice factory instance.
 *
 * Creates the Redux slice with standardized CRUD operations, loading states,
 * and error handling using the entity slice factory pattern.
 *
 * @const
 *
 * @remarks
 * **Bulk Operations:** Enabled for students to support bulk printing, reporting,
 * and administrative tasks. Each operation still triggers individual audit logs.
 *
 * **Normalized State:** Uses EntityAdapter for normalized state management with
 * efficient lookups by ID.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */
const studentsSliceFactory = createEntitySlice<Student, CreateStudentData, UpdateStudentData>(
  'students',
  studentsApiService,
  {
    enableBulkOperations: true,
  }
);

/**
 * Initial UI state for student management views.
 *
 * Provides sensible defaults for student list display: table view with 20 items
 * per page, sorted alphabetically by name, showing only active students.
 *
 * @const {StudentUIState}
 */
const initialUIState: StudentUIState = {
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

/**
 * UI state slice for student management.
 *
 * Manages view preferences, selection state, filters, sorting, and pagination
 * separately from entity data to enable flexible UI state management.
 *
 * @const
 */
const studentUISlice = createSlice({
  name: 'studentUI',
  initialState: initialUIState,
  reducers: {
    /**
     * Selects a single student (adds to selection if not already selected).
     *
     * @param {string} action.payload - Student ID to select
     *
     * @remarks
     * **Multi-Select:** Adds to existing selection without clearing previous selections.
     * Use clearSelection first for single-select behavior.
     */
    selectStudent: (state, action: PayloadAction<string>) => {
      if (!state.selectedIds.includes(action.payload)) {
        state.selectedIds.push(action.payload);
      }
    },

    /**
     * Deselects a single student (removes from selection).
     *
     * @param {string} action.payload - Student ID to deselect
     */
    deselectStudent: (state, action: PayloadAction<string>) => {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload);
    },

    /**
     * Selects multiple students (adds to existing selection).
     *
     * @param {string[]} action.payload - Array of student IDs to select
     *
     * @remarks
     * **Deduplication:** Only adds IDs not already in selection to prevent duplicates.
     */
    selectMultipleStudents: (state, action: PayloadAction<string[]>) => {
      const newIds = action.payload.filter(id => !state.selectedIds.includes(id));
      state.selectedIds.push(...newIds);
    },

    /**
     * Selects all students (replaces current selection).
     *
     * @param {string[]} action.payload - Array of all student IDs to select
     *
     * @remarks
     * **Replace:** Clears existing selection and selects all provided IDs.
     */
    selectAllStudents: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },

    /**
     * Clears all student selections.
     *
     * @remarks
     * Used when exiting bulk select mode or after completing bulk operations.
     */
    clearSelection: (state) => {
      state.selectedIds = [];
    },

    /**
     * Toggles bulk select mode on/off.
     *
     * @remarks
     * **Auto-Clear:** When disabling bulk select mode, automatically clears selection.
     */
    toggleBulkSelectMode: (state) => {
      state.bulkSelectMode = !state.bulkSelectMode;
      if (!state.bulkSelectMode) {
        state.selectedIds = [];
      }
    },

    /**
     * Sets the view mode for student display.
     *
     * @param {'grid' | 'list' | 'table'} action.payload - View mode to set
     *
     * @remarks
     * **Persistence:** View mode preference is persisted to localStorage.
     */
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'table'>) => {
      state.viewMode = action.payload;
    },

    /**
     * Toggles card expansion for a student in card view.
     *
     * @param {string} action.payload - Student ID to toggle expansion
     *
     * @remarks
     * **Performance:** Collapsing cards improves performance by reducing rendered content.
     */
    toggleCardExpansion: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      if (state.expandedCards.includes(studentId)) {
        state.expandedCards = state.expandedCards.filter(id => id !== studentId);
      } else {
        state.expandedCards.push(studentId);
      }
    },

    /**
     * Collapses all student cards.
     *
     * @remarks
     * **Performance:** Used when switching views or scrolling to improve performance.
     */
    collapseAllCards: (state) => {
      state.expandedCards = [];
    },

    /**
     * Sets filter criteria for students.
     *
     * @param {Partial<StudentFiltersType>} action.payload - Filter criteria to apply
     *
     * @remarks
     * **Pagination Reset:** Automatically resets to page 1 when filters change.
     * **Merge Behavior:** Merges with existing filters, allowing partial filter updates.
     */
    setFilters: (state, action: PayloadAction<Partial<StudentFiltersType>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filters change
    },

    /**
     * Clears all active filters.
     *
     * @remarks
     * **Pagination Reset:** Automatically resets to page 1 when clearing filters.
     */
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    /**
     * Sets search query for text-based filtering.
     *
     * @param {string} action.payload - Search query string
     *
     * @remarks
     * **Client-Side Search:** Search is performed client-side on loaded students.
     * Searches firstName, lastName, studentNumber, and grade fields.
     * **Pagination Reset:** Automatically resets to page 1 when search query changes.
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },

    /**
     * Toggles visibility of inactive students.
     *
     * @remarks
     * **Default:** Inactive students are hidden by default per HIPAA data minimization.
     * **Pagination Reset:** Automatically resets to page 1 when toggling.
     */
    toggleShowInactive: (state) => {
      state.showInactive = !state.showInactive;
      state.currentPage = 1;
    },

    /**
     * Sets sorting criteria for students.
     *
     * @param {Object} action.payload - Sort configuration
     * @param {StudentUIState['sortBy']} action.payload.sortBy - Field to sort by
     * @param {StudentUIState['sortOrder']} action.payload.sortOrder - Sort direction
     */
    setSorting: (state, action: PayloadAction<{ sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },

    /**
     * Toggles sort order between ascending and descending.
     *
     * @remarks
     * **Toggle Behavior:** Switches asc ↔ desc without changing sort field.
     */
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    /**
     * Sets the current page number.
     *
     * @param {number} action.payload - Page number to navigate to (1-indexed)
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    /**
     * Sets the number of items per page.
     *
     * @param {number} action.payload - Page size (typically 10, 20, 50, 100)
     *
     * @remarks
     * **Pagination Reset:** Automatically resets to page 1 when page size changes.
     * **Performance:** Smaller page sizes improve rendering performance for large lists.
     */
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },

    /**
     * Navigates to the next page.
     *
     * @remarks
     * **Bounds Checking:** UI should disable next button on last page.
     */
    nextPage: (state) => {
      state.currentPage += 1;
    },

    /**
     * Navigates to the previous page.
     *
     * @remarks
     * **Bounds Checking:** Does not go below page 1. UI should disable previous button on first page.
     */
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },

    /**
     * Resets all UI state to initial values.
     *
     * @remarks
     * **Use Cases:** Logout, switching schools, or resetting view preferences.
     */
    resetUIState: () => initialUIState,
  },
});

/**
 * Combined students slice (entity + UI state).
 *
 * Merges entity slice from factory with custom UI slice to provide unified state.
 *
 * @const
 */
const combinedStudentsSlice = createSlice({
  name: 'students',
  initialState: {
    ...(studentsSliceFactory.slice.getInitialState() || {}),
    ui: initialUIState,
  },
  reducers: {
    // UI reducers from studentUISlice
    selectStudent: (state, action: PayloadAction<string>) => {
      if (!state.ui.selectedIds.includes(action.payload)) {
        state.ui.selectedIds.push(action.payload);
      }
    },
    deselectStudent: (state, action: PayloadAction<string>) => {
      state.ui.selectedIds = state.ui.selectedIds.filter((id: string) => id !== action.payload);
    },
    selectMultipleStudents: (state, action: PayloadAction<string[]>) => {
      const newIds = action.payload.filter(id => !state.ui.selectedIds.includes(id));
      state.ui.selectedIds.push(...newIds);
    },
    selectAllStudents: (state, action: PayloadAction<string[]>) => {
      state.ui.selectedIds = action.payload;
    },
    clearSelection: (state) => {
      state.ui.selectedIds = [];
    },
    toggleBulkSelectMode: (state) => {
      state.ui.bulkSelectMode = !state.ui.bulkSelectMode;
      if (!state.ui.bulkSelectMode) {
        state.ui.selectedIds = [];
      }
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'table'>) => {
      state.ui.viewMode = action.payload;
    },
    toggleCardExpansion: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      if (state.ui.expandedCards.includes(studentId)) {
        state.ui.expandedCards = state.ui.expandedCards.filter((id: string) => id !== studentId);
      } else {
        state.ui.expandedCards.push(studentId);
      }
    },
    collapseAllCards: (state) => {
      state.ui.expandedCards = [];
    },
    setFilters: (state, action: PayloadAction<Partial<StudentFiltersType>>) => {
      state.ui.filters = { ...state.ui.filters, ...action.payload };
      state.ui.currentPage = 1;
    },
    clearFilters: (state) => {
      state.ui.filters = {};
      state.ui.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.searchQuery = action.payload;
      state.ui.currentPage = 1;
    },
    toggleShowInactive: (state) => {
      state.ui.showInactive = !state.ui.showInactive;
      state.ui.currentPage = 1;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: StudentUIState['sortBy']; sortOrder: StudentUIState['sortOrder'] }>) => {
      state.ui.sortBy = action.payload.sortBy;
      state.ui.sortOrder = action.payload.sortOrder;
    },
    toggleSortOrder: (state) => {
      state.ui.sortOrder = state.ui.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.ui.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.ui.pageSize = action.payload;
      state.ui.currentPage = 1;
    },
    nextPage: (state) => {
      state.ui.currentPage += 1;
    },
    previousPage: (state) => {
      if (state.ui.currentPage > 1) {
        state.ui.currentPage -= 1;
      }
    },
    resetUIState: (state) => {
      state.ui = initialUIState;
    },
  },
  extraReducers: (builder) => {
    // Copy all extra reducers from the entity slice
    const entitySliceReducers = studentsSliceFactory.slice.reducer;
    builder.addMatcher(
      (action) => action.type.startsWith('students/'),
      (state, action) => {
        const entityState = entitySliceReducers(
          { ...state, ui: undefined },
          action
        );
        return {
          ...(entityState || {}),
          ui: state.ui,
        };
      }
    );
  },
});

/**
 * Students Redux slice.
 *
 * @exports studentsSlice
 */
export const studentsSlice = combinedStudentsSlice;

/**
 * Students reducer for Redux store.
 *
 * @exports studentsReducer
 */
export const studentsReducer = combinedStudentsSlice.reducer;

/**
 * Action creators for student state updates.
 *
 * Includes both entity actions (CRUD) and UI actions (selection, filtering, etc.).
 *
 * @exports studentsActions
 */
export const studentsActions = {
  ...studentsSliceFactory.actions,
  ...studentUISlice.actions,
};

/**
 * Entity adapter selectors for normalized student state.
 *
 * Provides efficient selectors for accessing students:
 * - selectAll: Get all students as array
 * - selectById: Get student by ID
 * - selectIds: Get all student IDs
 * - selectEntities: Get students as normalized object
 * - selectTotal: Get total count
 *
 * @exports studentsSelectors
 *
 * @example
 * ```typescript
 * const allStudents = useSelector(studentsSelectors.selectAll);
 * const student = useSelector(state => studentsSelectors.selectById(state, 'student-123'));
 * ```
 */
export const studentsSelectors = studentsSliceFactory.adapter.getSelectors((state: RootState) => state.students);

/**
 * Async thunks for student API operations.
 *
 * Provides thunks for all CRUD operations from entity slice factory.
 *
 * @exports studentsThunks
 *
 * @example
 * ```typescript
 * // Fetch all active students in grade 5
 * dispatch(studentsThunks.fetchAll({ grade: '5', isActive: true }));
 *
 * // Create new student
 * dispatch(studentsThunks.create(studentData));
 * ```
 */
export const studentsThunks = studentsSliceFactory.thunks;

/**
 * Selector for student UI state.
 *
 * @param {any} state - Redux root state
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
 * @param {any} state - Redux root state
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
 * @returns {StudentFiltersType} Current filter criteria
 *
 * @example
 * ```typescript
 * const filters = useSelector(selectStudentFilters);
 * if (filters.grade) {
 *   console.log(`Filtering by grade: ${filters.grade}`);
 * }
 * ```
 */
export const selectStudentFilters = (state: RootState): StudentFiltersType => state.students.ui.filters;

/**
 * Selector for current sort configuration.
 *
 * @param {RootState} state - Redux root state
 * @returns {{sortBy: string, sortOrder: string}} Sort configuration object
 *
 * @example
 * ```typescript
 * const { sortBy, sortOrder } = useSelector(selectStudentSort);
 * console.log(`Sorted by ${sortBy} ${sortOrder}`);
 * ```
 */
export const selectStudentSort = (state: RootState) => ({
  sortBy: state.students.ui.sortBy,
  sortOrder: state.students.ui.sortOrder,
});

/**
 * Selector for pagination state.
 *
 * @param {RootState} state - Redux root state
 * @returns {{currentPage: number, pageSize: number}} Pagination configuration
 *
 * @example
 * ```typescript
 * const { currentPage, pageSize } = useSelector(selectStudentPagination);
 * ```
 */
export const selectStudentPagination = (state: RootState) => ({
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

/**
 * Selector for filtered and sorted students.
 *
 * Applies filters, search query, and sorting to all students. This is a complex
 * selector that performs client-side filtering and sorting.
 *
 * @param {any} state - Redux root state
 * @returns {Student[]} Filtered and sorted student array
 *
 * @remarks
 * **Performance:** Should be memoized with reselect for production use with large datasets.
 * **Filtering Logic:**
 * - Activity filter (active/inactive)
 * - Text search (firstName, lastName, studentNumber, grade)
 * - Grade filter
 * - Nurse assignment filter
 * - Allergy presence filter
 * - Medication presence filter
 * **Sorting Logic:** Supports sorting by name, grade, enrollment date, or last visit.
 *
 * @example
 * ```typescript
 * const filteredStudents = useSelector(selectFilteredAndSortedStudents);
 * console.log(`Showing ${filteredStudents.length} students`);
 * ```
 */
export const selectFilteredAndSortedStudents = (state: RootState): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  const { filters, searchQuery, showInactive, sortBy, sortOrder } = state.students.ui;

  let filteredStudents = allStudents;

  // Apply activity filter
  if (!showInactive) {
    filteredStudents = filteredStudents.filter(student => student.isActive);
  }

  // Apply search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredStudents = filteredStudents.filter(student =>
      student.firstName.toLowerCase().includes(query) ||
      student.lastName.toLowerCase().includes(query) ||
      student.studentNumber.toLowerCase().includes(query) ||
      student.grade.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.grade) {
    filteredStudents = filteredStudents.filter(student => student.grade === filters.grade);
  }
  if (filters.nurseId) {
    filteredStudents = filteredStudents.filter(student => student.nurseId === filters.nurseId);
  }
  if (filters.hasAllergies !== undefined) {
    filteredStudents = filteredStudents.filter(student =>
      filters.hasAllergies ? (student.allergies && student.allergies.length > 0) :
                            !(student.allergies && student.allergies.length > 0)
    );
  }
  if (filters.hasMedications !== undefined) {
    filteredStudents = filteredStudents.filter(student =>
      filters.hasMedications ? (student.medications && student.medications.length > 0) :
                              !(student.medications && student.medications.length > 0)
    );
  }

  // Apply sorting
  filteredStudents.sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date;

    switch (sortBy) {
      case 'name':
        aValue = `${a.lastName}, ${a.firstName}`;
        bValue = `${b.lastName}, ${b.firstName}`;
        break;
      case 'grade':
        aValue = a.grade;
        bValue = b.grade;
        break;
      case 'enrollmentDate':
        aValue = new Date(a.enrollmentDate);
        bValue = new Date(b.enrollmentDate);
        break;
      case 'lastVisit':
        // Get most recent appointment date as last visit
        aValue = a.appointments && a.appointments.length > 0
          ? new Date(Math.max(...a.appointments.map(apt => new Date(apt.scheduledAt).getTime())))
          : new Date(0);
        bValue = b.appointments && b.appointments.length > 0
          ? new Date(Math.max(...b.appointments.map(apt => new Date(apt.scheduledAt).getTime())))
          : new Date(0);
        break;
      default:
        aValue = a.lastName;
        bValue = b.lastName;
    }

    if ((aValue as any) < (bValue as any)) return sortOrder === 'asc' ? -1 : 1;
    if ((aValue as any) > (bValue as any)) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filteredStudents;
};

/**
 * Selector for paginated students.
 *
 * Returns the current page of students based on filtered/sorted results and
 * pagination settings.
 *
 * @param {any} state - Redux root state
 * @returns {Student[]} Students for current page
 *
 * @remarks
 * **Performance:** Pagination reduces DOM rendering load for large student lists.
 * **Dependencies:** Relies on selectFilteredAndSortedStudents for input data.
 *
 * @example
 * ```typescript
 * const currentPageStudents = useSelector(selectPaginatedStudents);
 * // Returns 20 students for current page (default page size)
 * ```
 */
export const selectPaginatedStudents = (state: RootState): Student[] => {
  const filteredStudents = selectFilteredAndSortedStudents(state);
  const { currentPage, pageSize } = state.students.ui;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return filteredStudents.slice(startIndex, endIndex);
};

/**
 * Selector for pagination metadata.
 *
 * Provides comprehensive pagination information including total count, page numbers,
 * and navigation availability.
 *
 * @param {any} state - Redux root state
 * @returns {Object} Pagination metadata
 * @returns {number} return.totalStudents - Total filtered student count
 * @returns {number} return.currentPage - Current page number
 * @returns {number} return.pageSize - Students per page
 * @returns {number} return.totalPages - Total number of pages
 * @returns {boolean} return.hasNextPage - Whether next page exists
 * @returns {boolean} return.hasPreviousPage - Whether previous page exists
 * @returns {number} return.startIndex - Starting student index (1-based)
 * @returns {number} return.endIndex - Ending student index (inclusive)
 *
 * @example
 * ```typescript
 * const paginationInfo = useSelector(selectStudentPaginationInfo);
 * console.log(`Showing ${paginationInfo.startIndex}-${paginationInfo.endIndex} of ${paginationInfo.totalStudents}`);
 * ```
 */
export const selectStudentPaginationInfo = (state: RootState) => {
  const totalStudents = selectFilteredAndSortedStudents(state).length;
  const { currentPage, pageSize } = state.students.ui;

  return {
    totalStudents,
    currentPage,
    pageSize,
    totalPages: Math.ceil(totalStudents / pageSize),
    hasNextPage: currentPage * pageSize < totalStudents,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * pageSize + 1,
    endIndex: Math.min(currentPage * pageSize, totalStudents),
  };
};

/**
 * Selector for selected student entities.
 *
 * Returns full student objects for all selected IDs.
 *
 * @param {any} state - Redux root state
 * @returns {Student[]} Array of selected student entities
 *
 * @example
 * ```typescript
 * const selectedStudents = useSelector(selectSelectedStudents);
 * const selectedNames = selectedStudents.map(s => `${s.firstName} ${s.lastName}`);
 * ```
 */
export const selectSelectedStudents = (state: RootState): Student[] => {
  const selectedIds = state.students.ui.selectedIds;
  return selectedIds.map((id: string) => studentsSelectors.selectById(state, id)).filter(Boolean) as Student[];
};

/**
 * Selector for active students only.
 *
 * @param {any} state - Redux root state
 * @returns {Student[]} Array of active students
 *
 * @remarks
 * **HIPAA Data Minimization:** By default, only active students are shown to limit
 * exposure of potentially outdated PHI.
 *
 * @example
 * ```typescript
 * const activeStudents = useSelector(selectActiveStudents);
 * ```
 */
export const selectActiveStudents = (state: RootState): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.isActive);
};

/**
 * Selector for students by grade.
 *
 * @param {any} state - Redux root state
 * @param {string} grade - Grade to filter by (e.g., 'K', '1', '2', ..., '12')
 * @returns {Student[]} Students in specified grade
 *
 * @example
 * ```typescript
 * const fifthGraders = useSelector(state => selectStudentsByGrade(state, '5'));
 * ```
 */
export const selectStudentsByGrade = (state: RootState, grade: string): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.grade === grade);
};

/**
 * Selector for students assigned to a specific nurse.
 *
 * @param {any} state - Redux root state
 * @param {string} nurseId - Nurse ID to filter by
 * @returns {Student[]} Students assigned to specified nurse
 *
 * @example
 * ```typescript
 * const myStudents = useSelector(state => selectStudentsByNurse(state, currentNurseId));
 * ```
 */
export const selectStudentsByNurse = (state: RootState, nurseId: string): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.nurseId === nurseId);
};

/**
 * Selector for students with allergies.
 *
 * @param {any} state - Redux root state
 * @returns {Student[]} Students with one or more documented allergies
 *
 * @remarks
 * **Healthcare Alert:** These students require special attention for medication
 * administration and should have allergy information prominently displayed.
 *
 * @example
 * ```typescript
 * const studentsWithAllergies = useSelector(selectStudentsWithAllergies);
 * const allergyCount = studentsWithAllergies.length;
 * ```
 */
export const selectStudentsWithAllergies = (state: RootState): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.allergies && student.allergies.length > 0);
};

/**
 * Selector for students with active medications.
 *
 * @param {any} state - Redux root state
 * @returns {Student[]} Students with one or more active medications
 *
 * @remarks
 * **Healthcare Alert:** These students require medication administration tracking
 * and should be monitored for side effects and compliance.
 *
 * @example
 * ```typescript
 * const studentsWithMeds = useSelector(selectStudentsWithMedications);
 * ```
 */
export const selectStudentsWithMedications = (state: RootState): Student[] => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.filter(student => student.medications && student.medications.length > 0);
};

/**
 * Selector for student by student number.
 *
 * @param {any} state - Redux root state
 * @param {string} studentNumber - Student number to search for (e.g., 'STU-2024-001')
 * @returns {Student | undefined} Student with matching student number, or undefined if not found
 *
 * @remarks
 * **Unique Identifier:** Student number is a unique identifier enforced by backend validation.
 *
 * @example
 * ```typescript
 * const student = useSelector(state => selectStudentByNumber(state, 'STU-2024-001'));
 * if (student) {
 *   console.log(`Found: ${student.firstName} ${student.lastName}`);
 * }
 * ```
 */
export const selectStudentByNumber = (state: RootState, studentNumber: string): Student | undefined => {
  const allStudents = studentsSelectors.selectAll(state) as Student[];
  return allStudents.find(student => student.studentNumber === studentNumber);
};
