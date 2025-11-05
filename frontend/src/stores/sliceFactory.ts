/**
 * @fileoverview Redux Slice Factory for Standardized Entity Management
 * @module stores/sliceFactory
 * @category Store - Factories
 *
 * Comprehensive factory functions for creating Redux Toolkit slices with standardized
 * CRUD operations, normalized state management using EntityAdapter, and built-in
 * async thunk generation. Dramatically reduces boilerplate while ensuring consistency
 * across all entity slices in the application.
 *
 * Key Features:
 * - **Standardized CRUD Operations**: Auto-generated create, read, update, delete thunks
 * - **Normalized State**: RTK EntityAdapter for optimized lookups and updates
 * - **Bulk Operations**: Optional bulk delete and bulk update support
 * - **Loading States**: Granular loading tracking for each operation type
 * - **Pagination Support**: Built-in pagination state management
 * - **Filter & Sort**: Advanced filtering, searching, and sorting capabilities
 * - **Selection Management**: Multi-select with single/multiple modes
 * - **UI State**: View mode, column visibility, density settings
 * - **Cache Management**: Stale data tracking and cache invalidation
 * - **HIPAA Compliance**: Healthcare-specific factory with audit trail support
 *
 * Architecture:
 * - Uses Redux Toolkit's createSlice and createAsyncThunk
 * - EntityAdapter for normalized state (entities dictionary + ids array)
 * - Generic type support for any entity extending BaseEntity
 * - Extensible with custom reducers and extra actions
 * - Type-safe throughout with full TypeScript inference
 *
 * Usage Pattern:
 * ```typescript
 * // 1. Define API service
 * const apiService: EntityApiService<Student> = {
 *   getAll: async () => { ... },
 *   getById: async (id) => { ... },
 *   create: async (data) => { ... },
 *   update: async (id, data) => { ... },
 *   delete: async (id) => { ... },
 * };
 *
 * // 2. Create slice
 * const { slice, thunks, actions, adapter } = createEntitySlice(
 *   'students',
 *   apiService,
 *   { enableBulkOperations: true }
 * );
 *
 * // 3. Use in components
 * dispatch(thunks.fetchList());
 * const students = useAppSelector(state => state.students.entities);
 * ```
 *
 * @see {@link createEntitySlice} Main factory for standard entities
 * @see {@link createHealthcareEntitySlice} HIPAA-compliant factory for PHI entities
 * @see {@link createSimpleSlice} Minimal factory without bulk operations
 * @see {@link EntityApiService} Required API service interface
 *
 * WF-COMP-501: Redux Slice Factory
 * Purpose: Factory function for creating standardized Redux slices with CRUD operations
 * Critical Path: Slice creation → Store configuration → Component usage
 */

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
  AsyncThunk,
  SerializedError,
  EntityState,
  Reducer,
  Slice,
  EntityAdapter,
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
} from './types/entityTypes';

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
 *
 * @interface EntityApiService
 * @template T - Entity type extending BaseEntity
 * @template TCreate - Shape of data for entity creation (defaults to Partial<T>)
 * @template TUpdate - Shape of data for entity updates (defaults to Partial<T>)
 *
 * @example
 * ```typescript
 * // Implement for a Student entity
 * const studentApiService: EntityApiService<Student, CreateStudentData, UpdateStudentData> = {
 *   getAll: async (params) => {
 *     const response = await api.get('/students', { params });
 *     return { data: response.data, total: response.total };
 *   },
 *   getById: async (id) => {
 *     const response = await api.get(`/students/${id}`);
 *     return { data: response.data };
 *   },
 *   create: async (data) => {
 *     const response = await api.post('/students', data);
 *     return { data: response.data };
 *   },
 *   update: async (id, data) => {
 *     const response = await api.patch(`/students/${id}`, data);
 *     return { data: response.data };
 *   },
 *   delete: async (id) => {
 *     await api.delete(`/students/${id}`);
 *     return { success: true };
 *   },
 * };
 * ```
 *
 * @remarks
 * - All methods should throw errors that can be caught by thunks
 * - Use consistent response shapes for proper state management
 * - Bulk operations are optional but recommended for performance
 */
