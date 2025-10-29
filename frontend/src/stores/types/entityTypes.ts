/**
 * WF-COMP-500 | entityTypes.ts - Redux Entity Types
 * Purpose: Base TypeScript types for standardized Redux entity state management
 * Upstream: @reduxjs/toolkit | Dependencies: @reduxjs/toolkit
 * Downstream: All Redux slices | Called by: Slice factories and components
 * Related: Base slice factory, selectors, async thunks
 * Exports: types, interfaces | Key Features: Entity normalization, loading states
 * Last Updated: 2025-10-20 | File Type: .ts
 * Critical Path: Store configuration → Slice creation → Component usage
 * LLM Context: Redux entity state management types for healthcare platform
 */

import type { EntityState as RTKEntityState } from '@reduxjs/toolkit';
import type { SerializedError } from '@reduxjs/toolkit';

/**
 * Base entity interface that all entities must implement
 * Provides common fields required for Redux entity management
 */
export interface BaseEntity {
  /** Unique identifier for the entity */
  id: string;
  /** Timestamp when the entity was created */
  createdAt: string;
  /** Timestamp when the entity was last updated */
  updatedAt: string;
  /** Optional soft delete timestamp */
  deletedAt?: string | null;
  /** Entity version for optimistic locking */
  version?: number;
}

/**
 * Healthcare-specific base entity with audit fields
 * Extends BaseEntity with healthcare compliance requirements
 */
export interface HealthcareEntity extends BaseEntity {
  /** User ID who created the record */
  createdBy: string;
  /** User ID who last modified the record */
  modifiedBy: string;
  /** HIPAA audit trail information */
  auditTrail?: AuditRecord[];
  /** Data sensitivity classification */
  dataClassification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI';
}

/**
 * Audit record for healthcare compliance
 */
export interface AuditRecord {
  /** Timestamp of the action */
  timestamp: string;
  /** User who performed the action */
  userId: string;
  /** Type of action performed */
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'PRINT';
  /** IP address of the user */
  ipAddress?: string;
  /** Additional context or reason for the action */
  context?: string;
}

/**
 * Loading state with detailed status tracking
 */
export interface LoadingState {
  /** Current loading status */
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  /** Boolean flag for easier checking */
  isLoading: boolean;
  /** Error information if operation failed */
  error: SerializedError | null;
  /** Timestamp when operation started */
  startedAt?: number;
  /** Timestamp when operation completed */
  completedAt?: number;
  /** Progress percentage for long operations */
  progress?: number;
  /** Additional loading context */
  context?: string;
}

/**
 * Pagination state for list operations
 */
export interface PaginationState {
  /** Current page number (1-based) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there are more pages */
  hasNextPage: boolean;
  /** Whether there are previous pages */
  hasPreviousPage: boolean;
}

/**
 * Sorting configuration
 */
export interface SortState {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
  /** Secondary sort field */
  secondaryField?: string;
  /** Secondary sort direction */
  secondaryDirection?: 'asc' | 'desc';
}

/**
 * Filter state with type safety
 */
export interface FilterState {
  /** Active filters as key-value pairs */
  active: Record<string, any>;
  /** Quick search/text search */
  search: string;
  /** Date range filters */
  dateRange?: {
    start: string;
    end: string;
    field: string;
  };
  /** Preset filter configurations */
  presets: Record<string, Record<string, any>>;
  /** Currently selected preset */
  activePreset?: string;
}

/**
 * Selection state for multi-select operations
 */
export interface SelectionState {
  /** IDs of selected items */
  selectedIds: string[];
  /** ID of the currently focused item */
  focusedId: string | null;
  /** Whether all items are selected */
  isAllSelected: boolean;
  /** Selection mode */
  mode: 'single' | 'multiple' | 'none';
}

/**
 * UI state for list views
 */
export interface UIState {
  /** Current view mode */
  viewMode: 'list' | 'grid' | 'card' | 'table';
  /** Whether filters panel is visible */
  showFilters: boolean;
  /** Whether sidebar is visible */
  showSidebar: boolean;
  /** Density setting for list views */
  density: 'compact' | 'normal' | 'comfortable';
  /** Column visibility for table views */
  visibleColumns: string[];
  /** Column widths for table views */
  columnWidths: Record<string, number>;
}

/**
 * Cache state for performance optimization
 */
export interface CacheState {
  /** Timestamp when data was last fetched */
  lastFetched: number;
  /** Cache expiration time in milliseconds */
  expiresAt: number;
  /** Whether cache is stale */
  isStale: boolean;
  /** Cache tags for invalidation */
  tags: string[];
  /** ETag for HTTP caching */
  etag?: string;
}

/**
 * Standard entity state combining RTK EntityState with custom fields
 */
export interface StandardEntityState<T extends BaseEntity> extends RTKEntityState<T, string> {
  /** Loading state for various operations */
  loading: {
    list: LoadingState;
    detail: LoadingState;
    create: LoadingState;
    update: LoadingState;
    delete: LoadingState;
    bulk: LoadingState;
  };
  /** Pagination state */
  pagination: PaginationState;
  /** Sorting configuration */
  sort: SortState;
  /** Filter state */
  filters: FilterState;
  /** Selection state */
  selection: SelectionState;
  /** UI state */
  ui: UIState;
  /** Cache state */
  cache: CacheState;
  /** Optimistic updates tracking */
  optimistic: {
    /** IDs of entities with pending updates */
    pendingIds: string[];
    /** Original entities before optimistic updates */
    originalEntities: Record<string, T>;
  };
}

