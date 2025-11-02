/**
 * @fileoverview Centralized Redux Store Exports
 * @module stores
 * @category State Management - Redux
 *
 * Barrel export file for Redux store, slices, and utilities.
 * Import Redux-related items from this single location for consistency.
 *
 * Store Organization:
 * - store: Main Redux store configuration
 * - slices: Domain-specific Redux slices
 * - hooks: Typed Redux hooks (useAppDispatch, useAppSelector)
 *
 * @example Using Redux store
 * ```typescript
 * import { store, useAppSelector, useAppDispatch } from '@/stores';
 *
 * function MyComponent() {
 *   const dispatch = useAppDispatch();
 *   const user = useAppSelector(state => state.auth.user);
 *   // ...
 * }
 * ```
 *
 * @example Using Redux Provider
 * ```typescript
 * import { ReduxProvider } from '@/stores';
 *
 * export default function App({ children }) {
 *   return (
 *     <ReduxProvider>
 *       {children}
 *     </ReduxProvider>
 *   );
 * }
 * ```
 */

// ==========================================
// STORE CONFIGURATION
// ==========================================

/**
 * Main Redux store instance and factory
 */
export {
  store,
  makeStore,
  type AppStore,
  type RootState,
  type AppDispatch,
} from './store';

// Alternative Redux store (if applicable)
export {
  store as reduxStore,
  type AppDispatch as ReduxDispatch,
  type RootState as ReduxRootState,
} from './reduxStore';

// ==========================================
// TYPED HOOKS
// ==========================================

/**
 * Type-safe Redux hooks
 * Use these instead of plain useDispatch and useSelector
 */
export {
  useAppDispatch,
  useAppSelector,
  useAppStore,
} from './hooks';

// ==========================================
// STORE PROVIDER
// ==========================================

/**
 * Redux Provider component
 * Wraps the app to provide Redux store
 */
export { StoreProvider, StoreProvider as ReduxProvider } from './StoreProvider';

// ==========================================
// SLICES
// ==========================================

/**
 * Redux slices (domain-specific state)
 * Import individual slices as needed
 */

// Auth slice
export {
  loginUser,
  logoutUser,
  refreshAuthToken,
  setUserFromSession,
  clearAuthError,
} from './slices/authSlice';

// Export other slices as needed
// Example:
// export * from './slices/studentsSlice';
// export * from './slices/medicationsSlice';

// ==========================================
// UTILITIES
// ==========================================

/**
 * Slice factory for creating standardized Redux slices
 */
export { createSliceWithStandardization } from './sliceFactory';

/**
 * Slice types
 */
export type * from './types';

// ==========================================
// DEFAULT EXPORT
// ==========================================

export default store;
