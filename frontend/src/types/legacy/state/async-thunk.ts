/**
 * WF-COMP-334 | async-thunk.ts - Redux async thunk type definitions
 * Purpose: Type-safe async thunk configuration for Redux Toolkit
 * Upstream: @reduxjs/toolkit | Dependencies: Redux Toolkit types
 * Downstream: Redux slices, action creators | Called by: Thunk creators
 * Related: redux-state.ts, action-payloads.ts
 * Exports: AsyncThunkConfig, AppAsyncThunk | Key Features: Type-safe thunks
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: Thunk creation → Type inference → Dispatch → State update
 * LLM Context: Async thunk type configuration for Redux Toolkit
 */

/**
 * Async Thunk Type Definitions
 *
 * Type configurations for Redux Toolkit's createAsyncThunk.
 * Provides proper typing for thunkAPI parameter and return values.
 *
 * @module types/state/async-thunk
 */

import type { AsyncThunk, SerializedError, ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import type { ErrorState } from './utility-state';
import type { RootState } from './redux-state';

// =====================
// ASYNC THUNK CONFIG
// =====================

/**
 * Custom AsyncThunk configuration
 * Provides proper typing for thunkAPI parameter in async thunks
 *
 * @example
 * ```typescript
 * export const fetchIncidents = createAsyncThunk<
 *   IncidentReport[],
 *   void,
 *   AsyncThunkConfig
 * >(
 *   'incidents/fetch',
 *   async (_, { getState, rejectWithValue }) => {
 *     const state = getState(); // Properly typed as RootState
 *     // ...
 *   }
 * );
 * ```
 */
export interface AsyncThunkConfig {
  /** State type - the root Redux state */
  state: RootState;
  /** Dispatch type - Redux Toolkit thunk-aware dispatch */
  dispatch?: ThunkDispatch<RootState, unknown, AnyAction>;
  /** Extra argument type - for thunk middleware extra argument */
  extra?: unknown;
  /** Rejected value type - standardized error state */
  rejectValue: ErrorState;
  /** Serialized error type - Redux Toolkit's error type */
  serializedErrorType?: SerializedError;
  /** Pending meta type - metadata for pending actions */
  pendingMeta?: unknown;
  /** Fulfilled meta type - metadata for fulfilled actions */
  fulfilledMeta?: unknown;
  /** Rejected meta type - metadata for rejected actions */
  rejectedMeta?: unknown;
}

/**
 * Type helper for async thunk return type
 * Simplifies async thunk type declarations
 *
 * @template Returned - Type returned on success
 * @template ThunkArg - Type of thunk argument
 *
 * @example
 * ```typescript
 * export const fetchIncident: AppAsyncThunk<IncidentReport, string> =
 *   createAsyncThunk(
 *     'incidents/fetchOne',
 *     async (id: string) => {
 *       // ...
 *     }
 *   );
 * ```
 */
export type AppAsyncThunk<Returned, ThunkArg = void> = AsyncThunk<
  Returned,
  ThunkArg,
  AsyncThunkConfig
>;

// Re-export SerializedError for convenience
export type { SerializedError };
