/**
 * @module stores/slices/students/entity-slice
 *
 * Students Entity Slice
 *
 * Creates the combined Redux slice that merges entity state management (CRUD operations)
 * with UI state management (selection, filtering, sorting). Uses the entity slice factory
 * pattern for standardized backend integration while maintaining custom UI state.
 *
 * @remarks
 * **Hybrid Architecture:** Combines entity slice factory (normalized CRUD state) with
 * custom UI slice (view preferences, filters, selection) in a single Redux slice.
 *
 * **HIPAA Compliance:** Student records contain PHI. All operations trigger audit logging
 * in the backend API layer. PHI is excluded from localStorage persistence.
 *
 * **Cross-Tab Synchronization:** Uses BroadcastChannel API to sync student data changes
 * across browser tabs. When a nurse updates a student in one tab, other tabs can refresh.
 *
 * @since 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createEntitySlice } from '@/stores/sliceFactory';
import { Student, CreateStudentData, UpdateStudentData } from '@/types/student.types';
import { studentsApiService } from './api-service';
import { initialUIState } from './ui-state-config';
import { studentUIActions } from './ui-slice';
import { StudentFilters, StudentsState, RootState } from './types';

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
 * efficient O(1) lookups by ID.
 *
 * **Thunk Actions:** Automatically generates async thunks for fetchAll, fetchById,
 * create, update, delete, and bulk operations.
 *
 * @see {@link createEntitySlice} for factory implementation details
 */
export const studentsSliceFactory = createEntitySlice<Student, CreateStudentData, UpdateStudentData>(
  'students',
  studentsApiService,
  {
    enableBulkOperations: true,
  }
);

/**
 * Combined students slice (entity + UI state).
 *
 * Merges entity slice from factory with custom UI slice to provide unified state
 * management for both student data and UI preferences.
 *
 * @const
 *
 * @remarks
 * **State Structure:**
 * - ids: string[] - Ordered array of student IDs (EntityAdapter)
 * - entities: Record<string, Student> - Normalized student entities (EntityAdapter)
 * - ui: StudentUIState - Custom UI state (selection, filters, sorting, pagination)
 * - loading, error, etc. - Standard loading states from entity factory
 *
 * **Reducer Integration:** Uses extraReducers to forward entity actions to the
 * factory reducer while preserving UI state. This allows both entity and UI
 * reducers to operate on the same slice.
 */
