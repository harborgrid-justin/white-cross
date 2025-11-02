/**
 * WF-COMP-334 | state.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces, types | Key Features: useState
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * State Management Type Definitions
 *
 * Comprehensive TypeScript types for Redux store and React Context state management.
 * This file defines all state shapes, action payloads, and utility types for the
 * White Cross healthcare platform.
 *
 * @module types/state
 */

import type {
  IncidentReport,
  WitnessStatement,
  FollowUpAction,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  WitnessType,
  ActionPriority,
  ActionStatus
} from './incidents';
import type { User } from './common';
import type { AsyncThunk, SerializedError } from '@reduxjs/toolkit';

// =====================
// UTILITY STATE TYPES
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

// =====================
// REDUX STORE STATE
// =====================

/**
 * Incident Reports state slice
 * Manages incident report data in normalized form with pagination
 */
export interface IncidentReportsState {
  /** Normalized incident entities */
  entities: EntityState<IncidentReport>;
  /** Loading and error state */
  loading: LoadingState<ErrorState>;
  /** Pagination state */
  pagination: PaginationState;
  /** Sort configuration */
  sort: SortState;
  /** Filter state */
  filters: FilterState<{
    type?: IncidentType;
    severity?: IncidentSeverity;
    status?: IncidentStatus;
    studentId?: string;
    reportedById?: string;
    dateFrom?: string;
    dateTo?: string;
    location?: string;
    parentNotified?: boolean;
    followUpRequired?: boolean;
  }>;
  /** Selection state */
  selection: SelectionState<IncidentReport>;
  /** Currently viewed incident ID */
  currentIncidentId: string | null;
  /** Search query */
  searchQuery: string;
  /** Cache timestamp for data freshness */
  cacheTimestamp: number | null;
}

/**
 * Witness Statements state slice
 * Manages witness statement data grouped by incident
 */
export interface WitnessStatementsState {
  /** Witness statements by incident ID */
  byIncidentId: Record<string, EntityState<WitnessStatement>>;
  /** Loading states by incident ID */
  loadingByIncidentId: Record<string, LoadingState<ErrorState>>;
  /** Currently editing statement ID */
  editingStatementId: string | null;
  /** Form state for new statement */
  formState: FormState<{
    incidentReportId: string;
    witnessName: string;
    witnessType: WitnessType;
    witnessContact?: string;
    statement: string;
  }> | null;
}

/**
 * Follow-Up Actions state slice
 * Manages follow-up action tracking and assignments
 */
export interface FollowUpActionsState {
  /** Follow-up actions by incident ID */
  byIncidentId: Record<string, EntityState<FollowUpAction>>;
  /** Loading states by incident ID */
  loadingByIncidentId: Record<string, LoadingState<ErrorState>>;
  /** Actions by assigned user ID */
  byAssignedUserId: Record<string, string[]>;
  /** Overdue actions */
  overdueActionIds: string[];
  /** Completed actions count */
  completedCount: number;
  /** Pending actions count */
  pendingCount: number;
  /** Filter by priority */
  priorityFilter: ActionPriority | 'ALL';
  /** Filter by status */
  statusFilter: ActionStatus | 'ALL';
}

/**
 * UI state slice
 * Manages global UI state including modals, toasts, and overlays
 */
export interface UIState {
  /** Active modals */
  modals: {
    /** Modal ID */
    [modalId: string]: {
      /** Whether modal is open */
      isOpen: boolean;
      /** Modal data/props */
      data?: Record<string, unknown>;
      /** Modal size */
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    };
  };
  /** Toast notifications */
  toasts: Array<{
    /** Unique toast ID */
    id: string;
    /** Toast message */
    message: string;
    /** Toast type */
    type: 'success' | 'error' | 'warning' | 'info';
    /** Duration in milliseconds */
    duration?: number;
    /** Timestamp when created */
    createdAt: number;
  }>;
  /** Loading overlays */
  loadingOverlays: {
    /** Overlay ID */
    [overlayId: string]: {
      /** Whether overlay is visible */
      isVisible: boolean;
      /** Loading message */
      message?: string;
      /** Progress percentage (0-100) */
      progress?: number;
    };
  };
  /** Global loading state */
  isGlobalLoading: boolean;
  /** Sidebar state */
  sidebar: {
    /** Whether sidebar is open */
    isOpen: boolean;
    /** Whether sidebar is collapsed */
    isCollapsed: boolean;
    /** Currently active menu item */
    activeItem: string | null;
  };
  /** Theme preference */
  theme: 'light' | 'dark' | 'system';
}

/**
 * Navigation state slice
 * Tracks navigation history and breadcrumbs
 */
