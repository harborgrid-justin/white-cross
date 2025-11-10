/**
 * React Hooks Type Definitions
 *
 * Type definitions for custom hooks and hook patterns.
 * Ensures type safety for hook return values and parameters.
 *
 * @module types/hooks
 */

import { DependencyList, EffectCallback } from 'react';

/**
 * Async state hook return type
 */
export interface AsyncState<T, E = Error> {
  /**
   * Current data value
   */
  data: T | null;

  /**
   * Loading state
   */
  loading: boolean;

  /**
   * Error if operation failed
   */
  error: E | null;

  /**
   * Whether operation completed successfully
   */
  success: boolean;
}

/**
 * Async operation result
 */
export type AsyncResult<T, E = Error> = AsyncState<T, E> & {
  /**
   * Execute the async operation
   */
  execute: (...args: any[]) => Promise<T>;

  /**
   * Reset the state
   */
  reset: () => void;

  /**
   * Set data directly
   */
  setData: (data: T | null) => void;

  /**
   * Set error directly
   */
  setError: (error: E | null) => void;
};

/**
 * Pagination hook state
 */
export interface PaginationState {
  /**
   * Current page number (1-indexed)
   */
  page: number;

  /**
   * Items per page
   */
  pageSize: number;

  /**
   * Total number of items
   */
  total: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;
}

/**
 * Pagination hook actions
 */
export interface PaginationActions {
  /**
   * Go to next page
   */
  nextPage: () => void;

  /**
   * Go to previous page
   */
  previousPage: () => void;

  /**
   * Go to specific page
   */
  goToPage: (page: number) => void;

  /**
   * Change page size
   */
  setPageSize: (pageSize: number) => void;

  /**
   * Reset to first page
   */
  reset: () => void;
}

/**
 * Pagination hook return type
 */
export type UsePaginationResult = PaginationState & PaginationActions;

/**
 * Form state
 */
export interface FormState<T> {
  /**
   * Form values
   */
  values: T;

  /**
   * Form errors
   */
  errors: Partial<Record<keyof T, string>>;

  /**
   * Touched fields
   */
  touched: Partial<Record<keyof T, boolean>>;

  /**
   * Whether form is submitting
   */
  isSubmitting: boolean;

  /**
   * Whether form is valid
   */
  isValid: boolean;

  /**
   * Whether form is dirty
   */
  isDirty: boolean;
}

/**
 * Form actions
 */
export interface FormActions<T> {
  /**
   * Update field value
   */
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;

  /**
   * Update multiple values
   */
  setValues: (values: Partial<T>) => void;

  /**
   * Set field error
   */
  setError: <K extends keyof T>(field: K, error: string) => void;

  /**
   * Set multiple errors
   */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;

  /**
   * Mark field as touched
   */
  setTouched: <K extends keyof T>(field: K, touched: boolean) => void;

  /**
   * Handle field blur
   */
  handleBlur: <K extends keyof T>(field: K) => () => void;

  /**
   * Handle field change
   */
  handleChange: <K extends keyof T>(field: K) => (value: T[K]) => void;

  /**
   * Submit form
   */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;

  /**
   * Reset form
   */
  reset: () => void;

  /**
   * Validate form
   */
  validate: () => boolean;
}

/**
 * Form hook return type
 */
export type UseFormResult<T> = FormState<T> & FormActions<T>;

/**
 * Toggle hook return type
 */
export interface UseToggleResult {
  /**
   * Current toggle state
   */
  value: boolean;

  /**
   * Set toggle to true
   */
  setTrue: () => void;

  /**
   * Set toggle to false
   */
  setFalse: () => void;

  /**
   * Toggle the value
   */
  toggle: () => void;

  /**
   * Set specific value
   */
  setValue: (value: boolean) => void;
}

/**
 * Debounced value hook options
 */
export interface DebounceOptions {
  /**
   * Delay in milliseconds
   */
  delay?: number;

  /**
   * Leading edge execution
   */
  leading?: boolean;

  /**
   * Trailing edge execution
   */
  trailing?: boolean;

  /**
   * Maximum wait time
   */
  maxWait?: number;
}

/**
 * Local storage hook return type
 */
export interface UseLocalStorageResult<T> {
  /**
   * Stored value
   */
  value: T;

  /**
   * Update stored value
   */
  setValue: (value: T | ((prev: T) => T)) => void;

  /**
   * Remove value from storage
   */
  remove: () => void;

  /**
   * Whether value is loading
   */
  loading: boolean;

  /**
   * Error if operation failed
   */
  error: Error | null;
}

/**
 * Media query hook return type
 */
export interface UseMediaQueryResult {
  /**
   * Whether media query matches
   */
  matches: boolean;

  /**
   * Media query string
   */
  query: string;
}

/**
 * Intersection observer options
 */
export interface IntersectionObserverOptions {
  /**
   * Root element
   */
  root?: Element | null;

  /**
   * Root margin
   */
  rootMargin?: string;

  /**
   * Threshold(s)
   */
  threshold?: number | number[];

  /**
   * Trigger only once
   */
  triggerOnce?: boolean;
}

/**
 * Intersection observer hook return type
 */
export interface UseIntersectionObserverResult {
  /**
   * Whether element is intersecting
   */
  isIntersecting: boolean;

  /**
   * Intersection ratio
   */
  intersectionRatio: number;

  /**
   * Reference to attach to element
   */
  ref: (node: Element | null) => void;

  /**
   * Full intersection observer entry
   */
  entry: IntersectionObserverEntry | null;
}

/**
 * Window size hook return type
 */
export interface UseWindowSizeResult {
  /**
   * Window width in pixels
   */
  width: number;

  /**
   * Window height in pixels
   */
  height: number;

  /**
   * Whether window is mobile size
   */
  isMobile: boolean;

  /**
   * Whether window is tablet size
   */
  isTablet: boolean;

  /**
   * Whether window is desktop size
   */
  isDesktop: boolean;
}

/**
 * Previous value hook return type
 */
export type UsePreviousResult<T> = T | undefined;

/**
 * Mounted state hook return type
 */
export type UseIsMountedResult = () => boolean;

/**
 * Update effect callback
 */
export type UpdateEffectCallback = EffectCallback;

/**
 * Interval callback
 */
export type IntervalCallback = () => void;

/**
 * Timeout callback
 */
export type TimeoutCallback = () => void;

/**
 * Event listener options
 */
export interface EventListenerOptions {
  /**
   * Event listener options
   */
  options?: boolean | AddEventListenerOptions;

  /**
   * Whether to listen during capture phase
   */
  capture?: boolean;

  /**
   * Whether to call preventDefault
   */
  preventDefault?: boolean;
}

/**
 * Copy to clipboard result
 */
export interface UseCopyToClipboardResult {
  /**
   * Copied value
   */
  value: string | null;

  /**
   * Copy function
   */
  copy: (text: string) => Promise<void>;

  /**
   * Whether copy was successful
   */
  copied: boolean;

  /**
   * Reset copied state
   */
  reset: () => void;
}

/**
 * Click outside options
 */
export interface ClickOutsideOptions {
  /**
   * Whether to enable the listener
   */
  enabled?: boolean;

  /**
   * Event type to listen for
   */
  eventType?: 'mousedown' | 'mouseup' | 'click';
}
