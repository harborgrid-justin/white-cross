/**
 * WF-COMP-501 | sliceFactory.ts - Redux Slice Factory
 * Purpose: Factory function for creating standardized Redux slices with CRUD operations
 * Upstream: @reduxjs/toolkit, ./types/entityTypes | Dependencies: @reduxjs/toolkit, ./types/entityTypes
 * Downstream: All domain slices | Called by: Domain slice implementations
 * Related: Entity types, selectors, async thunks
 * Exports: factory functions, slice creators | Key Features: CRUD operations, async thunks
 * Last Updated: 2025-10-20 | File Type: .ts
 * Critical Path: Slice creation → Store configuration → Component usage
 * LLM Context: Redux slice factory for healthcare platform entity management
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  AsyncThunk,
  SerializedError,
  EntityState,
} from '@reduxjs/toolkit';
import type {
  BaseEntity,
  HealthcareEntity,
  LoadingState,
  PaginationState,
  SortState,
  FilterState,
  SelectionState,
  UIState,
  ActionMetadata,
  AsyncThunkResult,
  AsyncThunkError,
  EntityQueryParams,
} from './types/entityTypes';
import { createInitialEntityState } from './types/entityTypes';

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
 * Generic API service interface that entity services must implement
 */
export interface EntityApiService<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /** Fetch a list of entities */
  getAll(params?: EntityQueryParams): Promise<{ data: T[]; total?: number; pagination?: Partial<PaginationState> }>;
  /** Fetch a single entity by ID */
  getById(id: string): Promise<{ data: T }>;
  /** Create a new entity */
  create(data: TCreate): Promise<{ data: T }>;
  /** Update an existing entity */
  update(id: string, data: TUpdate): Promise<{ data: T }>;
  /** Delete an entity */
  delete(id: string): Promise<{ success: boolean }>;
  /** Bulk delete entities */
  bulkDelete?(ids: string[]): Promise<{ success: boolean }>;
  /** Bulk update entities */
  bulkUpdate?(updates: Array<{ id: string; data: TUpdate }>): Promise<{ data: T[] }>;
}

/**
 * Options for slice factory configuration
 */
export interface SliceFactoryOptions<T extends BaseEntity> {
  /** Whether to include bulk operations */
  enableBulkOperations?: boolean;
  /** Custom reducers to add to the slice */
  extraReducers?: Record<string, (state: EnhancedEntityState<T>, action: PayloadAction<any>) => void>;
  /** Custom initial state */
  customInitialState?: Partial<EnhancedEntityState<T>>;
}

/**
 * Result of slice factory containing slice and related utilities
 */
export interface SliceFactoryResult<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /** The generated slice */
  slice: ReturnType<typeof createSlice>;
  /** Entity adapter for normalized state */
  adapter: ReturnType<typeof createEntityAdapter>;
  /** Async thunks for CRUD operations */
  thunks: {
    fetchList: AsyncThunk<{ data: T[]; total?: number; pagination?: Partial<PaginationState> }, EntityQueryParams | void, {}>;
    fetchById: AsyncThunk<{ data: T }, string, {}>;
    create: AsyncThunk<{ data: T }, TCreate, {}>;
    update: AsyncThunk<{ data: T }, { id: string; data: TUpdate }, {}>;
    delete: AsyncThunk<{ success: boolean; id: string }, string, {}>;
    bulkDelete?: AsyncThunk<{ success: boolean; ids: string[] }, string[], {}>;
    bulkUpdate?: AsyncThunk<{ data: T[] }, Array<{ id: string; data: TUpdate }>, {}>;
  };
  /** Action creators */
  actions: ReturnType<typeof createSlice>['actions'];
  /** Reducer */
  reducer: ReturnType<typeof createSlice>['reducer'];
}

/**
 * Create initial state for enhanced entity state
 */
