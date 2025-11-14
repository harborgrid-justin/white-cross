/**
 * @module stores/slices/students
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
 *
 * @example
 * ```typescript
 * // Configure Redux store
 * import { studentsReducer } from '@/stores/slices/students';
 *
 * const store = configureStore({
 *   reducer: {
 *     students: studentsReducer,
 *     // ... other reducers
 *   }
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Fetch students in a component
 * import { studentsThunks, selectPaginatedStudents } from '@/stores/slices/students';
 *
 * function StudentsList() {
 *   const dispatch = useDispatch();
 *   const students = useSelector(selectPaginatedStudents);
 *
 *   useEffect(() => {
 *     dispatch(studentsThunks.fetchAll());
 *   }, [dispatch]);
 *
 *   return (
 *     <div>
 *       {students.map(student => (
 *         <StudentCard key={student.id} student={student} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use UI actions for filtering and sorting
 * import { studentsActions } from '@/stores/slices/students';
 *
 * function StudentFilters() {
 *   const dispatch = useDispatch();
 *
 *   const handleGradeFilter = (grade: string) => {
 *     dispatch(studentsActions.setFilters({ grade }));
 *   };
 *
 *   const handleSortChange = (sortBy: 'name' | 'grade') => {
 *     dispatch(studentsActions.setSorting({ sortBy, sortOrder: 'asc' }));
 *   };
 *
 *   return (
 *     <div>
 *       <GradeFilter onChange={handleGradeFilter} />
 *       <SortSelector onChange={handleSortChange} />
 *     </div>
 *   );
 * }
 * ```
 */

// ============================================================================
// Type Exports
// ============================================================================

export type {
  StudentsState,
  StudentUIState,
  RootState,
  StudentFilters,
  PaginationInfo,
  SortConfig,
  PaginationConfig,
} from './types';

// ============================================================================
// Core Slice Exports
// ============================================================================

/**
 * Students reducer for Redux store configuration.
 *
 * @exports studentsReducer
 *
 * @example
 * ```typescript
 * const store = configureStore({
 *   reducer: {
 *     students: studentsReducer,
 *   }
 * });
 * ```
 */
export { studentsReducer } from './entity-slice';

/**
 * Students Redux slice instance.
 *
 * @exports studentsSlice
 */
export { studentsSlice } from './entity-slice';

/**
 * Combined action creators (entity + UI actions).
 *
 * Includes both CRUD actions from entity factory and UI actions for
 * selection, filtering, sorting, and pagination.
 *
 * @exports studentsActions
 *
 * @example
 * ```typescript
 * // Entity actions
 * dispatch(studentsActions.fetchAll());
 * dispatch(studentsActions.create(studentData));
 * dispatch(studentsActions.update({ id, data }));
 *
 * // UI actions
 * dispatch(studentsActions.selectStudent('student-123'));
 * dispatch(studentsActions.setFilters({ grade: '5' }));
 * dispatch(studentsActions.setSorting({ sortBy: 'name', sortOrder: 'asc' }));
 * ```
 */
export { studentsActions } from './entity-slice';

/**
 * Async thunks for student CRUD operations.
 *
 * All thunks handle loading states, error handling, and response normalization.
 *
 * @exports studentsThunks
 *
 * @example
 * ```typescript
 * // Fetch all students
 * dispatch(studentsThunks.fetchAll({ grade: '5' }));
 *
 * // Fetch single student
 * dispatch(studentsThunks.fetchById('student-123'));
 *
 * // Create new student
 * dispatch(studentsThunks.create(newStudentData));
 *
 * // Update student
 * dispatch(studentsThunks.update({ id: 'student-123', data: { grade: '6' } }));
 *
 * // Delete student (soft delete)
 * dispatch(studentsThunks.delete('student-123'));
 * ```
 */
export { studentsThunks } from './entity-slice';

/**
 * Entity adapter selectors for normalized state access.
 *
 * Provides efficient selectors for basic entity operations:
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
 * const studentIds = useSelector(studentsSelectors.selectIds);
 * ```
 */
export { studentsSelectors } from './entity-slice';

// ============================================================================
// Selector Exports
// ============================================================================

/**
 * Basic UI state selectors.
 *
 * Simple selectors for accessing UI state properties directly.
 */
export {
  selectStudentUIState,
  selectSelectedStudentIds,
  selectStudentViewMode,
  selectStudentFilters,
  selectStudentSort,
  selectStudentPagination,
  selectStudentSearchQuery,
  selectShowInactiveStudents,
  selectIsBulkSelectMode,
  selectExpandedStudentCards,
} from './basic-selectors';

/**
 * Complex computed selectors.
 *
 * Selectors that perform filtering, sorting, pagination, and other computations.
 * These should be memoized with reselect in production for optimal performance.
 */
export {
  selectFilteredAndSortedStudents,
  selectPaginatedStudents,
  selectStudentPaginationInfo,
  selectSelectedStudents,
  selectActiveStudents,
  selectStudentsByGrade,
  selectStudentsByNurse,
  selectStudentsWithAllergies,
  selectStudentsWithMedications,
  selectStudentByNumber,
} from './computed-selectors';

// ============================================================================
// Internal Module Exports (for testing and advanced usage)
// ============================================================================

/**
 * API service adapter.
 *
 * Exported for testing and advanced usage scenarios. Most applications should
 * use the thunks instead of calling the API service directly.
 *
 * @exports studentsApiService
 */
export { studentsApiService } from './api-service';

/**
 * Initial UI state.
 *
 * Exported for testing and state reset scenarios.
 *
 * @exports initialUIState
 */
export { initialUIState } from './ui-state-config';

/**
 * Students slice factory instance.
 *
 * Exported for advanced usage and testing. Provides direct access to the
 * entity slice factory configuration.
 *
 * @exports studentsSliceFactory
 */
export { studentsSliceFactory } from './entity-slice';