export interface EntityApiService<T extends BaseEntity, TCreate = Partial<T>, TUpdate = Partial<T>> {
  /**
   * Fetch a list of entities with optional filtering, sorting, and pagination.
   *
   * @async
   * @param {EntityQueryParams} [params] - Query parameters for filtering and pagination
   * @returns {Promise<{data: T[], total?: number, pagination?: Partial<PaginationState>}>} List of entities with metadata
   */
  getAll(params?: EntityQueryParams): Promise<{ data: T[]; total?: number; pagination?: Partial<PaginationState> }>;

  /**
   * Fetch a single entity by its unique identifier.
   *
   * @async
   * @param {string} id - Unique entity ID
   * @returns {Promise<{data: T}>} The entity data
   * @throws {NotFoundError} If entity doesn't exist
   */
  getById(id: string): Promise<{ data: T }>;

  /**
   * Create a new entity.
   *
   * @async
   * @param {TCreate} data - Entity creation data
   * @returns {Promise<{data: T}>} Created entity with generated ID and timestamps
   * @throws {ValidationError} If data validation fails
   */
  create(data: TCreate): Promise<{ data: T }>;

  /**
   * Update an existing entity.
   *
   * @async
   * @param {string} id - Entity ID to update
   * @param {TUpdate} data - Partial entity data to update
   * @returns {Promise<{data: T}>} Updated entity
   * @throws {NotFoundError} If entity doesn't exist
   * @throws {ValidationError} If update data is invalid
   */
  update(id: string, data: TUpdate): Promise<{ data: T }>;

  /**
   * Delete an entity.
   *
   * @async
   * @param {string} id - Entity ID to delete
   * @returns {Promise<{success: boolean}>} Deletion success status
   * @throws {NotFoundError} If entity doesn't exist
   * @throws {ForbiddenError} If user lacks permission
   */
  delete(id: string): Promise<{ success: boolean }>;

  /**
   * Bulk delete multiple entities (optional).
   *
   * @async
   * @param {string[]} ids - Array of entity IDs to delete
   * @returns {Promise<{success: boolean}>} Bulk deletion success status
   * @throws {Error} If any deletion fails
   */
  bulkDelete?(ids: string[]): Promise<{ success: boolean }>;

  /**
   * Bulk update multiple entities (optional).
   *
   * @async
   * @param {Array<{id: string, data: TUpdate}>} updates - Array of entity updates
   * @returns {Promise<{data: T[]}>} Updated entities
   * @throws {Error} If any update fails
   */
  bulkUpdate?(updates: Array<{ id: string; data: TUpdate }>): Promise<{ data: T[] }>;
}