export interface NavigationState {
  /** Current route path */
  currentPath: string;
  /** Previous route path */
  previousPath: string | null;
  /** Breadcrumb trail */
  breadcrumbs: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
  /** Navigation history (last 10 routes) */
  history: string[];
  /** Whether can go back */
  canGoBack: boolean;
  /** Whether can go forward */
  canGoForward: boolean;
}

/**
 * Cache state slice
 * Manages client-side caching and data freshness
 */
export interface CacheState {
  /** Cache entries by key */
  entries: Record<string, {
    /** Cached data */
    data: unknown;
    /** Timestamp when cached */
    timestamp: number;
    /** Time-to-live in milliseconds */
    ttl: number;
    /** Tags for cache invalidation */
    tags: string[];
  }>;
  /** Cache statistics */
  stats: {
    /** Total cache hits */
    hits: number;
    /** Total cache misses */
    misses: number;
    /** Cache hit rate */
    hitRate: number;
  };
}

/**
 * Root Redux store state
 * Complete shape of the application store
 *
 * @example
 * ```typescript
 * const selector = (state: RootState) => state.incidentReports.entities;
 * ```
 */
export interface RootState {
  /** Authentication state */
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  /** Incident reports state */
  incidentReports: IncidentReportsState;
  /** Witness statements state */
  witnessStatements: WitnessStatementsState;
  /** Follow-up actions state */
  followUpActions: FollowUpActionsState;
  /** UI state */
  ui: UIState;
  /** Navigation state */
  navigation: NavigationState;
  /** Cache state */
  cache: CacheState;
}

// =====================
// REACT CONTEXT STATES
// =====================

/**
 * Witness Statement Context state
 * Provides context for witness statement operations
 */
