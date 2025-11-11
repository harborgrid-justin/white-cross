/**
 * @fileoverview Core Redux Slice Factory Implementation
 * @module stores/sliceFactory/core
 * @category Core
 */

import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Reducer,
} from '@reduxjs/toolkit';
import type { WritableDraft } from '@reduxjs/toolkit';
import type {
  BaseEntity,
  PaginationState,
  SortState,
  FilterState,
  SelectionState,
  UIState,
  EntityQueryParams,
} from '../types/entityTypes';
import type {
  EntityApiService,
  SliceFactoryOptions,
  SliceFactoryResult,
  EnhancedEntityState,
} from './types';
import {
  createInitialEnhancedState,
  extractErrorInfo,
  updateLoadingState,
  createStandardEntityAdapter,
} from './helpers';

/**
 * Create a standardized Redux Toolkit slice with complete CRUD operations.
 *
 * This is the primary factory function for creating entity management slices.
 * Generates a fully-featured Redux slice with EntityAdapter for normalized state
 * management, async thunks for all CRUD operations, and comprehensive state management.
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
  const adapter = createStandardEntityAdapter<T>();

  // Create initial state
  const initialState = createInitialEnhancedState<T>(adapter, customInitialState);

  // Create async thunks
  const fetchList = createAsyncThunk(
    `${name}/fetchList`,
    async (params: EntityQueryParams | void, { rejectWithValue }) => {
      try {
        const result = await apiService.getAll(params || {});
        return result;
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || 'Failed to fetch list',
          status: errorInfo.status,
          code: errorInfo.code,
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
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || `Failed to fetch ${name}`,
          status: errorInfo.status,
          code: errorInfo.code,
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
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || `Failed to create ${name}`,
          status: errorInfo.status,
          code: errorInfo.code,
          validationErrors: errorInfo.validationErrors,
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
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || `Failed to update ${name}`,
          status: errorInfo.status,
          code: errorInfo.code,
          validationErrors: errorInfo.validationErrors,
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
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || `Failed to delete ${name}`,
          status: errorInfo.status,
          code: errorInfo.code,
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
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || `Failed to bulk delete ${name}s`,
          status: errorInfo.status,
          code: errorInfo.code,
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
      } catch (error: unknown) {
        const errorInfo = extractErrorInfo(error);
        return rejectWithValue({
          message: errorInfo.message || `Failed to bulk update ${name}s`,
          status: errorInfo.status,
          code: errorInfo.code,
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
      setEntities: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<T[]>) => {
        adapter.setAll(state, action.payload);
        state.cache.lastFetched = Date.now();
        state.cache.isStale = false;
      },

      addEntity: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<T>) => {
        adapter.addOne(state, action.payload);
      },

      updateEntity: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<{ id: string; changes: Partial<T> }>) => {
        adapter.updateOne(state, action.payload);
      },

      removeEntity: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<string>) => {
        adapter.removeOne(state, action.payload);
        // Remove from selection if selected
        state.selection.selectedIds = state.selection.selectedIds.filter((id: string) => id !== action.payload);
        if (state.selection.focusedId === action.payload) {
          state.selection.focusedId = null;
        }
      },

      // Pagination
      setPagination: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<Partial<PaginationState>>) => {
        state.pagination = { ...state.pagination, ...action.payload };
      },

      // Sorting
      setSort: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<SortState>) => {
        state.sort = action.payload;
      },

      // Filtering
      setFilters: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<Partial<FilterState>>) => {
        state.filters = { ...state.filters, ...action.payload };
      },

      clearFilters: (state: WritableDraft<EnhancedEntityState<T>>) => {
        state.filters = {
          active: {},
          search: '',
          presets: state.filters.presets,
        };
      },

      // Selection
      setSelection: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<Partial<SelectionState>>) => {
        state.selection = { ...state.selection, ...action.payload };
      },

      selectEntity: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<string>) => {
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

      deselectEntity: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<string>) => {
        const id = action.payload;
        state.selection.selectedIds = state.selection.selectedIds.filter((selectedId: string) => selectedId !== id);
        if (state.selection.focusedId === id) {
          state.selection.focusedId = null;
        }
      },

      clearSelection: (state: WritableDraft<EnhancedEntityState<T>>) => {
        state.selection.selectedIds = [];
        state.selection.focusedId = null;
        state.selection.isAllSelected = false;
      },

      selectAll: (state: WritableDraft<EnhancedEntityState<T>>) => {
        state.selection.selectedIds = [...state.ids] as string[];
        state.selection.isAllSelected = true;
      },

      // UI state
      setUI: (state: WritableDraft<EnhancedEntityState<T>>, action: PayloadAction<Partial<UIState>>) => {
        state.ui = { ...state.ui, ...action.payload };
      },

      // Cache management
      invalidateCache: (state: WritableDraft<EnhancedEntityState<T>>) => {
        state.cache.isStale = true;
        state.cache.lastFetched = 0;
      },

      // Error handling
      clearErrors: (state: WritableDraft<EnhancedEntityState<T>>) => {
        Object.keys(state.loading).forEach((key: string) => {
          state.loading[key as keyof typeof state.loading].error = null;
        });
      },

      // Custom reducers
      ...extraReducers,
    },

    extraReducers: (builder) => {
      // Fetch list
      builder
        .addCase(fetchList.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
          updateLoadingState(state, 'list', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(fetchList.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
        .addCase(fetchList.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
          updateLoadingState(state, 'list', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Fetch by ID
      builder
        .addCase(fetchById.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
          updateLoadingState(state, 'detail', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(fetchById.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
          adapter.upsertOne(state, action.payload.data);
          updateLoadingState(state, 'detail', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
        })
        .addCase(fetchById.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
          updateLoadingState(state, 'detail', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Create
      builder
        .addCase(create.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
          updateLoadingState(state, 'create', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(create.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
        .addCase(create.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
          updateLoadingState(state, 'create', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Update
      builder
        .addCase(update.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
          updateLoadingState(state, 'update', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(update.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
          adapter.upsertOne(state, action.payload.data);
          updateLoadingState(state, 'update', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
        })
        .addCase(update.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
          updateLoadingState(state, 'update', {
            status: 'rejected',
            isLoading: false,
            error: action.error,
            completedAt: Date.now(),
          });
        });

      // Delete
      builder
        .addCase(deleteEntity.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
          updateLoadingState(state, 'delete', {
            status: 'pending',
            isLoading: true,
            error: null,
            startedAt: Date.now(),
          });
        })
        .addCase(deleteEntity.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
        .addCase(deleteEntity.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
          .addCase(bulkDelete.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
            updateLoadingState(state, 'bulk', {
              status: 'pending',
              isLoading: true,
              error: null,
              startedAt: Date.now(),
            });
          })
          .addCase(bulkDelete.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
          .addCase(bulkDelete.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
          .addCase(bulkUpdate.pending, (state: WritableDraft<EnhancedEntityState<T>>) => {
            updateLoadingState(state, 'bulk', {
              status: 'pending',
              isLoading: true,
              error: null,
              startedAt: Date.now(),
            });
          })
          .addCase(bulkUpdate.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
            adapter.upsertMany(state, action.payload.data);
            updateLoadingState(state, 'bulk', {
              status: 'fulfilled',
              isLoading: false,
              error: null,
              completedAt: Date.now(),
            });
          })
          .addCase(bulkUpdate.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action) => {
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
    reducer: slice.reducer as Reducer<unknown>,
  };
}

/**
 * Utility function to create a simple entity slice with minimal configuration.
 *
 * Convenience wrapper around createEntitySlice with bulk operations disabled.
 * Use this for entities that don't require bulk delete/update operations.
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
