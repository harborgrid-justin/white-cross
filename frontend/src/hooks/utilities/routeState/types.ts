/**
 * WF-COMP-145 | types.ts - Type definitions for route state management
 * Purpose: Centralized type definitions for route state hooks
 * Upstream: None | Dependencies: None
 * Downstream: All route state modules | Called by: Route state utilities and hooks
 * Related: useRouteState hooks, route utilities
 * Exports: Types and interfaces | Key Features: Type safety for route state
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Type definitions → Hook implementations → Component usage
 * LLM Context: Type definitions module for Next.js App Router route state management
 */

/**
 * Type Definitions for Enterprise Route-Level State Persistence
 *
 * Comprehensive type definitions for managing and persisting state across route changes,
 * page reloads, and browser navigation. These types provide type-safe state
 * management synchronized with URL parameters and localStorage.
 *
 * @module hooks/utilities/routeState/types
 * @author White Cross Healthcare Platform
 */

'use client';

// =====================
// SERIALIZATION TYPES
// =====================

/**
 * Serialization configuration for complex types
 */
export interface SerializationConfig {
  /** Custom serializer function */
  serialize?: (value: any) => string;
  /** Custom deserializer function */
  deserialize?: (value: string) => any;
}

// =====================
// ROUTE STATE TYPES
// =====================

/**
 * Options for useRouteState hook
 */
export interface RouteStateOptions<T> extends SerializationConfig {
  /** Default value if not found in URL */
  defaultValue: T;
  /** Parameter name in URL query string */
  paramName: string;
  /** Replace URL instead of pushing to history */
  replace?: boolean;
  /** Validate deserialized value */
  validate?: (value: any) => value is T;
  /** Called when validation fails */
  onValidationError?: (error: Error) => void;
}

/**
 * Return type for useRouteState hook
 */
export type UseRouteStateReturn<T> = [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void
];

// =====================
// FILTER TYPES
// =====================

/**
 * Filter configuration for usePersistedFilters
 */
export interface FilterConfig<T> {
  /** Unique key for localStorage */
  storageKey: string;
  /** Default filter values */
  defaultFilters: T;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Also sync with URL params */
  syncWithUrl?: boolean;
  /** Validate filter values */
  validate?: (filters: T) => boolean;
}

/**
 * Return type for usePersistedFilters hook
 */
export interface UsePersistedFiltersReturn<T extends Record<string, any>> {
  /** Current filter state */
  filters: T;
  /** Update all filters */
  setFilters: (newFilters: T | ((prev: T) => T)) => void;
  /** Update a single filter */
  updateFilter: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Clear all filters to defaults */
  clearFilters: () => void;
  /** Whether filters have been restored from storage */
  isRestored: boolean;
}

// =====================
// NAVIGATION TYPES
// =====================

/**
 * Navigation state structure
 */
export interface NavigationState {
  /** Previous route path */
  previousPath: string | null;
  /** Previous route state */
  previousState: any;
  /** Scroll position from previous route */
  scrollPosition: { x: number; y: number } | null;
  /** Timestamp of navigation */
  timestamp: number;
}

/**
 * Return type for useNavigationState hook
 */
export interface UseNavigationStateReturn {
  /** Previous route path */
  previousPath: string | null;
  /** Previous route state */
  previousState: any;
  /** Whether there is a previous path to navigate back to */
  canGoBack: boolean;
  /** Navigate with state preservation */
  navigateWithState: (path: string, state?: any) => void;
  /** Navigate back with state restoration */
  navigateBack: (fallbackPath?: string) => void;
  /** Get scroll position for a path */
  getScrollPosition: (path?: string) => { x: number; y: number } | null;
  /** Current scroll position */
  currentScroll: { x: number; y: number };
}

// =====================
// PAGINATION TYPES
// =====================

/**
 * Pagination state structure
 */
export interface PaginationState {
  /** Current page number (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Default page number */
  defaultPage?: number;
  /** Default page size */
  defaultPageSize?: number;
  /** Available page size options */
  pageSizeOptions?: number[];
  /** Parameter name for page in URL */
  pageParam?: string;
  /** Parameter name for page size in URL */
  pageSizeParam?: string;
  /** Reset to page 1 on filter change */
  resetOnFilterChange?: boolean;
}

/**
 * Return type for usePageState hook
 */
export interface UsePageStateReturn {
  /** Current page number */
  page: number;
  /** Current page size */
  pageSize: number;
  /** Available page size options */
  pageSizeOptions: number[];
  /** Set page number */
  setPage: (page: number | ((prev: number) => number)) => void;
  /** Set page size */
  setPageSize: (pageSize: number) => void;
  /** Reset to first page */
  resetPage: () => void;
  /** Full pagination state */
  state: PaginationState;
}

// =====================
// SORT TYPES
// =====================

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort state structure
 */
export interface SortState<T extends string = string> {
  /** Column to sort by */
  column: T | null;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Sort configuration
 */
export interface SortConfig<T extends string = string> {
  /** Default sort column */
  defaultColumn?: T | null;
  /** Default sort direction */
  defaultDirection?: SortDirection;
  /** Valid column names */
  validColumns: T[];
  /** Parameter name for column in URL */
  columnParam?: string;
  /** Parameter name for direction in URL */
  directionParam?: string;
  /** Also persist in localStorage */
  persistPreference?: boolean;
  /** Storage key for preferences */
  storageKey?: string;
}

/**
 * Return type for useSortState hook
 */
export interface UseSortStateReturn<T extends string = string> {
  /** Current sort column */
  column: T | null;
  /** Current sort direction */
  direction: SortDirection;
  /** Sort by specific column */
  sortBy: (column: T, direction?: SortDirection) => void;
  /** Toggle sort for column */
  toggleSort: (column: T) => void;
  /** Clear sort to default */
  clearSort: () => void;
  /** Get sort indicator character */
  getSortIndicator: (column: T) => '↑' | '↓' | '';
  /** Get sort CSS class */
  getSortClass: (column: T) => string;
  /** Full sort state */
  state: SortState<T>;
}