function createInitialEnhancedState<T extends BaseEntity>(
  adapter: ReturnType<typeof createEntityAdapter<T, string>>,
  customState?: Partial<EnhancedEntityState<T>>
): EnhancedEntityState<T> {
  return {
    ...adapter.getInitialState(),
    loading: {
      list: { status: 'idle', isLoading: false, error: null },
      detail: { status: 'idle', isLoading: false, error: null },
      create: { status: 'idle', isLoading: false, error: null },
      update: { status: 'idle', isLoading: false, error: null },
      delete: { status: 'idle', isLoading: false, error: null },
      bulk: { status: 'idle', isLoading: false, error: null },
    },
    pagination: {
      page: 1,
      pageSize: 25,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    sort: {
      field: 'createdAt',
      direction: 'desc',
    },
    filters: {
      active: {},
      search: '',
      presets: {},
    },
    selection: {
      selectedIds: [],
      focusedId: null,
      isAllSelected: false,
      mode: 'multiple',
    },
    ui: {
      viewMode: 'list',
      showFilters: false,
      showSidebar: true,
      density: 'normal',
      visibleColumns: [],
      columnWidths: {},
    },
    cache: {
      lastFetched: 0,
      isStale: true,
    },
    ...customState,
  };
}

/**
 * Create a standardized entity slice with CRUD operations
 */
export function createEntitySlice<
  T extends BaseEntity,
  TCreate = Partial<T>,
  TUpdate = Partial<T>
>(
  name: string,
  apiService: EntityApiService<T, TCreate, TUpdate>,
  options: SliceFactoryOptions<T> = {}
): SliceFactoryResult<T, TCreate, TUpdate> {
  
  const {
    enableBulkOperations = true,
    extraReducers = {},
    customInitialState = {},
  } = options;

  // Create entity adapter for normalized state management
  const adapter = createEntityAdapter<T, string>({
    selectId: (entity: T) => entity.id,
    sortComparer: (a, b) => {
      // Default sort by updatedAt descending
      if (!a.updatedAt || !b.updatedAt) return 0;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    },
  });

  // Create initial state
  const initialState = createInitialEnhancedState<T>(adapter, customInitialState);

  // Helper function to update loading state
  const updateLoadingState = (
    state: any,
    operation: keyof EnhancedEntityState<T>['loading'],
    loading: Partial<LoadingState>
  ) => {
    state.loading[operation] = { ...state.loading[operation], ...loading };
  };

  // Create async thunks
  const fetchList = createAsyncThunk(
    `${name}/fetchList`,
    async (params: EntityQueryParams | void, { rejectWithValue }) => {
      try {
        const result = await apiService.getAll(params || {});
        return result;
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || 'Failed to fetch list',
          status: error.status,
          code: error.code,
        });
      }
    }
  );

  const fetchById = createAsyncThunk(
    `${name}/fetchById`,
    async (id: string, { rejectWithValue }) => {
      try {
        const result = await apiService.getById(id);
        return result;
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || `Failed to fetch ${name}`,
          status: error.status,
          code: error.code,
        });
      }
    }
  );

  const create = createAsyncThunk(
    `${name}/create`,
    async (data: TCreate, { rejectWithValue }) => {
      try {
        const result = await apiService.create(data);
        return result;
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || `Failed to create ${name}`,
          status: error.status,
          code: error.code,
          validationErrors: error.validationErrors,
        });
      }
    }
  );

  const update = createAsyncThunk(
    `${name}/update`,
    async ({ id, data }: { id: string; data: TUpdate }, { rejectWithValue }) => {
      try {
        const result = await apiService.update(id, data);
        return result;
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || `Failed to update ${name}`,
          status: error.status,
          code: error.code,
          validationErrors: error.validationErrors,
        });
      }
    }
  );

  const deleteEntity = createAsyncThunk(
    `${name}/delete`,
    async (id: string, { rejectWithValue }) => {
      try {
        const result = await apiService.delete(id);
        return { ...result, id };
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || `Failed to delete ${name}`,
          status: error.status,
          code: error.code,
        });
      }
    }
  );

  // Bulk operations (if enabled and API service supports them)
  const bulkDelete = enableBulkOperations && apiService.bulkDelete ? createAsyncThunk(
    `${name}/bulkDelete`,
    async (ids: string[], { rejectWithValue }) => {
      try {
        const result = await apiService.bulkDelete!(ids);
        return { ...result, ids };
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || `Failed to bulk delete ${name}s`,
          status: error.status,
          code: error.code,
        });
      }
    }
  ) : undefined;

  const bulkUpdate = enableBulkOperations && apiService.bulkUpdate ? createAsyncThunk(
    `${name}/bulkUpdate`,
    async (updates: Array<{ id: string; data: TUpdate }>, { rejectWithValue }) => {
      try {
        const result = await apiService.bulkUpdate!(updates);
        return result;
      } catch (error: any) {
        return rejectWithValue({
          message: error.message || `Failed to bulk update ${name}s`,
          status: error.status,
          code: error.code,
        });
      }
    }
  ) : undefined;

  // Create the slice
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      // Entity management
      setEntities: (state, action: PayloadAction<T[]>) => {
        adapter.setAll(state, action.payload);
        state.cache.lastFetched = Date.now();
        state.cache.isStale = false;
      },

      addEntity: (state, action: PayloadAction<T>) => {
        adapter.addOne(state, action.payload);
      },

      updateEntity: (state, action: PayloadAction<{ id: string; changes: Partial<T> }>) => {
        adapter.updateOne(state, action.payload);
      },

      removeEntity: (state, action: PayloadAction<string>) => {
        adapter.removeOne(state, action.payload);
        // Remove from selection if selected
        state.selection.selectedIds = state.selection.selectedIds.filter(id => id !== action.payload);
        if (state.selection.focusedId === action.payload) {
          state.selection.focusedId = null;
        }
      },

      // Pagination
      setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
        state.pagination = { ...state.pagination, ...action.payload };
      },

      // Sorting
      setSort: (state, action: PayloadAction<SortState>) => {
        state.sort = action.payload;
      },

      // Filtering
      setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
        state.filters = { ...state.filters, ...action.payload };
      },

      clearFilters: (state) => {
        state.filters = {
          active: {},
          search: '',
          presets: state.filters.presets,
        };
      },

      // Selection
      setSelection: (state, action: PayloadAction<Partial<SelectionState>>) => {
        state.selection = { ...state.selection, ...action.payload };
      },

      selectEntity: (state, action: PayloadAction<string>) => {
        const id = action.payload;
        if (state.selection.mode === 'single') {
          state.selection.selectedIds = [id];
        } else if (state.selection.mode === 'multiple') {
          if (!state.selection.selectedIds.includes(id)) {
            state.selection.selectedIds.push(id);
          }
        }
        state.selection.focusedId = id;
      },

      deselectEntity: (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.selection.selectedIds = state.selection.selectedIds.filter(selectedId => selectedId !== id);
        if (state.selection.focusedId === id) {
          state.selection.focusedId = null;
        }
      },

      clearSelection: (state) => {
        state.selection.selectedIds = [];
        state.selection.focusedId = null;
        state.selection.isAllSelected = false;
      },

      selectAll: (state) => {
        state.selection.selectedIds = [...state.ids] as string[];
        state.selection.isAllSelected = true;
      },

      // UI state
      setUI: (state, action: PayloadAction<Partial<UIState>>) => {
        state.ui = { ...state.ui, ...action.payload };
      },

      // Cache management
      invalidateCache: (state) => {
        state.cache.isStale = true;
        state.cache.lastFetched = 0;
      },

      // Error handling
      clearErrors: (state) => {
        Object.keys(state.loading).forEach(key => {
          state.loading[key as keyof typeof state.loading].error = null;
        });
      },

      // Custom reducers
      ...extraReducers,
    },

    extraReducers: (builder) => {
      // Fetch list
      builder
        .addCase(fetchList.pending, (state) => {
          updateLoadingState(state, 'list', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(fetchList.fulfilled, (state, action) => {
          adapter.setAll(state, action.payload.data);
          updateLoadingState(state, 'list', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
          
          // Update pagination if provided
          if (action.payload.pagination) {
            state.pagination = { ...state.pagination, ...action.payload.pagination };
          }
          if (action.payload.total !== undefined) {
            state.pagination.total = action.payload.total;
          }
          
          state.cache.lastFetched = Date.now();
          state.cache.isStale = false;
        })
        .addCase(fetchList.rejected, (state, action) => {
          updateLoadingState(state, 'list', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Fetch by ID
      builder
        .addCase(fetchById.pending, (state) => {
          updateLoadingState(state, 'detail', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(fetchById.fulfilled, (state, action) => {
          adapter.upsertOne(state, action.payload.data);
          updateLoadingState(state, 'detail', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
        })
        .addCase(fetchById.rejected, (state, action) => {
          updateLoadingState(state, 'detail', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Create
      builder
        .addCase(create.pending, (state) => {
          updateLoadingState(state, 'create', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(create.fulfilled, (state, action) => {
          adapter.addOne(state, action.payload.data);
          updateLoadingState(state, 'create', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
          
          // Update pagination
          state.pagination.total += 1;
        })
        .addCase(create.rejected, (state, action) => {
          updateLoadingState(state, 'create', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Update
      builder
        .addCase(update.pending, (state) => {
          updateLoadingState(state, 'update', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(update.fulfilled, (state, action) => {
          adapter.upsertOne(state, action.payload.data);
          updateLoadingState(state, 'update', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
        })
        .addCase(update.rejected, (state, action) => {
          updateLoadingState(state, 'update', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Delete
      builder
        .addCase(deleteEntity.pending, (state) => {
          updateLoadingState(state, 'delete', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(deleteEntity.fulfilled, (state, action) => {
          adapter.removeOne(state, action.payload.id);
          updateLoadingState(state, 'delete', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
          
          // Update pagination
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        })
        .addCase(deleteEntity.rejected, (state, action) => {
          updateLoadingState(state, 'delete', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Bulk operations
      if (bulkDelete) {
        builder
          .addCase(bulkDelete.pending, (state) => {
            updateLoadingState(state, 'bulk', {
              status: 'pending',
              isLoading: true,
              error: null,
              startedAt: Date.now(),
            });
          })
          .addCase(bulkDelete.fulfilled, (state, action) => {
            adapter.removeMany(state, action.payload.ids);
            updateLoadingState(state, 'bulk', {
              status: 'fulfilled',
              isLoading: false,
              error: null,
              completedAt: Date.now(),
            });
            
            // Update pagination
            state.pagination.total = Math.max(0, state.pagination.total - action.payload.ids.length);
            
            // Clear selection
            state.selection.selectedIds = [];
            state.selection.isAllSelected = false;
          })
          .addCase(bulkDelete.rejected, (state, action) => {
            updateLoadingState(state, 'bulk', {
              status: 'rejected',
              isLoading: false,
              error: action.error,
              completedAt: Date.now(),
            });
          });
      }

      if (bulkUpdate) {
        builder
          .addCase(bulkUpdate.pending, (state) => {
            updateLoadingState(state, 'bulk', {
              status: 'pending',
              isLoading: true,
              error: null,
              startedAt: Date.now(),
            });
          })
          .addCase(bulkUpdate.fulfilled, (state, action) => {
            adapter.upsertMany(state, action.payload.data);
            updateLoadingState(state, 'bulk', {
              status: 'fulfilled',
              isLoading: false,
              error: null,
              completedAt: Date.now(),
            });
          })
          .addCase(bulkUpdate.rejected, (state, action) => {
            updateLoadingState(state, 'bulk', {
              status: 'rejected',
              isLoading: false,
              error: action.error,
              completedAt: Date.now(),
            });
          });
      }
    },
  });

  // Return complete slice factory result
  return {
    slice,
    adapter,
    thunks: {
      fetchList,
      fetchById,
      create,
      update,
      delete: deleteEntity,
      ...(bulkDelete && { bulkDelete }),
      ...(bulkUpdate && { bulkUpdate }),
    },
    actions: slice.actions,
    reducer: slice.reducer,
  };
}

/**
 * Healthcare-specific slice factory with HIPAA compliance features
 */
export function createHealthcareEntitySlice<
  T extends HealthcareEntity,
  TCreate = Partial<T>,
  TUpdate = Partial<T>
>(
  name: string,
  apiService: EntityApiService<T, TCreate, TUpdate>,
  options: SliceFactoryOptions<T> = {}
): SliceFactoryResult<T, TCreate, TUpdate> {
  
  // Add healthcare-specific options
  const healthcareOptions: SliceFactoryOptions<T> = {
    ...options,
    extraReducers: {
      ...options.extraReducers,
      
      // Audit trail management
      addAuditRecord: (state, action: PayloadAction<{ entityId: string; auditRecord: any }>) => {
        const { entityId, auditRecord } = action.payload;
        const entity = state.entities[entityId];
        if (entity && 'auditTrail' in entity) {
          (entity as any).auditTrail = [...((entity as any).auditTrail || []), auditRecord];
        }
      },
      
      // Data classification updates
      updateDataClassification: (state, action: PayloadAction<{ entityId: string; classification: any }>) => {
        const { entityId, classification } = action.payload;
        const entity = state.entities[entityId];
        if (entity && 'dataClassification' in entity) {
          (entity as any).dataClassification = classification;
        }
      },
    },
  };

  return createEntitySlice(name, apiService, healthcareOptions);
}

/**
 * Utility function to create slice with minimal configuration
 */
export function createSimpleSlice<T extends BaseEntity>(
  name: string,
  apiService: EntityApiService<T>
): SliceFactoryResult<T> {
  return createEntitySlice(
    name,
    apiService,
    { enableBulkOperations: false }
  );
}

export default createEntitySlice;