/**
 * WF-COMP-334 | entity-types.ts - Entity and data structure types
 * Purpose: Generic entity and data structure types for state management
 * Upstream: React, TypeScript | Dependencies: Core utility types
 * Downstream: Redux stores, Context providers | Called by: State slices
 * Related: Normalized state, selection, filtering
 * Exports: EntityState, FilterState, SelectionState, async thunk config
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: Entity normalization → Selection management → Filter operations
 * LLM Context: Entity and collection management types for normalized state
 */

import type { AsyncThunk, SerializedError } from '@reduxjs/toolkit';
import type { ErrorState } from './utility-types';

/**
 * Generic filter state
 * Provides type-safe filtering with active filters tracking
 *
 * @template T - Type of filter values
 *
 * @example
 * ```typescript
 * interface IncidentFilters {
 *   type?: IncidentType;
 *   severity?: IncidentSeverity;
 *   dateFrom?: string;
 *   dateTo?: string;
 * }
 *
 * const filterState: FilterState<IncidentFilters> = {
 *   filters: { type: 'INJURY', severity: 'HIGH' },
 *   activeFilters: ['type', 'severity'],
 *   isFiltered: true
 * };
 * ```
 */
export interface FilterState<T extends Record<string, unknown>> {
  /** Current filter values */
  filters: Partial<T>;
  /** Keys of currently active filters */
  activeFilters: Array<keyof T>;
  /** Whether any filters are applied */
  isFiltered: boolean;
  /** Saved filter presets */
  presets?: Array<{
    id: string;
    name: string;
    filters: Partial<T>;
  }>;
}

/**
 * Generic selection state
 * Tracks selected items with efficient lookup
 *
 * @template T - Type of selectable items
 *
 * @example
 * ```typescript
 * const selectionState: SelectionState<IncidentReport> = {
 *   selectedIds: ['id1', 'id2', 'id3'],
 *   selectedItems: [incident1, incident2, incident3],
 *   selectAll: false,
 *   count: 3
 * };
 * ```
 */
export interface SelectionState<T extends { id: string }> {
  /** Array of selected item IDs */
  selectedIds: string[];
  /** Array of selected item objects */
  selectedItems: T[];
  /** Whether all items are selected */
  selectAll: boolean;
  /** Number of selected items */
  count: number;
  /** Set of IDs excluded when selectAll is true */
  excludedIds?: Set<string>;
}

/**
 * Normalized entity state
 * Stores entities in a normalized structure for efficient lookup and updates
 *
 * @template T - Entity type with id property
 *
 * @example
 * ```typescript
 * const incidentState: EntityState<IncidentReport> = {
 *   ids: ['id1', 'id2', 'id3'],
 *   entities: {
 *     'id1': { id: 'id1', ... },
 *     'id2': { id: 'id2', ... },
 *     'id3': { id: 'id3', ... }
 *   }
 * };
 * ```
 */
export interface EntityState<T extends { id: string }> {
  /** Ordered array of entity IDs */
  ids: string[];
  /** Map of entities by ID */
  entities: Record<string, T>;
}

/**
 * Custom AsyncThunk configuration
 * Provides proper typing for thunkAPI parameter in async thunks
 */
export interface AsyncThunkConfig {
  /** State type */
  state: Record<string, unknown>; // Will be overridden by specific RootState
  /** Dispatch type */
  dispatch?: ((action: unknown) => unknown);
  /** Extra argument type */
  extra?: unknown;
  /** Rejected value type */
  rejectValue: ErrorState;
  /** Serialized error type */
  serializedErrorType?: SerializedError;
  /** Pending meta type */
  pendingMeta?: unknown;
  /** Fulfilled meta type */
  fulfilledMeta?: unknown;
  /** Rejected meta type */
  rejectedMeta?: unknown;
}

/**
 * Type helper for async thunk return type
 *
 * @template Returned - Type returned on success
 * @template ThunkArg - Type of thunk argument
 */
export type AppAsyncThunk<Returned, ThunkArg = void> = AsyncThunk<
  Returned,
  ThunkArg,
  AsyncThunkConfig
>;

// Re-export for convenience
export type { SerializedError } from '@reduxjs/toolkit';