const combinedStudentsSlice = createSlice({
  name: 'students',
  initialState: {
    ...(studentsSliceFactory.slice.getInitialState() || {}),
    ui: initialUIState,
  } as StudentsState,
  reducers: {
    // UI reducers - integrated directly into combined slice
    /**
     * Selects a single student (adds to selection if not already selected).
     */
    selectStudent: (state, action: PayloadAction<string>) => {
      if (!state.ui.selectedIds.includes(action.payload)) {
        state.ui.selectedIds.push(action.payload);
      }
    },

    /**
     * Deselects a single student (removes from selection).
     */
    deselectStudent: (state, action: PayloadAction<string>) => {
      state.ui.selectedIds = state.ui.selectedIds.filter((id: string) => id !== action.payload);
    },

    /**
     * Selects multiple students (adds to existing selection).
     */
    selectMultipleStudents: (state, action: PayloadAction<string[]>) => {
      const newIds = action.payload.filter(id => !state.ui.selectedIds.includes(id));
      state.ui.selectedIds.push(...newIds);
    },

    /**
     * Selects all students (replaces current selection).
     */
    selectAllStudents: (state, action: PayloadAction<string[]>) => {
      state.ui.selectedIds = action.payload;
    },

    /**
     * Clears all student selections.
     */
    clearSelection: (state) => {
      state.ui.selectedIds = [];
    },

    /**
     * Toggles bulk select mode on/off.
     */
    toggleBulkSelectMode: (state) => {
      state.ui.bulkSelectMode = !state.ui.bulkSelectMode;
      if (!state.ui.bulkSelectMode) {
        state.ui.selectedIds = [];
      }
    },

    /**
     * Sets the view mode for student display.
     */
    setViewMode: (state, action: PayloadAction<'grid' | 'list' | 'table'>) => {
      state.ui.viewMode = action.payload;
    },

    /**
     * Toggles card expansion for a student in card view.
     */
    toggleCardExpansion: (state, action: PayloadAction<string>) => {
      const studentId = action.payload;
      if (state.ui.expandedCards.includes(studentId)) {
        state.ui.expandedCards = state.ui.expandedCards.filter((id: string) => id !== studentId);
      } else {
        state.ui.expandedCards.push(studentId);
      }
    },

    /**
     * Collapses all student cards.
     */
    collapseAllCards: (state) => {
      state.ui.expandedCards = [];
    },

    /**
     * Sets filter criteria for students.
     */
    setFilters: (state, action: PayloadAction<Partial<StudentFilters>>) => {
      state.ui.filters = { ...state.ui.filters, ...action.payload };
      state.ui.currentPage = 1;
    },

    /**
     * Clears all active filters.
     */
    clearFilters: (state) => {
      state.ui.filters = {};
      state.ui.currentPage = 1;
    },

    /**
     * Sets search query for text-based filtering.
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.ui.searchQuery = action.payload;
      state.ui.currentPage = 1;
    },

    /**
     * Toggles visibility of inactive students.
     */
    toggleShowInactive: (state) => {
      state.ui.showInactive = !state.ui.showInactive;
      state.ui.currentPage = 1;
    },

    /**
     * Sets sorting criteria for students.
     */
    setSorting: (state, action: PayloadAction<{ sortBy: 'name' | 'grade' | 'enrollmentDate' | 'lastVisit'; sortOrder: 'asc' | 'desc' }>) => {
      state.ui.sortBy = action.payload.sortBy;
      state.ui.sortOrder = action.payload.sortOrder;
    },

    /**
     * Toggles sort order between ascending and descending.
     */
    toggleSortOrder: (state) => {
      state.ui.sortOrder = state.ui.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    /**
     * Sets the current page number.
     */
    setPage: (state, action: PayloadAction<number>) => {
      state.ui.currentPage = action.payload;
    },

    /**
     * Sets the number of items per page.
     */
    setPageSize: (state, action: PayloadAction<number>) => {
      state.ui.pageSize = action.payload;
      state.ui.currentPage = 1;
    },

    /**
     * Navigates to the next page.
     */
    nextPage: (state) => {
      state.ui.currentPage += 1;
    },

    /**
     * Navigates to the previous page.
     */
    previousPage: (state) => {
      if (state.ui.currentPage > 1) {
        state.ui.currentPage -= 1;
      }
    },

    /**
     * Resets all UI state to initial values.
     */
    resetUIState: (state) => {
      state.ui = initialUIState;
    },
  },
  extraReducers: (builder) => {
    // Copy all extra reducers from the entity slice
    // This forwards entity-related actions to the factory reducer
    const entitySliceReducer = studentsSliceFactory.slice.reducer;
    builder.addMatcher(
      (action) => action.type.startsWith('students/'),
      (state, action) => {
        // Apply entity reducer to state without UI
        const entityState = entitySliceReducer(
          { ...state, ui: undefined } as never,
          action
        );
        // Merge entity state changes with preserved UI state
        return {
          ...(entityState || {}),
          ui: state.ui,
        } as StudentsState;
      }
    );
  },
});

/**
 * Students Redux slice.
 *
 * Combined slice with entity and UI state management.
 *
 * @exports studentsSlice
 */
export const studentsSlice = combinedStudentsSlice;

/**
 * Students reducer for Redux store.
 *
 * Use this reducer when configuring the Redux store.
 *
 * @exports studentsReducer
 *
 * @example
 * ```typescript
 * const store = configureStore({
 *   reducer: {
 *     students: studentsReducer,
 *     // ... other reducers
 *   }
 * });
 * ```
 */
export const studentsReducer = combinedStudentsSlice.reducer;

/**
 * Action creators for student state updates.
 *
 * Includes both entity actions (CRUD) from the factory and UI actions
 * (selection, filtering, sorting, pagination) from the custom reducers.
 *
 * @exports studentsActions
 *
 * @example
 * ```typescript
 * // Entity actions
 * dispatch(studentsActions.fetchAll());
 * dispatch(studentsActions.create(newStudent));
 *
 * // UI actions
 * dispatch(studentsActions.selectStudent('student-123'));
 * dispatch(studentsActions.setFilters({ grade: '5' }));
 * ```
 */
export const studentsActions = {
  ...studentsSliceFactory.actions,
  ...studentUIActions,
};

/**
 * Entity adapter selectors for normalized student state.
 *
 * Provides efficient selectors for accessing students from normalized state:
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
 * const totalCount = useSelector(state => studentsSelectors.selectTotal(state));
 * ```
 */
export const studentsSelectors = studentsSliceFactory.adapter.getSelectors(
  (state: RootState) => state.students
);

/**
 * Async thunks for student API operations.
 *
 * Provides thunks for all CRUD operations from entity slice factory.
 * All thunks handle loading states, error handling, and response normalization.
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
 *
 * // Update student
 * dispatch(studentsThunks.update({ id: 'student-123', data: { grade: '6' } }));
 *
 * // Delete student (soft delete)
 * dispatch(studentsThunks.delete('student-123'));
 * ```
 */
export const studentsThunks = studentsSliceFactory.thunks;
