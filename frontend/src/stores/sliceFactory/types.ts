/**
 * @fileoverview Type definitions and interfaces for Redux Slice Factory
 * @module stores/sliceFactory/types
 * @category Types
 */

import type {
  AsyncThunk,
  EntityAdapter,
  EntityState,
  PayloadAction,
  Reducer,
  SerializedError,
  Slice,
} from '@reduxjs/toolkit';
import type { WritableDraft } from '@reduxjs/toolkit';
import type {
  BaseEntity,
  HealthcareEntity,
  LoadingState,
  PaginationState,
  SortState,
  FilterState,
  SelectionState,
  UIState,
  EntityQueryParams,
  AuditRecord,
} from '../types/entityTypes';

/**
 * Data classification type for healthcare entities
 * Matches the HealthcareEntity dataClassification field
 */
export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PHI';

/**
 * API error structure with proper typing
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  validationErrors?: Record<string, string[]>;
}

/**
 * Enhanced entity state that extends RTK's EntityState
 */
export interface EnhancedEntityState<T extends BaseEntity> extends EntityState<T, string> {
  loading: {
    list: LoadingState;
    detail: LoadingState;
    create: LoadingState;
    update: LoadingState;
    delete: LoadingState;
    bulk: LoadingState;
  };
  pagination: PaginationState;
  sort: SortState;
  filters: FilterState;
  selection: SelectionState;
  ui: UIState;
  cache: {
    lastFetched: number;
    isStale: boolean;
  };
}

/**
 * Generic API service interface that entity services must implement.
 *
 * Defines the contract for CRUD operations that the slice factory expects.
 * Entity-specific API implementations must conform to this interface to be
 * compatible with createEntitySlice factory.
 */
export interface EntityApiService<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /**
   * Fetch a list of entities with optional filtering, sorting, and pagination.
   */
  getAll(params?: EntityQueryParams): Promise<{ data: T[]; total?: number; pagination?: Partial<PaginationState> }>;

  /**
   * Fetch a single entity by its unique identifier.
   */
  getById(id: string): Promise<{ data: T }>;

  /**
   * Create a new entity.
   */
  create(data: TCreate): Promise<{ data: T }>;

  /**
   * Update an existing entity.
   */
  update(id: string, data: TUpdate): Promise<{ data: T }>;

  /**
   * Delete an entity.
   */
  delete(id: string): Promise<{ success: boolean }>;

  /**
   * Bulk delete multiple entities (optional).
   */
  bulkDelete?(ids: string[]): Promise<{ success: boolean }>;

  /**
   * Bulk update multiple entities (optional).
   */
  bulkUpdate?(updates: Array<{ id: string; data: TUpdate }>): Promise<{ data: T[] }>;
}

/**
 * Configuration options for slice factory.
 */
export interface SliceFactoryOptions<T extends BaseEntity> {
  /** Whether to include bulk operations */
  enableBulkOperations?: boolean;
  /** Custom reducers to add to the slice */
  extraReducers?: Record<string, (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<unknown>) => void>;
  /** Custom initial state */
  customInitialState?: Partial<EnhancedEntityState<T>>;
}

/**
 * Result object returned by slice factory containing all generated artifacts.
 */
export interface SliceFactoryResult<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /** The generated slice */
  slice: Slice;
  /** Entity adapter for normalized state */
  adapter: EntityAdapter<T, string>;
  /** Async thunks for CRUD operations */
  thunks: {
    fetchList: AsyncThunk<{ data: T[]; total?: number; pagination?: Partial<PaginationState> }, EntityQueryParams | void, object>;
    fetchById: AsyncThunk<{ data: T }, string, object>;
    create: AsyncThunk<{ data: T }, TCreate, object>;
    update: AsyncThunk<{ data: T }, { id: string; data: TUpdate }, object>;
    delete: AsyncThunk<{ success: boolean; id: string }, string, object>;
    bulkDelete?: AsyncThunk<{ success: boolean; ids: string[] }, string[], object>;
    bulkUpdate?: AsyncThunk<{ data: T[] }, Array<{ id: string; data: TUpdate }>, object>;
  };
  /** Action creators */
  actions: Record<string, unknown>;
  /** Reducer */
  reducer: Reducer<unknown>;
}

/**
 * Healthcare-specific audit record payload
 */
export interface AuditRecordPayload {
  entityId: string;
  auditRecord: AuditRecord;
}

/**
 * Data classification update payload
 */
export interface DataClassificationPayload {
  entityId: string;
  classification: DataClassification;
}