/**
 * Action metadata for enhanced debugging and audit
 */
export interface ActionMetadata {
  /** Timestamp when action was dispatched */
  timestamp: number;
  /** User who triggered the action */
  userId?: string;
  /** Source component or page */
  source?: string;
  /** Request ID for tracing */
  requestId?: string;
  /** Whether action should be audited */
  audit?: boolean;
}

/**
 * Bulk operation state
 */
export interface BulkOperationState {
  /** Type of bulk operation */
  type: 'update' | 'delete' | 'export' | 'archive';
  /** IDs being processed */
  targetIds: string[];
  /** Current progress */
  progress: number;
  /** Completed items count */
  completed: number;
  /** Failed items count */
  failed: number;
  /** Error details for failed items */
  errors: Record<string, string>;
  /** Whether operation is running */
  isRunning: boolean;
}

/**
 * Sync state for real-time updates
 */
export interface SyncState {
  /** Whether real-time sync is enabled */
  enabled: boolean;
  /** Connection status */
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  /** Last sync timestamp */
  lastSync: number;
  /** Pending changes to sync */
  pendingChanges: string[];
  /** Conflict resolution mode */
  conflictResolution: 'client' | 'server' | 'merge' | 'prompt';
}

/**
 * Initial state factory for creating consistent initial states
 */
export const createInitialEntityState = <T extends BaseEntity>(): StandardEntityState<T> => {
  return {
    // RTK EntityState
    ids: [],
    entities: {},
    
    // Loading states
    loading: {
      list: {
        status: 'idle',
        isLoading: false,
        error: null,
      },
      detail: {
        status: 'idle',
        isLoading: false,
        error: null,
      },
      create: {
        status: 'idle',
        isLoading: false,
        error: null,
      },
      update: {
        status: 'idle',
        isLoading: false,
        error: null,
      },
      delete: {
        status: 'idle',
        isLoading: false,
        error: null,
      },
      bulk: {
        status: 'idle',
        isLoading: false,
        error: null,
      },
    },
    
    // Pagination
    pagination: {
      page: 1,
      pageSize: 25,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    
    // Sorting
    sort: {
      field: 'createdAt',
      direction: 'desc',
    },
    
    // Filters
    filters: {
      active: {},
      search: '',
      presets: {},
    },
    
    // Selection
    selection: {
      selectedIds: [],
      focusedId: null,
      isAllSelected: false,
      mode: 'multiple',
    },
    
    // UI
    ui: {
      viewMode: 'list',
      showFilters: false,
      showSidebar: true,
      density: 'normal',
      visibleColumns: [],
      columnWidths: {},
    },
    
    // Cache
    cache: {
      lastFetched: 0,
      expiresAt: 0,
      isStale: true,
      tags: [],
    },
    
    // Optimistic updates
    optimistic: {
      pendingIds: [],
      originalEntities: {},
    },
  };
};

/**
 * Type for async thunk return value
 */
export interface AsyncThunkResult<T = any> {
  /** The actual data */
  data: T;
  /** Additional metadata */
  meta?: ActionMetadata;
  /** Pagination info for list operations */
  pagination?: Partial<PaginationState>;
  /** Cache control information */
  cache?: Partial<CacheState>;
}

/**
 * Common async thunk error structure
 */
export interface AsyncThunkError {
  /** Error message */
  message: string;
  /** HTTP status code */
  status?: number;
  /** Error code for categorization */
  code?: string;
  /** Validation errors */
  validationErrors?: Record<string, string[]>;
  /** Whether error should be retried */
  retryable?: boolean;
  /** Request ID for support */
  requestId?: string;
}

/**
 * Entity operation types for type safety
 */
export type EntityOperation = 'list' | 'detail' | 'create' | 'update' | 'delete' | 'bulk';

/**
 * Query parameters for list operations
 */
export interface EntityQueryParams {
  /** Pagination */
  page?: number;
  pageSize?: number;
  
  /** Sorting */
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  
  /** Filtering */
  filters?: Record<string, any>;
  search?: string;
  
  /** Field selection */
  fields?: string[];
  include?: string[];
  exclude?: string[];
  
  /** Cache control */
  useCache?: boolean;
  forceFresh?: boolean;
}

/**
 * Utility type for extracting entity type from state
 */
export type EntityFromState<T> = T extends StandardEntityState<infer U> ? U : never;

/**
 * Utility type for slice configuration
 */
export interface SliceConfig<T extends BaseEntity> {
  /** Slice name */
  name: string;
  /** API service for the entity */
  apiService: any;
  /** Custom initial state */
  initialState?: Partial<StandardEntityState<T>>;
  /** Custom reducers */
  extraReducers?: Record<string, any>;
  /** Whether to enable optimistic updates */
  optimisticUpdates?: boolean;
  /** Cache configuration */
  cache?: {
    /** Default TTL in milliseconds */
    ttl: number;
    /** Auto-refresh interval */
    refreshInterval?: number;
  };
}
