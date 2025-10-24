/**
 * Redux Store Type Definitions
 *
 * Centralized type exports to break circular dependencies in the Redux store architecture.
 * This file contains only type re-exports and has NO direct imports from store implementation files,
 * preventing circular dependency issues while providing a clean import interface.
 *
 * Architecture Pattern:
 * - Types are defined in their source files (e.g., reduxStore.ts)
 * - This file re-exports them as a single point of truth
 * - Other modules import from this file instead of implementation files
 *
 * Benefits:
 * - Eliminates circular dependency issues
 * - Provides consistent import paths
 * - Simplifies refactoring and maintenance
 * - Clear separation between types and implementation
 *
 * @module stores/types
 * @category Store
 *
 * @example
 * ```typescript
 * // Import from types (recommended)
 * import type { RootState, AppDispatch } from '@/stores/types';
 *
 * // Instead of importing from implementation
 * // import type { RootState, AppDispatch } from '@/stores/reduxStore'; // Avoid this
 *
 * // Use in component
 * function MyComponent() {
 *   const state = useAppSelector((state: RootState) => state.auth);
 *   const dispatch: AppDispatch = useAppDispatch();
 * }
 * ```
 *
 * @see {@link module:stores/reduxStore} for implementation details
 */

/**
 * Root state type for the Redux store.
 *
 * Represents the complete state tree of the application, including all slices and domains.
 * Use this type when accessing the full store state or writing selectors.
 *
 * State Structure:
 * - auth: Authentication and user session
 * - users, districts, schools: Administration
 * - students, healthRecords, medications: Healthcare
 * - incidentReports: Incident tracking
 * - inventory, documents, communication: Operations
 * - dashboard, reports, settings: Analytics and configuration
 * - compliance, accessControl: Security and compliance
 * - enterprise, orchestration: Advanced features
 *
 * @typedef {Object} RootState
 *
 * @example
 * ```typescript
 * // In a selector
 * const selectUserName = (state: RootState) => state.auth.user?.name;
 *
 * // In a component
 * const user = useAppSelector((state: RootState) => state.auth.user);
 * ```
 */
export type { RootState } from './reduxStore';

/**
 * Typed dispatch function for the Redux store.
 *
 * Use this type when you need to dispatch actions, especially async thunks.
 * Provides full type inference for all action creators and thunks.
 *
 * Features:
 * - Type-safe action dispatch
 * - Async thunk support with proper typing
 * - Middleware integration (state sync, monitoring)
 *
 * @typedef {Function} AppDispatch
 *
 * @example
 * ```typescript
 * // In a component
 * const dispatch: AppDispatch = useAppDispatch();
 * dispatch(loginUser(credentials)); // Fully typed
 *
 * // In a thunk
 * const myThunk = createAsyncThunk<ReturnType, ArgType>(
 *   'slice/action',
 *   async (arg, { dispatch }) => {
 *     // dispatch is properly typed as AppDispatch
 *     await dispatch(anotherThunk(data));
 *   }
 * );
 * ```
 */
export type { AppDispatch } from './reduxStore';
