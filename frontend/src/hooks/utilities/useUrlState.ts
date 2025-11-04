/**
 * URL State Management Hook
 *
 * Modern Next.js 15 hook for managing state in URL search parameters.
 * Provides type-safe, React-friendly interface for shareable URL state.
 *
 * @module hooks/utilities/useUrlState
 * @category State Management - URL State
 *
 * Features:
 * - Type-safe URL parameter management
 * - Automatic synchronization with UI state
 * - Browser history management
 * - Deep linking support
 * - Server/client compatibility
 *
 * Compliance: Items 166-170 (NEXTJS_GAP_ANALYSIS_CHECKLIST.md)
 * - [x] 166. Search params used for shareable state
 * - [x] 167. useSearchParams hook utilized
 * - [x] 168. URL state synchronized with UI
 * - [x] 169. Browser history managed properly
 * - [x] 170. Deep linking supported
 */

'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

/**
 * URL state parameter type definitions
 */
export type UrlStateValue = string | number | boolean | null | undefined;
export type UrlStateObject = Record<string, UrlStateValue | UrlStateValue[]>;

/**
 * Options for URL state updates
 */
export interface UrlStateOptions {
  /** Replace current history entry instead of pushing new one */
  replace?: boolean;
  /** Scroll to top after navigation */
  scroll?: boolean;
  /** Preserve existing params not specified in update */
  preserveOtherParams?: boolean;
}

/**
 * Hook return type
 */
export interface UseUrlStateResult<T extends UrlStateObject> {
  /** Current URL state object */
  state: T;
  /** Update URL state with new values */
  setState: (updates: Partial<T>, options?: UrlStateOptions) => void;
  /** Set a single URL parameter */
  setParam: (key: keyof T, value: UrlStateValue, options?: UrlStateOptions) => void;
  /** Remove URL parameters */
  removeParams: (keys: (keyof T)[], options?: UrlStateOptions) => void;
  /** Clear all URL parameters */
  clearAll: (options?: UrlStateOptions) => void;
  /** Get current URL with state */
  getUrl: (updates?: Partial<T>) => string;
  /** Raw URLSearchParams object */
  searchParams: URLSearchParams;
}

/**
 * Type guard for array values
 */
function isArrayValue(value: UrlStateValue | UrlStateValue[]): value is UrlStateValue[] {
  return Array.isArray(value);
}

/**
 * Convert URL parameter to typed value
 */
