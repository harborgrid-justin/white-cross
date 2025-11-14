/**
 * WF-COMP-334 | state-helpers.ts - State utility functions and type guards
 * Purpose: Utility functions for state management operations
 * Upstream: State types, utility types | Dependencies: Core state interfaces
 * Downstream: Redux slices, React hooks | Called by: State operations
 * Related: Loading states, pagination, entity management, type guards
 * Exports: Helper functions, type guards, initial state creators
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: State initialization → Type checking → State updates
 * LLM Context: State management utility functions for consistent state operations
 */

import type {
  LoadingState,
  ErrorState,
  PaginationState,
  FormState
} from './utility-types';
import type {
  EntityState,
  FilterState,
  SelectionState
} from './entity-types';

// =====================
// STATE GUARD FUNCTIONS
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
// INITIAL STATE HELPERS
// =====================

/**
 * Create initial loading state
 * Provides a consistent initial state for loading operations
 *
 * @returns Initial loading state
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
 * @param pageSize - Default page size
 * @returns Initial pagination state
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
 * @returns Empty entity state
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
 * @returns Empty selection state
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
 * @param defaultFilters - Default filter values
 * @returns Initial filter state
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

/**
 * Create initial form state
 *
 * @param initialData - Initial form data
 * @returns Initial form state
 */
export function createInitialFormState<T>(initialData: T): FormState<T> {
  return {
    data: initialData,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
    isDirty: false,
  };
}

// =====================
// STATE UPDATE HELPERS
// =====================

/**
 * Update pagination state with new values
 *
 * @param currentState - Current pagination state
 * @param updates - Pagination updates
 * @returns Updated pagination state
 */
export function updatePaginationState(
  currentState: PaginationState,
  updates: Partial<PaginationState>
): PaginationState {
  const newState = { ...currentState, ...updates };
  
  // Recalculate dependent values
  newState.totalPages = Math.ceil(newState.totalItems / newState.pageSize);
  newState.hasNextPage = newState.currentPage < newState.totalPages;
  newState.hasPreviousPage = newState.currentPage > 1;
  
  return newState;
}

/**
 * Update entity state by adding or updating entities
 *
 * @param state - Current entity state
 * @param entities - Entities to add/update
 * @returns Updated entity state
 */
export function updateEntityState<T extends { id: string }>(
  state: EntityState<T>,
  entities: T[]
): EntityState<T> {
  const newEntities = { ...state.entities };
  const newIds = [...state.ids];
  
  entities.forEach(entity => {
    if (!newEntities[entity.id]) {
      newIds.push(entity.id);
    }
    newEntities[entity.id] = entity;
  });
  
  return {
    ids: newIds,
    entities: newEntities
  };
}

/**
 * Remove entities from entity state
 *
 * @param state - Current entity state
 * @param entityIds - IDs of entities to remove
 * @returns Updated entity state
 */
export function removeEntitiesFromState<T extends { id: string }>(
  state: EntityState<T>,
  entityIds: string[]
): EntityState<T> {
  const newEntities = { ...state.entities };
  const removeSet = new Set(entityIds);
  
  entityIds.forEach(id => {
    delete newEntities[id];
  });
  
  return {
    ids: state.ids.filter(id => !removeSet.has(id)),
    entities: newEntities
  };
}

/**
 * Update selection state
 *
 * @param state - Current selection state
 * @param selectedIds - New selected IDs
 * @param allItems - All available items (for getting selected items)
 * @returns Updated selection state
 */
export function updateSelectionState<T extends { id: string }>(
  state: SelectionState<T>,
  selectedIds: string[],
  allItems: T[]
): SelectionState<T> {
  const idSet = new Set(selectedIds);
  const selectedItems = allItems.filter(item => idSet.has(item.id));
  
  return {
    selectedIds,
    selectedItems,
    selectAll: false, // Reset selectAll when individual selection changes
    count: selectedIds.length
  };
}

/**
 * Toggle selection for an item
 *
 * @param state - Current selection state
 * @param itemId - ID of item to toggle
 * @param item - Item object (if selecting)
 * @returns Updated selection state
 */
export function toggleItemSelection<T extends { id: string }>(
  state: SelectionState<T>,
  itemId: string,
  item?: T
): SelectionState<T> {
  const isSelected = state.selectedIds.includes(itemId);
  
  if (isSelected) {
    // Remove from selection
    return {
      ...state,
      selectedIds: state.selectedIds.filter(id => id !== itemId),
      selectedItems: state.selectedItems.filter(item => item.id !== itemId),
      count: state.count - 1,
      selectAll: false
    };
  } else if (item) {
    // Add to selection
    return {
      ...state,
      selectedIds: [...state.selectedIds, itemId],
      selectedItems: [...state.selectedItems, item],
      count: state.count + 1,
      selectAll: false
    };
  }
  
  return state;
}
