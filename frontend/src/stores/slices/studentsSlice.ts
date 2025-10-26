/**
 * @fileoverview Students Slice - Re-export Module (Architectural Pattern)
 *
 * This file serves as a re-export facade for the canonical students Redux slice
 * located in the domain-driven store structure. It maintains backward compatibility
 * with legacy import paths while supporting the modern domain-driven architecture.
 *
 * @module stores/slices/studentsSlice
 *
 * @remarks
 * **Architectural Pattern: Domain-Driven Design with Re-export Facade**
 *
 * White Cross uses a hybrid Redux architecture that combines:
 * - **Core global stores** (`/stores/slices/`) - Authentication, users, system state
 * - **Feature-colocated stores** (`/pages/[feature]/store/`) - Domain-specific state
 *
 * Students state is feature-colocated at `/pages/students/store/studentsSlice.ts`
 * because it's tightly coupled with student management UI and workflows. This
 * re-export file maintains backward compatibility for legacy code that imports from
 * the global slices directory.
 *
 * **Benefits of This Pattern**:
 * 1. **Domain Cohesion**: Student state lives with student UI code
 * 2. **Modularity**: Feature code can be moved/extracted as a unit
 * 3. **Backward Compatibility**: Legacy imports continue working
 * 4. **Clear Ownership**: Students feature owns its state management
 * 5. **Reduced Global Namespace**: Only truly global state in `/stores/slices/`
 *
 * **HIPAA Compliance**: Student data contains PHI (names, DOB, health info).
 * The canonical implementation includes proper HIPAA safeguards:
 * - No localStorage persistence for PHI
 * - Audit logging for all access
 * - Cross-tab sync for data consistency
 * - Session-only storage
 *
 * **Migration Path**: New code should import directly from the canonical location
 * to avoid unnecessary indirection:
 *
 * ```typescript
 * // ✅ Preferred (direct import from canonical location)
 * import { studentsActions, studentsSelectors } from '@/pages/students/store/studentsSlice';
 *
 * // ⚠️ Legacy (re-export indirection - works but not preferred)
 * import { studentsActions, studentsSelectors } from '@/stores/slices/studentsSlice';
 * ```
 *
 * **Related Patterns**: Similar re-export patterns exist for other feature-colocated
 * slices like medications, appointments, and incident reports.
 *
 * @see {@link /pages/students/store/studentsSlice} for canonical implementation and comprehensive documentation
 * @see {@link CLAUDE.md} for architecture documentation on state management patterns
 * @see {@link /stores/index.ts} for Redux store configuration
 *
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // Importing from this re-export module (legacy pattern)
 * import { useDispatch, useSelector } from 'react-redux';
 * import {
 *   studentsActions,
 *   studentsSelectors,
 *   studentsThunks
 * } from '@/stores/slices/studentsSlice';
 *
 * function LegacyStudentComponent() {
 *   const dispatch = useDispatch();
 *   const students = useSelector(studentsSelectors.selectAll);
 *
 *   useEffect(() => {
 *     dispatch(studentsThunks.fetchAll());
 *   }, []);
 *
 *   return <StudentList students={students} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Importing directly from canonical location (preferred pattern)
 * import { useDispatch, useSelector } from 'react-redux';
 * import {
 *   studentsActions,
 *   studentsSelectors,
 *   studentsThunks
 * } from '@/pages/students/store/studentsSlice';
 *
 * function ModernStudentComponent() {
 *   const dispatch = useDispatch();
 *   const students = useSelector(studentsSelectors.selectAll);
 *
 *   useEffect(() => {
 *     dispatch(studentsThunks.fetchAll());
 *   }, []);
 *
 *   return <StudentList students={students} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using in Redux store configuration
 * import { configureStore } from '@reduxjs/toolkit';
 * import studentsReducer from '@/stores/slices/studentsSlice'; // Re-export
 * // or
 * import { studentsReducer } from '@/pages/students/store/studentsSlice'; // Canonical
 *
 * export const store = configureStore({
 *   reducer: {
 *     students: studentsReducer,
 *     // ... other reducers
 *   },
 * });
 * ```
 */

// Re-export everything from the canonical location
export {
  // Types
  type StudentUIState,
  type StudentFilters,

  // Slice
  studentsSlice,
  studentsReducer,

  // Actions
  studentsActions,

  // Selectors
  studentsSelectors,
  studentsThunks,
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
} from '../../pages/students/store/studentsSlice';

// Default export
export { studentsReducer as default } from '../../pages/students/store/studentsSlice';
