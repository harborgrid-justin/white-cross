/**
 * @fileoverview Redux Store Hooks - Type-safe hooks for Redux store access
 * @module stores/hooks
 * @category Store
 *
 * Pre-configured, type-safe Redux hooks for use throughout the application.
 * These hooks provide full TypeScript inference for state and dispatch,
 * eliminating the need to manually type useSelector and useDispatch calls.
 *
 * Benefits over plain Redux hooks:
 * - **Type Safety**: Full TypeScript inference for state shape
 * - **Auto-complete**: IDE suggestions for all state properties
 * - **Thunk Support**: Properly typed async thunks with AppDispatch
 * - **Reduced Boilerplate**: No need to type hooks in every component
 * - **Consistent Usage**: Enforces standardized store access patterns
 *
 * Usage Guidelines:
 * - **Always** use these hooks instead of plain react-redux hooks
 * - Use in client components only (mark with 'use client' in Next.js)
 * - Prefer selector functions for complex state selections
 * - Use memoized selectors (createSelector) for derived data
 *
 * @example
 * ```typescript
 * 'use client';
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks';
 * import { fetchStudents } from '@/stores/slices/students';
 *
 * function StudentList() {
 *   // Fully typed selector with autocomplete
 *   const students = useAppSelector(state => state.students.entities);
 *   const loading = useAppSelector(state => state.students.loading);
 *
 *   // Fully typed dispatch with thunk support
 *   const dispatch = useAppDispatch();
 *
 *   useEffect(() => {
 *     dispatch(fetchStudents());
 *   }, [dispatch]);
 *
 *   return <div>{Object.values(students).map(s => s.name)}</div>;
 * }
 * ```
 *
 * @see {@link store} for store configuration
 * @see {@link RootState} for complete state shape
 * @see {@link AppDispatch} for dispatch type including thunks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Type-safe useDispatch hook with full thunk support.
 *
 * Use this hook instead of the plain `useDispatch` from react-redux.
 * Provides full TypeScript inference for dispatching actions and async thunks.
 *
 * @function useAppDispatch
 * @returns {AppDispatch} Typed dispatch function that supports standard actions and thunks
 *
 * @example
 * ```typescript
 * import { useAppDispatch } from '@/stores/hooks';
 * import { addStudent, fetchStudents } from '@/stores/slices/students';
 *
 * function MyComponent() {
 *   const dispatch = useAppDispatch();
 *
 *   // Dispatch synchronous action
 *   const handleAdd = () => {
 *     dispatch(addStudent({ id: '1', name: 'John' }));
 *   };
 *
 *   // Dispatch async thunk
 *   const handleFetch = async () => {
 *     const result = await dispatch(fetchStudents()).unwrap();
 *     console.log('Fetched students:', result);
 *   };
 *
 *   return <button onClick={handleFetch}>Load Students</button>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with error handling
 * const dispatch = useAppDispatch();
 *
 * try {
 *   const result = await dispatch(updateStudent({ id, data })).unwrap();
 *   toast.success('Student updated');
 * } catch (error) {
 *   toast.error('Failed to update student');
 * }
 * ```
 *
 * @remarks
 * - Includes full type safety for Redux Toolkit async thunks
 * - Dispatch calls return promises for async operations
 * - Use `.unwrap()` to get the actual result and handle errors
 * - Compatible with Redux DevTools for action tracking
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Type-safe useSelector hook with full state inference.
 *
 * Use this hook instead of the plain `useSelector` from react-redux.
 * Provides full TypeScript inference for the entire Redux state tree,
 * enabling IDE autocomplete and type checking.
 *
 * @type {TypedUseSelectorHook<RootState>}
 * @function useAppSelector
 *
 * @template TSelected - The type of the selected state value
 * @param {(state: RootState) => TSelected} selector - Function to select state
 * @param {EqualityFn<TSelected>} [equalityFn] - Optional equality function for optimization
 * @returns {TSelected} The selected state value
 *
 * @example
 * ```typescript
 * import { useAppSelector } from '@/stores/hooks';
 *
 * function StudentCount() {
 *   // Simple state selection with full type inference
 *   const studentCount = useAppSelector(state =>
 *     Object.keys(state.students.entities).length
 *   );
 *
 *   return <div>Total Students: {studentCount}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Selecting multiple state slices
 * function Dashboard() {
 *   const students = useAppSelector(state => state.students.entities);
 *   const loading = useAppSelector(state => state.students.loading);
 *   const error = useAppSelector(state => state.students.error);
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error} />;
 *
 *   return <StudentList students={Object.values(students)} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with selector functions
 * import { selectAllStudents } from '@/stores/slices/students';
 *
 * function StudentList() {
 *   // Use predefined selector for cleaner code
 *   const students = useAppSelector(selectAllStudents);
 *
 *   return <div>{students.map(s => <StudentCard key={s.id} student={s} />)}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using with custom equality function for optimization
 * import { shallowEqual } from 'react-redux';
 *
 * function StudentFilters() {
 *   // Prevent re-renders when filter object identity changes but values are same
 *   const filters = useAppSelector(
 *     state => state.students.filters,
 *     shallowEqual
 *   );
 *
 *   return <FilterPanel filters={filters} />;
 * }
 * ```
 *
 * @remarks
 * - Selector function is called on every state change
 * - Component re-renders when selected value changes (by reference)
 * - Use memoized selectors (createSelector from reselect) for computed values
 * - Custom equality functions prevent unnecessary re-renders
 * - Avoid selecting entire slices unless necessary (select specific fields)
 *
 * @see {@link https://react-redux.js.org/api/hooks#useselector|React Redux useSelector}
 * @see {@link https://github.com/reduxjs/reselect|Reselect for memoized selectors}
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
