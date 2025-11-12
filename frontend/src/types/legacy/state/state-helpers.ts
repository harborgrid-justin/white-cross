/**
 * WF-COMP-334 | state-helpers.ts - State utility functions and guards
 * Purpose: Helper functions for state management operations
 * Upstream: utility-state.ts | Dependencies: State type definitions
 * Downstream: Components, Redux slices | Called by: State consumers
 * Related: utility-state.ts, redux-state.ts
 * Exports: Type guards, state creators | Key Features: Runtime type checking
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: State check → Type narrowing → Safe access
 * LLM Context: Runtime helpers and type guards for state management
 */

/**
 * State Helper Functions
 *
 * Utility functions for working with state types, including type guards,
 * state creators, and validation helpers. These functions provide runtime
 * type checking and convenient state initialization.
 *
 * @module types/state/state-helpers
 */

import type {
  LoadingState,
  PaginationState,
  EntityState,
  SelectionState,
  FilterState,
} from './utility-state';

// =====================
// TYPE GUARD FUNCTIONS
// =====================

/**
 * Type guard to check if state is in loading state
 *
 * @param state - Loading state to check
 * @returns True if state is loading
 *
 * @example
 * ```typescript
 * if (isLoadingState(incidentState.loading)) {
 *   return <Spinner />;
 * }
 * ```
 */
export function isLoadingState<T>(state: LoadingState<T>): boolean {
  return state.status === 'pending' || state.isLoading;
}

/**
 * Type guard to check if state has an error
 *
 * @param state - Loading state to check
 * @returns True if state has error
 *
 * @example
 * ```typescript
 * if (isErrorState(incidentState.loading)) {
 *   return <ErrorMessage error={incidentState.loading.error} />;
 * }
 * ```
 */
export function isErrorState<T>(state: LoadingState<T>): state is LoadingState<T> & { error: NonNullable<T> } {
  return state.status === 'failed' && state.error !== null;
}

/**
 * Type guard to check if state has data
 * Checks if request succeeded and has completed at least once
 *
 * @param state - Loading state to check
 * @returns True if state has data
 *
 * @example
 * ```typescript
 * if (hasData(incidentState.loading)) {
 *   return <IncidentList incidents={incidents} />;
 * }
 * ```
 */
export function hasData<T>(state: LoadingState<T>): boolean {
  return state.status === 'succeeded' || (state.lastFetch !== undefined && state.lastFetch > 0);
}

/**
 * Check if cached data is stale
 * Determines if data should be refetched based on age
 *
 * @param state - Loading state with lastFetch timestamp
 * @param maxAge - Maximum age in milliseconds (default: 5 minutes)
 * @returns True if data is stale
 *
 * @example
 * ```typescript
 * if (isStale(incidentState.loading, 60000)) {
 *   dispatch(fetchIncidents());
 * }
 * ```
 */
export function isStale<T>(state: LoadingState<T>, maxAge: number = 5 * 60 * 1000): boolean {
  if (!state.lastFetch) return true;
  return Date.now() - state.lastFetch > maxAge;
}

/**
 * Check if state is idle (never loaded)
 *
 * @param state - Loading state to check
 * @returns True if state is idle
 *
 * @example
 * ```typescript
 * if (isIdleState(incidentState.loading)) {
 *   dispatch(fetchIncidents());
 * }
 * ```
 */
export function isIdleState<T>(state: LoadingState<T>): boolean {
  return state.status === 'idle' && state.lastFetch === undefined;
}

/**
 * Get loading progress as percentage
 * Calculates progress based on start and completion times
 *
 * @param state - Loading state with timestamps
 * @param estimatedDuration - Estimated duration in milliseconds
 * @returns Progress percentage (0-100)
 *
 * @example
 * ```typescript
 * const progress = getLoadingProgress(state, 3000);
 * return <ProgressBar value={progress} />;
 * ```
 */
export function getLoadingProgress<T>(
  state: LoadingState<T>,
  estimatedDuration: number = 2000
): number {
  if (!state.startedAt) return 0;
  if (state.completedAt) return 100;

  const elapsed = Date.now() - state.startedAt;
  const progress = (elapsed / estimatedDuration) * 100;
  return Math.min(progress, 99); // Cap at 99% until actually complete
}

// =====================
// INITIAL STATE CREATORS
// =====================

/**
 * Create initial loading state
 * Provides a consistent initial state for loading operations
 *
 * @template T - Type of error information
 * @returns Initial loading state
 *
 * @example
 * ```typescript
 * const initialState = {
 *   loading: createInitialLoadingState<ErrorState>(),
 *   data: []
 * };
 * ```
 */
export function createInitialLoadingState<T = string>(): LoadingState<T> {
  return {
    status: 'idle',
    isLoading: false,
    error: null,
    lastFetch: undefined,
    startedAt: undefined,
    completedAt: undefined,
  };
}

/**
 * Create initial pagination state
 *
 * @param pageSize - Default page size (default: 20)
 * @returns Initial pagination state
 *
 * @example
 * ```typescript
 * const paginationState = createInitialPaginationState(50);
 * ```
 */
export function createInitialPaginationState(pageSize: number = 20): PaginationState {
  return {
    currentPage: 1,
    pageSize,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

/**
 * Create initial entity state
 *
 * @template T - Entity type with id property
 * @returns Empty entity state
 *
 * @example
 * ```typescript
 * const entityState = createInitialEntityState<IncidentReport>();
 * ```
 */
export function createInitialEntityState<T extends { id: string }>(): EntityState<T> {
  return {
    ids: [],
    entities: {},
  };
}

/**
 * Create initial selection state
 *
 * @template T - Type of selectable items
 * @returns Empty selection state
 *
 * @example
 * ```typescript
 * const selectionState = createInitialSelectionState<IncidentReport>();
 * ```
 */
export function createInitialSelectionState<T extends { id: string }>(): SelectionState<T> {
  return {
    selectedIds: [],
    selectedItems: [],
    selectAll: false,
    count: 0,
  };
}

/**
 * Create initial filter state
 *
 * @template T - Type of filter values
 * @param defaultFilters - Default filter values
 * @returns Initial filter state
 *
 * @example
 * ```typescript
 * const filterState = createInitialFilterState<IncidentFilters>({
 *   severity: 'HIGH'
 * });
 * ```
 */
export function createInitialFilterState<T extends Record<string, unknown>>(
  defaultFilters: Partial<T> = {}
): FilterState<T> {
  return {
    filters: defaultFilters,
    activeFilters: [],
    isFiltered: false,
  };
}