function parseUrlValue(value: string | null, type?: 'string' | 'number' | 'boolean'): UrlStateValue {
  if (value === null) return null;

  if (type === 'number') {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  if (type === 'boolean') {
    return value === 'true';
  }

  return value;
}

/**
 * Convert value to URL string
 */
function stringifyUrlValue(value: UrlStateValue): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

/**
 * Modern URL state management hook
 *
 * @template T - Type of state object
 * @param defaults - Default values for URL parameters
 * @param options - Configuration options
 * @returns URL state management interface
 *
 * @example Basic usage
 * ```tsx
 * function StudentsList() {
 *   const { state, setState, setParam } = useUrlState({
 *     page: 1,
 *     search: '',
 *     grade: null as string | null,
 *     sortBy: 'name',
 *   });
 *
 *   // Read state
 *   console.log(state.page, state.search);
 *
 *   // Update single param
 *   setParam('page', 2);
 *
 *   // Update multiple params
 *   setState({ search: 'john', page: 1 });
 * }
 * ```
 *
 * @example With filters
 * ```tsx
 * function IncidentsList() {
 *   const filters = useUrlState({
 *     type: null as string | null,
 *     severity: null as string | null,
 *     status: null as string | null,
 *     dateFrom: null as string | null,
 *     dateTo: null as string | null,
 *   });
 *
 *   // Clear all filters
 *   filters.clearAll();
 *
 *   // Apply filters
 *   filters.setState({
 *     type: 'INJURY',
 *     severity: 'HIGH',
 *   });
 * }
 * ```
 *
 * @example Deep linking
 * ```tsx
 * function ShareableReport() {
 *   const { state, getUrl } = useUrlState({
 *     reportId: '',
 *     dateRange: '30d',
 *     format: 'pdf',
 *   });
 *
 *   const shareableLink = getUrl({
 *     reportId: 'report-123',
 *     dateRange: '90d',
 *   });
 *
 *   // shareableLink: "/reports?reportId=report-123&dateRange=90d&format=pdf"
 * }
 * ```
 */
export function useUrlState<T extends UrlStateObject>(
  defaults: T,
  globalOptions: UrlStateOptions = {}
): UseUrlStateResult<T> {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parse current URL state
  const state = useMemo(() => {
    const result = { ...defaults } as T;

    Object.keys(defaults).forEach((key) => {
      const paramValue = searchParams.get(key);
      const defaultValue = defaults[key];

      if (paramValue !== null) {
        // Infer type from default value
        if (typeof defaultValue === 'number') {
          result[key as keyof T] = parseUrlValue(paramValue, 'number') as T[keyof T];
        } else if (typeof defaultValue === 'boolean') {
          result[key as keyof T] = parseUrlValue(paramValue, 'boolean') as T[keyof T];
        } else {
          result[key as keyof T] = paramValue as T[keyof T];
        }
      }
    });

    return result;
  }, [searchParams, defaults]);

  /**
   * Build URL with updated parameters
   */
  const getUrl = useCallback((updates: Partial<T> = {}): string => {
    const newParams = new URLSearchParams();
    const mergedState = { ...state, ...updates };

    Object.entries(mergedState).forEach(([key, value]) => {
      const stringValue = stringifyUrlValue(value as UrlStateValue);
      if (stringValue !== null && stringValue !== '' && value !== defaults[key as keyof T]) {
        newParams.set(key, stringValue);
      }
    });

    const queryString = newParams.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [state, pathname, defaults]);

  /**
   * Update URL state
   */
  const setState = useCallback((
    updates: Partial<T>,
    options: UrlStateOptions = {}
  ) => {
    const opts = { ...globalOptions, ...options };
    const url = getUrl(updates);

    if (opts.replace) {
      router.replace(url, { scroll: opts.scroll ?? false });
    } else {
      router.push(url, { scroll: opts.scroll ?? false });
    }
  }, [router, getUrl, globalOptions]);

  /**
   * Set single parameter
   */
  const setParam = useCallback((
    key: keyof T,
    value: UrlStateValue,
    options: UrlStateOptions = {}
  ) => {
    setState({ [key]: value } as Partial<T>, options);
  }, [setState]);

  /**
   * Remove parameters
   */
  const removeParams = useCallback((
    keys: (keyof T)[],
    options: UrlStateOptions = {}
  ) => {
    const updates = {} as Partial<T>;
    keys.forEach(key => {
      updates[key] = defaults[key];
    });
    setState(updates, options);
  }, [setState, defaults]);

  /**
   * Clear all parameters
   */
  const clearAll = useCallback((options: UrlStateOptions = {}) => {
    const opts = { ...globalOptions, ...options };
    if (opts.replace) {
      router.replace(pathname, { scroll: opts.scroll ?? false });
    } else {
      router.push(pathname, { scroll: opts.scroll ?? false });
    }
  }, [router, pathname, globalOptions]);

  return {
    state,
    setState,
    setParam,
    removeParams,
    clearAll,
    getUrl,
    searchParams: searchParams as URLSearchParams,
  };
}

/**
 * Pagination-specific URL state hook
 *
 * @example
 * ```tsx
 * function PaginatedList() {
 *   const pagination = usePaginationState({ defaultPageSize: 20 });
 *
 *   return (
 *     <Pagination
 *       page={pagination.page}
 *       pageSize={pagination.pageSize}
 *       onPageChange={pagination.setPage}
 *       onPageSizeChange={pagination.setPageSize}
 *     />
 *   );
 * }
 * ```
 */
export function usePaginationState(options: {
  defaultPage?: number;
  defaultPageSize?: number;
} = {}) {
  const { defaultPage = 1, defaultPageSize = 20 } = options;

  const { state, setParam } = useUrlState({
    page: defaultPage,
    limit: defaultPageSize,
  });

  return {
    page: state.page,
    pageSize: state.limit,
    setPage: (page: number) => setParam('page', page, { replace: true }),
    setPageSize: (limit: number) => setParam('limit', limit, { replace: true }),
    reset: () => setParam('page', defaultPage, { replace: true }),
  };
}

/**
 * Filter state hook for list views
 *
 * @example
 * ```tsx
 * function FilteredList() {
 *   const filters = useFilterState({
 *     search: '',
 *     category: null,
 *     status: 'active',
 *     tags: [] as string[],
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={filters.state.search}
 *         onChange={(e) => filters.setFilter('search', e.target.value)}
 *       />
 *       <button onClick={filters.clearFilters}>Clear All</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFilterState<T extends UrlStateObject>(defaults: T) {
  const { state, setState, setParam, clearAll } = useUrlState(defaults, {
    replace: true, // Filters should replace, not push history
  });

  return {
    state,
    setFilter: setParam,
    setFilters: setState,
    clearFilters: clearAll,
    hasActiveFilters: useMemo(() => {
      return Object.entries(state).some(([key, value]) => {
        const defaultValue = defaults[key as keyof T];
        return value !== defaultValue && value !== null && value !== '';
      });
    }, [state, defaults]),
  };
}

export default useUrlState;
