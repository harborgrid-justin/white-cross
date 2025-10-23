/**
 * @fileoverview Redux Hooks - Type-safe Redux hooks for the application
 * @module stores/hooks/reduxHooks
 * @category Store
 *
 * Provides type-safe versions of Redux hooks (useDispatch and useSelector)
 * that are pre-configured with the application's RootState and AppDispatch types.
 *
 * These hooks should be used throughout the application instead of the plain
 * Redux hooks to ensure full TypeScript type inference and type safety.
 *
 * @example
 * ```typescript
 * import { useAppSelector, useAppDispatch } from '@/stores/hooks/reduxHooks';
 *
 * function MyComponent() {
 *   // Type-safe selector - state is inferred as RootState
 *   const user = useAppSelector(state => state.auth.user);
 *
 *   // Type-safe dispatch - accepts AppDispatch actions
 *   const dispatch = useAppDispatch();
 *
 *   const handleLogin = () => {
 *     dispatch(loginUser(credentials)); // Fully typed!
 *   };
 * }
 * ```
 */

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../reduxStore';

/**
 * Type-safe version of useDispatch hook
 *
 * @hook
 * @returns {AppDispatch} Typed dispatch function
 *
 * @description
 * Use throughout the app instead of plain `useDispatch` for full type safety.
 * Ensures that all dispatched actions are compatible with the Redux store.
 *
 * @example
 * ```typescript
 * const dispatch = useAppDispatch();
 *
 * // Async actions
 * await dispatch(loginUser({ email, password }));
 *
 * // Sync actions
 * dispatch(setUser(userData));
 * ```
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Type-safe version of useSelector hook
 *
 * @hook
 * @template TSelected - Type of the selected value
 * @param {(state: RootState) => TSelected} selector - Selector function
 * @param {EqualityFn<TSelected>} [equalityFn] - Optional equality function
 * @returns {TSelected} Selected value from Redux state
 *
 * @description
 * Use throughout the app instead of plain `useSelector` for full type safety.
 * Automatically infers the RootState type for all selectors.
 *
 * @example
 * ```typescript
 * // Simple selector
 * const user = useAppSelector(state => state.auth.user);
 *
 * // With memoized selector
 * const students = useAppSelector(selectActiveStudents);
 *
 * // With equality function (for objects/arrays)
 * const students = useAppSelector(
 *   state => state.students.items,
 *   shallowEqual
 * );
 * ```
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Re-export useStore for advanced use cases
 * Generally, prefer useAppSelector and useAppDispatch over direct store access
 */
export { useStore } from 'react-redux';