export interface WitnessStatementContextState {
  /** Current incident ID */
  incidentId: string;
  /** Witness statements for current incident */
  statements: WitnessStatement[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ErrorState | null;
  /** Add new statement */
  addStatement: (statement: Omit<WitnessStatement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Update statement */
  updateStatement: (id: string, updates: Partial<WitnessStatement>) => Promise<void>;
  /** Delete statement */
  deleteStatement: (id: string) => Promise<void>;
  /** Verify statement */
  verifyStatement: (id: string) => Promise<void>;
  /** Refresh statements */
  refresh: () => Promise<void>;
}

/**
 * Follow-Up Action Context state
 * Provides context for follow-up action management
 */
export interface FollowUpActionContextState {
  /** Current incident ID */
  incidentId: string;
  /** Follow-up actions for current incident */
  actions: FollowUpAction[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: ErrorState | null;
  /** Add new action */
  addAction: (action: Omit<FollowUpAction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  /** Update action */
  updateAction: (id: string, updates: Partial<FollowUpAction>) => Promise<void>;
  /** Delete action */
  deleteAction: (id: string) => Promise<void>;
  /** Complete action */
  completeAction: (id: string, notes?: string) => Promise<void>;
  /** Assign action */
  assignAction: (id: string, userId: string) => Promise<void>;
  /** Refresh actions */
  refresh: () => Promise<void>;
}

/**
 * Filter Context state
 * Provides context for filter management across the application
 *
 * @template T - Type of filter values
 */
export interface FilterContextState<T extends Record<string, unknown>> {
  /** Current filters */
  filters: Partial<T>;
  /** Set filters */
  setFilters: (filters: Partial<T>) => void;
  /** Clear filters */
  clearFilters: () => void;
  /** Reset to default filters */
  resetFilters: () => void;
  /** Update single filter */
  updateFilter: <K extends keyof T>(key: K, value: T[K] | undefined) => void;
  /** Apply filters */
  applyFilters: () => void;
  /** Active filter count */
  activeFilterCount: number;
  /** Whether filters are applied */
  isFiltered: boolean;
}

/**
 * Modal Context state
 * Provides context for modal management
 */
export interface ModalContextState {
  /** Open modals stack */
  modals: Array<{
    id: string;
    component: React.ComponentType<any>;
    props?: Record<string, unknown>;
    options?: {
      size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closeOnEscape?: boolean;
      closeOnBackdrop?: boolean;
      showCloseButton?: boolean;
    };
  }>;
  /** Open a modal */
  openModal: (
    id: string,
    component: React.ComponentType<any>,
    props?: Record<string, unknown>,
    options?: ModalContextState['modals'][0]['options']
  ) => void;
  /** Close a modal */
  closeModal: (id: string) => void;
  /** Close all modals */
  closeAllModals: () => void;
  /** Check if modal is open */
  isModalOpen: (id: string) => boolean;
}

// =====================
// ACTION PAYLOAD TYPES
// =====================

/**
 * Incident Report action payloads
 * Type definitions for all incident report actions
 */
export interface IncidentReportActionPayloads {
  /** Fetch incidents payload */
  fetchIncidents: {
    page?: number;
    limit?: number;
    filters?: IncidentReportsState['filters']['filters'];
    sort?: SortState;
  };
  /** Fetch incidents success */
  fetchIncidentsSuccess: {
    incidents: IncidentReport[];
    pagination: PaginationState;
  };
  /** Fetch incidents failure */
  fetchIncidentsFailure: ErrorState;
  /** Fetch single incident */
  fetchIncident: string; // incident ID
  /** Fetch incident success */
  fetchIncidentSuccess: IncidentReport;
  /** Create incident */
  createIncident: Omit<IncidentReport, 'id' | 'createdAt' | 'updatedAt'>;
  /** Create incident success */
  createIncidentSuccess: IncidentReport;
  /** Update incident */
  updateIncident: {
    id: string;
    updates: Partial<IncidentReport>;
  };
  /** Update incident success */
  updateIncidentSuccess: IncidentReport;
  /** Delete incident */
  deleteIncident: string; // incident ID
  /** Delete incident success */
  deleteIncidentSuccess: string; // incident ID
  /** Set filters */
  setFilters: Partial<IncidentReportsState['filters']['filters']>;
  /** Set sort */
  setSort: SortState;
  /** Set page */
  setPage: number;
  /** Select incidents */
  selectIncidents: string[]; // incident IDs
  /** Deselect incidents */
  deselectIncidents: string[]; // incident IDs
  /** Select all incidents */
  selectAllIncidents: boolean;
  /** Clear selection */
  clearSelection: void;
}

/**
 * Witness Statement action payloads
 */
export interface WitnessStatementActionPayloads {
  /** Fetch statements for incident */
  fetchStatements: string; // incident ID
  /** Fetch statements success */
  fetchStatementsSuccess: {
    incidentId: string;
    statements: WitnessStatement[];
  };
  /** Fetch statements failure */
  fetchStatementsFailure: {
    incidentId: string;
    error: ErrorState;
  };
  /** Create statement */
  createStatement: Omit<WitnessStatement, 'id' | 'createdAt' | 'updatedAt'>;
  /** Create statement success */
  createStatementSuccess: WitnessStatement;
  /** Update statement */
  updateStatement: {
    id: string;
    updates: Partial<WitnessStatement>;
  };
  /** Update statement success */
  updateStatementSuccess: WitnessStatement;
  /** Delete statement */
  deleteStatement: string; // statement ID
  /** Verify statement */
  verifyStatement: string; // statement ID
}

/**
 * Follow-Up Action action payloads
 */
export interface FollowUpActionActionPayloads {
  /** Fetch actions for incident */
  fetchActions: string; // incident ID
  /** Fetch actions success */
  fetchActionsSuccess: {
    incidentId: string;
    actions: FollowUpAction[];
  };
  /** Fetch actions failure */
  fetchActionsFailure: {
    incidentId: string;
    error: ErrorState;
  };
  /** Create action */
  createAction: Omit<FollowUpAction, 'id' | 'createdAt' | 'updatedAt'>;
  /** Create action success */
  createActionSuccess: FollowUpAction;
  /** Update action */
  updateAction: {
    id: string;
    updates: Partial<FollowUpAction>;
  };
  /** Update action success */
  updateActionSuccess: FollowUpAction;
  /** Delete action */
  deleteAction: string; // action ID
  /** Complete action */
  completeAction: {
    id: string;
    notes?: string;
  };
  /** Assign action */
  assignAction: {
    id: string;
    userId: string;
  };
  /** Set priority filter */
  setPriorityFilter: ActionPriority | 'ALL';
  /** Set status filter */
  setStatusFilter: ActionStatus | 'ALL';
}

/**
 * Filter action payloads
 */
export interface FilterActionPayloads<T extends Record<string, unknown>> {
  /** Set filters */
  setFilters: Partial<T>;
  /** Clear filters */
  clearFilters: void;
  /** Reset filters */
  resetFilters: void;
  /** Update single filter */
  updateFilter: {
    key: keyof T;
    value: T[keyof T] | undefined;
  };
  /** Apply filters */
  applyFilters: void;
}

// =====================
// ASYNC THUNK TYPES
// =====================

/**
 * Custom AsyncThunk configuration
 * Provides proper typing for thunkAPI parameter in async thunks
 */
export interface AsyncThunkConfig {
  /** State type */
  state: RootState;
  /** Dispatch type */
  dispatch?: any;
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

// =====================
// TYPE EXPORTS
// =====================

// Re-export for convenience
export type { SerializedError } from '@reduxjs/toolkit';
