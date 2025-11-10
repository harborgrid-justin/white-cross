/**
 * State Management Type Definitions
 *
 * Type definitions for state management patterns, including Redux, Zustand,
 * and other state management solutions.
 *
 * @module types/state
 */

/**
 * Action creator function type
 */
export type ActionCreator<T = any, P = any> = (payload: P) => Action<T, P>;

/**
 * Redux-style action
 */
export interface Action<T = string, P = any> {
  /**
   * Action type
   */
  type: T;

  /**
   * Action payload
   */
  payload?: P;

  /**
   * Error flag
   */
  error?: boolean;

  /**
   * Additional metadata
   */
  meta?: Record<string, any>;
}

/**
 * Async action states
 */
export type AsyncActionState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

/**
 * Async slice state
 */
export interface AsyncSliceState<T, E = string> {
  /**
   * Current data
   */
  data: T | null;

  /**
   * Loading state
   */
  status: AsyncActionState;

  /**
   * Error message if failed
   */
  error: E | null;

  /**
   * Last updated timestamp
   */
  lastUpdated: number | null;
}

/**
 * Paginated state
 */
export interface PaginatedState<T> {
  /**
   * Items array
   */
  items: T[];

  /**
   * Current page
   */
  page: number;

  /**
   * Items per page
   */
  pageSize: number;

  /**
   * Total items count
   */
  total: number;

  /**
   * Total pages
   */
  totalPages: number;

  /**
   * Has next page
   */
  hasNextPage: boolean;

  /**
   * Has previous page
   */
  hasPreviousPage: boolean;
}

/**
 * Entity state with normalized data
 */
export interface EntityState<T> {
  /**
   * Entity IDs array
   */
  ids: string[];

  /**
   * Entities dictionary
   */
  entities: Record<string, T>;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error state
   */
  error: string | null;
}

/**
 * Entity adapter operations
 */
export interface EntityAdapter<T> {
  /**
   * Add one entity
   */
  addOne: (state: EntityState<T>, entity: T) => void;

  /**
   * Add many entities
   */
  addMany: (state: EntityState<T>, entities: T[]) => void;

  /**
   * Update one entity
   */
  updateOne: (
    state: EntityState<T>,
    update: { id: string; changes: Partial<T> },
  ) => void;

  /**
   * Update many entities
   */
  updateMany: (
    state: EntityState<T>,
    updates: Array<{ id: string; changes: Partial<T> }>,
  ) => void;

  /**
   * Remove one entity
   */
  removeOne: (state: EntityState<T>, id: string) => void;

  /**
   * Remove many entities
   */
  removeMany: (state: EntityState<T>, ids: string[]) => void;

  /**
   * Remove all entities
   */
  removeAll: (state: EntityState<T>) => void;

  /**
   * Set all entities
   */
  setAll: (state: EntityState<T>, entities: T[]) => void;
}

/**
 * Zustand store creator type
 */
export type StoreCreator<T> = (
  set: SetState<T>,
  get: GetState<T>,
  api: StoreApi<T>,
) => T;

/**
 * Set state function
 */
export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
) => void;

/**
 * Get state function
 */
export type GetState<T> = () => T;

/**
 * Store API
 */
export interface StoreApi<T> {
  /**
   * Set state
   */
  setState: SetState<T>;

  /**
   * Get current state
   */
  getState: GetState<T>;

  /**
   * Subscribe to state changes
   */
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;

  /**
   * Destroy store
   */
  destroy: () => void;
}

/**
 * Selector function
 */
export type Selector<T, R> = (state: T) => R;

/**
 * Equality function for selectors
 */
export type EqualityFn<T> = (a: T, b: T) => boolean;

/**
 * Store slice
 */
export interface StoreSlice<T extends Record<string, any>> {
  /**
   * Slice name
   */
  name: string;

  /**
   * Initial state
   */
  initialState: T;

  /**
   * Reducers
   */
  reducers: Record<string, (state: T, action: Action) => T | void>;

  /**
   * Extra reducers
   */
  extraReducers?: Record<string, (state: T, action: Action) => T | void>;
}

/**
 * Thunk action
 */
export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: Dispatch<A>,
  getState: () => S,
  extraArgument: E,
) => R;

/**
 * Dispatch function
 */
export type Dispatch<A extends Action = Action> = (action: A) => A;

/**
 * Middleware function
 */
export type Middleware<S = any, D extends Dispatch = Dispatch> = (
  store: { dispatch: D; getState: () => S },
) => (next: D) => (action: any) => any;

/**
 * Persisted state configuration
 */
export interface PersistConfig<T> {
  /**
   * Storage key
   */
  key: string;

  /**
   * Storage engine
   */
  storage: Storage;

  /**
   * State reconciler
   */
  stateReconciler?: (inboundState: Partial<T>, state: T) => T;

  /**
   * Whitelist of keys to persist
   */
  whitelist?: (keyof T)[];

  /**
   * Blacklist of keys to exclude
   */
  blacklist?: (keyof T)[];

  /**
   * Version number
   */
  version?: number;

  /**
   * Migration function
   */
  migrate?: (state: any, version: number) => Promise<T>;

  /**
   * Throttle persist calls (ms)
   */
  throttle?: number;
}

/**
 * Persisted state
 */
export interface PersistedState<T> {
  /**
   * State data
   */
  state: T;

  /**
   * Version number
   */
  version: number;

  /**
   * Last persisted timestamp
   */
  _persist: {
    version: number;
    rehydrated: boolean;
  };
}

/**
 * Optimistic update configuration
 */
export interface OptimisticUpdate<T> {
  /**
   * Optimistic data
   */
  data: T;

  /**
   * Rollback function if update fails
   */
  rollback: () => void;

  /**
   * Commit function when update succeeds
   */
  commit: () => void;

  /**
   * Update ID for tracking
   */
  id: string;
}

/**
 * State sync options
 */
export interface StateSyncOptions {
  /**
   * Sync key
   */
  key: string;

  /**
   * Broadcast channel or storage
   */
  channel: 'broadcast' | 'storage';

  /**
   * Sync predicate
   */
  predicate?: (action: Action) => boolean;

  /**
   * Sync blacklist
   */
  blacklist?: string[];

  /**
   * Sync whitelist
   */
  whitelist?: string[];
}
