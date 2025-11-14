/**
 * WF-COMP-334 | utility-types.ts - Utility state management types
 * Purpose: Core utility types for state management
 * Upstream: Redux Toolkit, React | Dependencies: @reduxjs/toolkit
 * Downstream: Components, stores, hooks | Called by: State modules
 * Related: Redux state, React Context, form handling
 * Exports: RequestStatus, LoadingState, ErrorState, pagination, sorting
 * Last Updated: 2025-11-11 | File Type: .ts
 * Critical Path: State initialization → Request handling → Error management
 * LLM Context: Core utility types for state management across the application
 */

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
