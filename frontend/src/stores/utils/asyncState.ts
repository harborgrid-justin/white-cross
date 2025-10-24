/**
 * Async State Utilities
 *
 * Type-safe discriminated union types and utilities for async operations.
 * Provides better type inference and exhaustiveness checking for loading states.
 *
 * @module stores/utils/asyncState
 */

/**
 * Idle state - no operation has been initiated
 */
export interface IdleState {
  status: 'idle';
  data: null;
  error: null;
  timestamp: null;
}

/**
 * Loading state - operation in progress
 */
export interface LoadingState<T = any> {
  status: 'loading';
  data: T | null; // May have stale data from previous success
  error: null;
  timestamp: number; // When loading started
  previousData?: T; // Optional: preserve previous successful data
}

/**
 * Success state - operation completed successfully
 */
export interface SuccessState<T> {
  status: 'success';
  data: T;
  error: null;
  timestamp: number; // When success occurred
}

/**
 * Error state - operation failed
 */
export interface ErrorState {
  status: 'error';
  data: null;
  error: {
    message: string;
    code?: string | number;
    details?: any;
  };
  timestamp: number; // When error occurred
}

/**
 * Discriminated union type for async operations
 * Enables exhaustive type checking and better inference
 */
export type AsyncState<T> = IdleState | LoadingState<T> | SuccessState<T> | ErrorState;

/**
 * Type guards for async state
 */
export const isIdleState = <T>(state: AsyncState<T>): state is IdleState =>
  state.status === 'idle';

export const isLoadingState = <T>(state: AsyncState<T>): state is LoadingState<T> =>
  state.status === 'loading';

export const isSuccessState = <T>(state: AsyncState<T>): state is SuccessState<T> =>
  state.status === 'success';

export const isErrorState = <T>(state: AsyncState<T>): state is ErrorState =>
  state.status === 'error';

/**
 * Utility to create initial idle state
 */
export const createIdleState = (): IdleState => ({
  status: 'idle',
  data: null,
  error: null,
  timestamp: null,
});

/**
 * Utility to create loading state
 */
export const createLoadingState = <T>(previousData?: T): LoadingState<T> => ({
  status: 'loading',
  data: previousData || null,
  error: null,
  timestamp: Date.now(),
  previousData,
});

/**
 * Utility to create success state
 */
export const createSuccessState = <T>(data: T): SuccessState<T> => ({
  status: 'success',
  data,
  error: null,
  timestamp: Date.now(),
});

/**
 * Utility to create error state
 */
export const createErrorState = (
  message: string,
  code?: string | number,
  details?: any
): ErrorState => ({
  status: 'error',
  data: null,
  error: { message, code, details },
  timestamp: Date.now(),
});

/**
 * Helper to get data from async state (with null check)
 */
export const getAsyncData = <T>(state: AsyncState<T>): T | null => {
  return isSuccessState(state) ? state.data : null;
};

/**
 * Helper to get error from async state
 */
export const getAsyncError = <T>(state: AsyncState<T>): ErrorState['error'] | null => {
  return isErrorState(state) ? state.error : null;
};

/**
 * Helper to check if state is loading or has data
 */
export const isLoadingOrHasData = <T>(state: AsyncState<T>): boolean => {
  return isLoadingState(state) || isSuccessState(state);
};

/**
 * Helper to check if state should show loading indicator
 * (loading without stale data)
 */
export const shouldShowLoading = <T>(state: AsyncState<T>): boolean => {
  return isLoadingState(state) && state.data === null;
};

/**
 * Helper to check if state has valid data
 */
export const hasValidData = <T>(state: AsyncState<T>): state is SuccessState<T> => {
  return isSuccessState(state) && state.data !== null;
};

/**
 * Paginated async state
 */
export interface PaginatedAsyncState<T> extends AsyncState<T[]> {
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  } | null;
}

/**
 * Create initial paginated state
 */
export const createPaginatedIdleState = <T>(): PaginatedAsyncState<T> => ({
  ...createIdleState(),
  pagination: null,
});

/**
 * Create paginated success state
 */
export const createPaginatedSuccessState = <T>(
  data: T[],
  pagination: PaginatedAsyncState<T>['pagination']
): PaginatedAsyncState<T> => ({
  ...createSuccessState(data),
  pagination,
});
