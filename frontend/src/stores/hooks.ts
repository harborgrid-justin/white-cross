/**
 * Redux Store Hooks - Type-safe React hooks for Redux store access
 *
 * Provides pre-configured, type-safe hooks for interacting with the Redux store.
 * These hooks automatically infer RootState and AppDispatch types, providing
 * full TypeScript support and IDE autocomplete throughout the application.
 *
 * Benefits:
 * - Full TypeScript type inference
 * - No need to manually type state or dispatch
 * - Consistent hook usage across the application
 * - Prevents runtime type errors
 *
 * @module stores/hooks
 * @category Store
 *
 * @example
 * ```typescript
 * import { useAppDispatch, useAppSelector, useStore } from '@/stores/hooks';
 *
 * function MyComponent() {
 *   // Type-safe selector
 *   const user = useAppSelector(state => state.auth.user);
 *
 *   // Type-safe dispatch
 *   const dispatch = useAppDispatch();
 *
 *   // Full store access (rarely needed)
 *   const fullState = useStore();
 * }
 * ```
 *
 * @see {@link module:stores/hooks/reduxHooks} for additional typed hooks
 * @see {@link module:stores/hooks/typedHooks} for advanced memoized hooks
 */

import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './types';

/**
 * Type-safe dispatch hook for Redux actions.
 *
 * Returns a dispatch function that is pre-typed with AppDispatch,
 * providing full type safety for all action creators and thunks.
 *
 * Features:
 * - Automatically typed with AppDispatch
 * - Works with sync and async actions
 * - Full IDE autocomplete support
 *
 * @returns {AppDispatch} Typed dispatch function
 *
 * @example
 * ```typescript
 * function LoginForm() {
 *   const dispatch = useAppDispatch();
 *
 *   const handleLogin = async (credentials) => {
 *     // dispatch is fully typed - no manual typing needed
 *     await dispatch(loginUser(credentials));
 *   };
 *
 *   return <form onSubmit={handleLogin}>...</form>;
 * }
 * ```
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Type-safe selector hook for accessing Redux state.
 *
 * Returns the result of a selector function with full type inference
 * for RootState. Automatically re-renders when selected state changes.
 *
 * Features:
 * - Automatically typed with RootState
 * - Full IDE autocomplete for state shape
 * - Efficient re-rendering (only when selected state changes)
 *
 * Performance:
 * - Uses shallow equality by default
 * - For deep equality, use custom equality function as second parameter
 *
 * @type {TypedUseSelectorHook<RootState>}
 *
 * @example
 * ```typescript
 * function UserProfile() {
 *   // Simple selector - full type inference
 *   const user = useAppSelector(state => state.auth.user);
 *   const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
 *
 *   // With memoized selector
 *   const activeStudents = useAppSelector(selectActiveStudents);
 *
 *   // With custom equality (for objects/arrays)
 *   const students = useAppSelector(
 *     state => state.students.items,
 *     shallowEqual
 *   );
 *
 *   return <div>{user?.name}</div>;
 * }
 * ```
 *
 * @see {@link useShallowSelector} for shallow equality by default
 * @see {@link useMemoizedSelector} for inline memoized selectors
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to access the entire Redux store state.
 *
 * Returns the complete RootState object. Use sparingly - prefer
 * useAppSelector with specific selectors for better performance
 * and to avoid unnecessary re-renders.
 *
 * Use Cases:
 * - Debugging and development
 * - DevTools integration
 * - Special cases requiring full state access
 *
 * Performance Warning:
 * - Re-renders on ANY state change
 * - Prefer specific selectors for production code
 * - Only use when you genuinely need the full state
 *
 * @returns {RootState} Complete Redux store state
 *
 * @example
 * ```typescript
 * function DebugPanel() {
 *   const fullState = useStore();
 *
 *   // Good for debugging
 *   console.log('Current state:', fullState);
 *
 *   return <pre>{JSON.stringify(fullState, null, 2)}</pre>;
 * }
 *
 * // Better approach - use specific selectors
 * function UserPanel() {
 *   // Instead of: const state = useStore(); const user = state.auth.user;
 *   // Do this:
 *   const user = useAppSelector(state => state.auth.user);
 * }
 * ```
 */
export const useStore = () => {
  return useAppSelector(state => state);
};
