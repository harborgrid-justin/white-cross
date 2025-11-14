/**
 * WF-COMP-334 | utility-state.ts - Generic state utility types
 * Purpose: Reusable state management type definitions
 * Upstream: None (base types) | Dependencies: None
 * Downstream: Redux slices, Context providers | Called by: All state management
 * Related: redux-state.ts, context-state.ts, state-helpers.ts
 * Exports: Generic state interfaces and types | Key Features: Type-safe state patterns
 * Last Updated: 2025-11-12 | File Type: .ts
 * Critical Path: State definition → Type checking → Runtime validation
 * LLM Context: Generic utility types for state management, used across the application
 */

/**
 * Utility State Type Definitions
 *
 * Generic, reusable type definitions for common state management patterns.
 * These types provide type-safe wrappers for async operations, pagination,
 * filtering, sorting, and entity management.
 *
 * @module types/state/utility-state
 */

// =====================
// REQUEST STATUS TYPES
// =====================

/**
 * Request status enumeration for async operations
 * Used to track the lifecycle state of asynchronous requests
 *
 * @example
 * ```typescript
 * const [status, setStatus] = useState<RequestStatus>('idle');
 *
 * // During fetch
 * setStatus('pending');
 *
 * // On success
 * setStatus('succeeded');
 * ```
 */
export type RequestStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

/**
 * Loading state with granular status tracking
 * Provides detailed information about loading operations
 *
 * @template T - Type of error information
 */
export interface LoadingState<T = string> {
  /** Current request status */
  status: RequestStatus;
  /** Loading flag (convenience property) */
  isLoading: boolean;
  /** Error information if request failed */
  error: T | null;
  /** Timestamp of last successful request */
  lastFetch?: number;
  /** Timestamp when request started */
  startedAt?: number;
  /** Timestamp when request completed */
  completedAt?: number;
}

/**
 * Error state with detailed error information
 * Provides comprehensive error tracking with codes and metadata
 */
export interface ErrorState {
  /** Human-readable error message */
  message: string;
  /** Machine-readable error code */
  code?: string;
  /** HTTP status code if applicable */
  statusCode?: number;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Timestamp when error occurred */
  timestamp?: number;
  /** Stack trace (only in development) */
  stack?: string;
  /** Field-specific validation errors */
  validationErrors?: Array<{
    field: string;
    message: string;
    code?: string;
  }>;
}

// =====================
// PAGINATION & SORTING
// =====================

/**
 * Pagination state for list views
 * Tracks pagination parameters and metadata
 */
export interface PaginationState {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * Sort state for ordered lists
 * Defines sorting configuration
 */
export interface SortState {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: 'ASC' | 'DESC';
  /** Secondary sort field (optional) */
  secondaryField?: string;
  /** Secondary sort direction (optional) */
  secondaryDirection?: 'ASC' | 'DESC';
}

// =====================
// FILTER & SELECTION
// =====================

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

// =====================
// ENTITY MANAGEMENT
// =====================

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

// =====================
// FORM MANAGEMENT
// =====================

/**
 * Select option type for forms
 * Generic type for dropdown and select inputs
 *
 * @template T - Type of option value
 */
export interface SelectOption<T = string> {
  /** Display label */
  label: string;
  /** Option value */
  value: T;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Optional icon */
  icon?: string;
  /** Optional description */
  description?: string;
  /** Optional group name */
  group?: string;
}

/**
 * Form state for tracking form submission and validation
 *
 * @template T - Type of form data
 */
export interface FormState<T> {
  /** Current form data */
  data: T;
  /** Form validation errors */
  errors: Partial<Record<keyof T, string>>;
  /** Whether form has been touched */
  touched: Partial<Record<keyof T, boolean>>;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Whether form is valid */
  isValid: boolean;
  /** Whether form has been modified */
  isDirty: boolean;
  /** Form-level error message */
  formError?: string;
}