/**
 * Configuration options for slice factory.
 *
 * Allows customization of generated slice behavior, including bulk operations,
 * custom reducers, and initial state overrides.
 *
 * @interface SliceFactoryOptions
 * @template T - Entity type extending BaseEntity
 *
 * @property {boolean} [enableBulkOperations=true] - Enable bulk delete and update operations
 * @property {Record<string, Function>} [extraReducers] - Additional custom reducers to include in slice
 * @property {Partial<EnhancedEntityState<T>>} [customInitialState] - Override default initial state values
 *
 * @example
 * ```typescript
 * const options: SliceFactoryOptions<Student> = {
 *   enableBulkOperations: true,
 *   extraReducers: {
 *     markAsActive: (state, action) => {
 *       const { id } = action.payload;
 *       state.entities[id].status = 'active';
 *     },
 *   },
 *   customInitialState: {
 *     pagination: { pageSize: 50 }, // Override default page size
 *   },
 * };
 * ```
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
 *
 * Provides the complete set of Redux slice components including the slice itself,
 * entity adapter, async thunks, action creators, and reducer. Use these to integrate
 * the generated slice into your Redux store and components.
 *
 * @interface SliceFactoryResult
 * @template T - Entity type extending BaseEntity
 * @template TCreate - Entity creation data shape
 * @template TUpdate - Entity update data shape
 *
 * @property {Slice} slice - Complete Redux Toolkit slice with reducers and actions
 * @property {EntityAdapter<T, string>} adapter - Entity adapter for normalized state access
 * @property {Object} thunks - Auto-generated async thunks for CRUD operations
 * @property {Record<string, unknown>} actions - Synchronous action creators from slice.actions
 * @property {Reducer} reducer - Reducer function to add to store configuration
 *
 * @example
 * ```typescript
 * // Create slice
 * const {
 *   slice,
 *   adapter,
 *   thunks,
 *   actions,
 *   reducer
 * } = createEntitySlice('students', studentApiService);
 *
 * // Export for use in store
 * export const studentsReducer = reducer;
 * export const studentsActions = actions;
 * export const studentsThunks = thunks;
 *
 * // Use adapter for selectors
 * export const studentsSelectors = adapter.getSelectors(
 *   (state: RootState) => state.students
 * );
 *
 * // Use in components
 * const dispatch = useAppDispatch();
 * dispatch(thunks.fetchList());
 * ```
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
 * Create a standardized Redux Toolkit slice with complete CRUD operations.
 *
 * This is the primary factory function for creating entity management slices.
 * Generates a fully-featured Redux slice with:
 * - EntityAdapter for normalized state management
 * - Async thunks for all CRUD operations
 * - Granular loading states (list, detail, create, update, delete, bulk)
 * - Pagination, sorting, filtering, and selection management
 * - Optional bulk operations
 * - UI state management
 * - Cache invalidation support
 *
 * The generated slice dramatically reduces boilerplate while ensuring consistency
 * across all entity management in the application.
 *
 * @template T - Entity type extending BaseEntity with id, createdAt, updatedAt
 * @template TCreate - Shape of data for entity creation (defaults to Partial<T>)
 * @template TUpdate - Shape of data for entity updates (defaults to Partial<T>)
 *
 * @param {string} name - Slice name (e.g., 'students', 'medications'). Used as Redux action prefix.
 * @param {EntityApiService<T, TCreate, TUpdate>} apiService - API service implementing EntityApiService interface
 * @param {SliceFactoryOptions<T>} [options={}] - Configuration options for slice customization
 * @param {boolean} [options.enableBulkOperations=true] - Enable bulk delete/update thunks
 * @param {Record<string, Function>} [options.extraReducers={}] - Custom reducers to add to slice
 * @param {Partial<EnhancedEntityState<T>>} [options.customInitialState={}] - Override default initial state
 *
 * @returns {SliceFactoryResult<T, TCreate, TUpdate>} Complete slice with thunks, actions, adapter, and reducer
 *
 * @example
 * ```typescript
 * // 1. Define your entity type
 * interface Student extends BaseEntity {
 *   firstName: string;
 *   lastName: string;
 *   grade: number;
 * }
 *
 * // 2. Implement API service
 * const studentApiService: EntityApiService<Student> = {
 *   getAll: async (params) => {
 *     const response = await api.get('/students', { params });
 *     return { data: response.data, total: response.total };
 *   },
 *   getById: async (id) => {
 *     const response = await api.get(`/students/${id}`);
 *     return { data: response.data };
 *   },
 *   create: async (data) => {
 *     const response = await api.post('/students', data);
 *     return { data: response.data };
 *   },
 *   update: async (id, data) => {
 *     const response = await api.patch(`/students/${id}`, data);
 *     return { data: response.data };
 *   },
 *   delete: async (id) => {
 *     await api.delete(`/students/${id}`);
 *     return { success: true };
 *   },
 * };
 *
 * // 3. Create the slice
 * const {
 *   slice: studentsSlice,
 *   thunks: studentsThunks,
 *   actions: studentsActions,
 *   adapter: studentsAdapter,
 *   reducer: studentsReducer,
 * } = createEntitySlice('students', studentApiService, {
 *   enableBulkOperations: true,
 * });
 *
 * // 4. Export for store configuration
 * export { studentsReducer, studentsThunks, studentsActions };
 *
 * // 5. Create selectors
 * export const studentsSelectors = studentsAdapter.getSelectors(
 *   (state: RootState) => state.students
 * );
 *
 * // 6. Use in components
 * function StudentList() {
 *   const dispatch = useAppDispatch();
 *   const students = useAppSelector(studentsSelectors.selectAll);
 *   const loading = useAppSelector(state => state.students.loading.list.isLoading);
 *
 *   useEffect(() => {
 *     dispatch(studentsThunks.fetchList());
 *   }, [dispatch]);
 *
 *   if (loading) return <Spinner />;
 *   return <div>{students.map(s => <StudentCard key={s.id} student={s} />)}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Advanced usage with custom reducers
 * const { slice, thunks, actions, reducer } = createEntitySlice(
 *   'students',
 *   studentApiService,
 *   {
 *     enableBulkOperations: true,
 *     extraReducers: {
 *       // Custom action to mark student as graduated
 *       markAsGraduated: (state, action: PayloadAction<{ id: string }>) => {
 *         const { id } = action.payload;
 *         if (state.entities[id]) {
 *           state.entities[id].status = 'graduated';
 *           state.entities[id].updatedAt = new Date().toISOString();
 *         }
 *       },
 *     },
 *     customInitialState: {
 *       pagination: { pageSize: 50 }, // Override default 25
 *       sort: { field: 'lastName', direction: 'asc' },
 *     },
 *   }
 * );
 * ```
 *
 * @remarks
 * **Generated Thunks**:
 * - `fetchList`: Fetch paginated list with filters/sort
 * - `fetchById`: Fetch single entity
 * - `create`: Create new entity
 * - `update`: Update existing entity
 * - `delete`: Delete entity
 * - `bulkDelete`: Delete multiple entities (if enabled)
 * - `bulkUpdate`: Update multiple entities (if enabled)
 *
 * **Generated Actions**:
 * - `setEntities`: Replace all entities
 * - `addEntity`: Add single entity
 * - `updateEntity`: Update single entity
 * - `removeEntity`: Remove single entity
 * - `setPagination`: Update pagination state
 * - `setSort`: Update sort configuration
 * - `setFilters`: Update active filters
 * - `clearFilters`: Clear all filters
 * - `selectEntity`: Select entity (multi-select support)
 * - `deselectEntity`: Deselect entity
 * - `clearSelection`: Clear all selections
 * - `selectAll`: Select all entities
 * - `setUI`: Update UI state (view mode, columns, etc.)
 * - `invalidateCache`: Mark cache as stale
 * - `clearErrors`: Clear all error states
 *
 * **State Structure**:
 * ```typescript
 * {
 *   ids: string[],                    // Ordered entity IDs
 *   entities: { [id]: Entity },       // Normalized entities
 *   loading: {
 *     list: LoadingState,              // List operation loading
 *     detail: LoadingState,            // Detail operation loading
 *     create: LoadingState,            // Create operation loading
 *     update: LoadingState,            // Update operation loading
 *     delete: LoadingState,            // Delete operation loading
 *     bulk: LoadingState,              // Bulk operation loading
 *   },
 *   pagination: PaginationState,       // Page, pageSize, total, etc.
 *   sort: SortState,                   // Sort field and direction
 *   filters: FilterState,              // Active filters and search
 *   selection: SelectionState,         // Selected IDs and focus
 *   ui: UIState,                       // View mode, columns, density
 *   cache: { lastFetched, isStale },   // Cache metadata
 * }
 * ```
 *
 * **Performance Considerations**:
 * - EntityAdapter provides O(1) lookups and optimized updates
 * - Normalized state prevents duplication
 * - Granular loading states prevent unnecessary re-renders
 * - Cache metadata supports intelligent refetching
 *
 * **Error Handling**:
 * - All thunks catch errors and store in loading[operation].error
 * - Use `.unwrap()` on dispatch to handle errors in components
 * - Errors include message, status code, and validation errors
 *
 * @see {@link EntityApiService} for API service requirements
 * @see {@link SliceFactoryOptions} for configuration options
 * @see {@link SliceFactoryResult} for return value details
 * @see {@link createHealthcareEntitySlice} for HIPAA-compliant variant
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
    sortComparer: (a: T, b: T) => {
      // Default sort by updatedAt descending
      if (!a.updatedAt || !b.updatedAt) return 0;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    },
  });

  // Create initial state
  const initialState = createInitialEnhancedState<T>(adapter, customInitialState);

  // Helper function to safely extract error information
  const extractErrorInfo = (error: unknown): ApiError => {
    if (error instanceof Error) {
      return {
        message: error.message,
        status: (error as { status?: number }).status,
        code: (error as { code?: string }).code,
        validationErrors: (error as { validationErrors?: Record<string, string[]> }).validationErrors,
      };
    }

    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      return {
        message: (err.message as string) || 'An error occurred',
        status: err.status as number,
        code: err.code as string,
        validationErrors: err.validationErrors as Record<string, string[]>,
      };
    }

    return {
      message: String(error) || 'An unknown error occurred',
    };
  };

  // Helper function to update loading state
  const updateLoadingState = (
    state: WritableDraft<EnhancedEntityState<T>>,
    operation: keyof EnhancedEntityState<T>['loading'],
    loading: Partial<LoadingState>
  ): void => {
    state.loading[operation] = { ...state.loading[operation], ...loading };
  };

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

    extraReducers: (builder: any) => {
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
        .addCase(fetchList.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(fetchList.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(fetchById.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
          adapter.upsertOne(state, action.payload.data);
          updateLoadingState(state, 'detail', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
        })
        .addCase(fetchById.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(create.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(create.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(update.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
          adapter.upsertOne(state, action.payload.data);
          updateLoadingState(state, 'update', {
            status: 'fulfilled',
            isLoading: false,
            error: null,
            completedAt: Date.now(),
          });
        })
        .addCase(update.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(deleteEntity.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
        .addCase(deleteEntity.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
          .addCase(bulkDelete.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
          .addCase(bulkDelete.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
          .addCase(bulkUpdate.fulfilled, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
            adapter.upsertMany(state, action.payload.data);
            updateLoadingState(state, 'bulk', {
              status: 'fulfilled',
              isLoading: false,
              error: null,
              completedAt: Date.now(),
            });
          })
          .addCase(bulkUpdate.rejected, (state: WritableDraft<EnhancedEntityState<T>>, action: any) => {
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
 * Healthcare-specific slice factory with HIPAA compliance features.
 *
 * Extends the standard entity slice factory with healthcare-specific functionality
 * including audit trail management and data classification tracking. Use this for
 * entities that contain Protected Health Information (PHI) or require HIPAA compliance.
 *
 * Additional Features Beyond Standard Slice:
 * - **Audit Trail Management**: addAuditRecord action for tracking PHI access
 * - **Data Classification**: updateDataClassification action for sensitivity updates
 * - **Compliance Fields**: Automatic handling of createdBy, modifiedBy, auditTrail
 * - **PHI Protection**: Inherits all entity management with compliance awareness
 *
 * @template T - Entity type extending HealthcareEntity (includes audit fields)
 * @template TCreate - Shape of data for entity creation
 * @template TUpdate - Shape of data for entity updates
 *
 * @param {string} name - Slice name (e.g., 'healthRecords', 'medications')
 * @param {EntityApiService<T, TCreate, TUpdate>} apiService - API service implementing EntityApiService
 * @param {SliceFactoryOptions<T>} [options={}] - Configuration options
 *
 * @returns {SliceFactoryResult<T, TCreate, TUpdate>} Complete slice with HIPAA compliance actions
 *
 * @example
 * ```typescript
 * interface HealthRecord extends HealthcareEntity {
 *   studentId: string;
 *   diagnosis: string;
 *   treatment: string;
 *   notes: string;
 * }
 *
 * const healthRecordsApiService: EntityApiService<HealthRecord> = {
 *   getAll: async (params) => {
 *     const response = await api.get('/health-records', { params });
 *     // API automatically logs PHI access
 *     return { data: response.data, total: response.total };
 *   },
 *   // ... other CRUD operations with audit logging
 * };
 *
 * const {
 *   slice,
 *   thunks,
 *   actions,
 *   reducer
 * } = createHealthcareEntitySlice('healthRecords', healthRecordsApiService);
 *
 * // Export for use in store
 * export { reducer as healthRecordsReducer, thunks as healthRecordsThunks };
 *
 * // Use in components (same as standard slice)
 * function HealthRecordsList() {
 *   const dispatch = useAppDispatch();
 *   const records = useAppSelector(state => state.healthRecords.entities);
 *
 *   useEffect(() => {
 *     dispatch(thunks.fetchList());
 *   }, [dispatch]);
 *
 *   return <div>{Object.values(records).map(r => <RecordCard key={r.id} record={r} />)}</div>;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Adding audit records programmatically
 * import { actions } from './healthRecordsSlice';
 *
 * // After viewing a health record
 * dispatch(actions.addAuditRecord({
 *   entityId: recordId,
 *   auditRecord: {
 *     timestamp: new Date().toISOString(),
 *     userId: currentUser.id,
 *     action: 'VIEW',
 *     ipAddress: userIpAddress,
 *     context: 'Viewed from student detail page',
 *   },
 * }));
 *
 * // Updating data classification
 * dispatch(actions.updateDataClassification({
 *   entityId: recordId,
 *   classification: 'PHI', // PHI, CONFIDENTIAL, INTERNAL, PUBLIC
 * }));
 * ```
 *
 * @remarks
 * **HIPAA Compliance Requirements**:
 * - All API operations must log PHI access to audit trail
 * - Audit records include timestamp, user, action, IP address
 * - Data classification must be set appropriately (PHI for patient data)
 * - No PHI should be persisted to browser storage
 * - Access logs must be maintained for 6 years minimum
 *
 * **Additional Actions Beyond Standard Slice**:
 * - `addAuditRecord`: Add audit trail entry to entity
 * - `updateDataClassification`: Update sensitivity classification
 *
 * **Healthcare Entity Fields**:
 * ```typescript
 * {
 *   id: string;
 *   createdAt: string;
 *   updatedAt: string;
 *   createdBy: string;           // User who created
 *   modifiedBy: string;          // User who last modified
 *   auditTrail: AuditRecord[];   // Complete access history
 *   dataClassification: 'PHI' | 'CONFIDENTIAL' | 'INTERNAL' | 'PUBLIC';
 * }
 * ```
 *
 * **Audit Record Structure**:
 * ```typescript
 * {
 *   timestamp: string;
 *   userId: string;
 *   action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'VIEW' | 'EXPORT' | 'PRINT';
 *   ipAddress?: string;
 *   context?: string;
 * }
 * ```
 *
 * @see {@link createEntitySlice} for standard entity slice factory
 * @see {@link HealthcareEntity} for healthcare entity interface
 * @see {@link AuditRecord} for audit record structure
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
      addAuditRecord: (state: any, action: PayloadAction<unknown>) => {
        const payload = action.payload as { entityId: string; auditRecord: AuditRecord };
        const { entityId, auditRecord } = payload;
        const entity = state.entities[entityId];
        if (entity && 'auditTrail' in entity) {
          const healthcareEntity = entity as HealthcareEntity;
          if (healthcareEntity.auditTrail) {
            healthcareEntity.auditTrail = [...healthcareEntity.auditTrail, auditRecord];
          } else {
            healthcareEntity.auditTrail = [auditRecord];
          }
        }
      },

      // Data classification updates
      updateDataClassification: (state: any, action: PayloadAction<unknown>) => {
        const payload = action.payload as { entityId: string; classification: DataClassification };
        const { entityId, classification } = payload;
        const entity = state.entities[entityId];
        if (entity && 'dataClassification' in entity) {
          const healthcareEntity = entity as HealthcareEntity;
          healthcareEntity.dataClassification = classification;
        }
      },
    },
  };

  return createEntitySlice(name, apiService, healthcareOptions);
}

/**
 * Utility function to create a simple entity slice with minimal configuration.
 *
 * Convenience wrapper around createEntitySlice with bulk operations disabled.
 * Use this for entities that don't require bulk delete/update operations,
 * reducing the number of generated thunks and keeping the slice lightweight.
 *
 * @template T - Entity type extending BaseEntity
 *
 * @param {string} name - Slice name (e.g., 'settings', 'profile')
 * @param {EntityApiService<T>} apiService - API service implementing EntityApiService interface
 *
 * @returns {SliceFactoryResult<T>} Complete slice without bulk operations
 *
 * @example
 * ```typescript
 * interface UserProfile extends BaseEntity {
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 * }
 *
 * const profileApiService: EntityApiService<UserProfile> = {
 *   getAll: async () => ({ data: [] }),       // Not used for profiles
 *   getById: async (id) => ({ data: await api.get(`/profile/${id}`) }),
 *   create: async (data) => ({ data: await api.post('/profile', data) }),
 *   update: async (id, data) => ({ data: await api.patch(`/profile/${id}`, data) }),
 *   delete: async (id) => ({ success: await api.delete(`/profile/${id}`) }),
 * };
 *
 * // Create simple slice without bulk operations
 * const {
 *   slice,
 *   thunks,
 *   actions,
 *   reducer
 * } = createSimpleSlice('profile', profileApiService);
 *
 * export { reducer as profileReducer, thunks as profileThunks };
 * ```
 *
 * @remarks
 * - Bulk operations (bulkDelete, bulkUpdate) are disabled
 * - All other features of createEntitySlice are included
 * - Use for singleton or low-volume entities
 * - Equivalent to: `createEntitySlice(name, apiService, { enableBulkOperations: false })`
 *
 * @see {@link createEntitySlice} for full-featured slice factory
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
