/**
 * WF-COMP-145 | useRouteState.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: react, react-router-dom
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, types | Key Features: useState, useEffect, useMemo
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Enterprise Route-Level State Persistence Hooks
 *
 * DEPRECATED: This file uses legacy react-router-dom patterns.
 * Use useRouteState.tsx instead which is properly migrated to Next.js App Router.
 *
 * Comprehensive hooks for managing and persisting state across route changes,
 * page reloads, and browser navigation. These hooks provide type-safe state
 * management synchronized with URL parameters and localStorage.
 *
 * @module hooks/useRouteState
 * @author White Cross Healthcare Platform
 * @deprecated Use useRouteState.tsx instead
 */

'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// =====================
// TYPE DEFINITIONS
// =====================

/**
 * Serialization configuration for complex types
 */
interface SerializationConfig {
  /** Custom serializer function */
  serialize?: (value: any) => string;
  /** Custom deserializer function */
  deserialize?: (value: string) => any;
}

/**
 * Options for useRouteState hook
 */
interface RouteStateOptions<T> extends SerializationConfig {
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
 * Filter configuration for usePersistedFilters
 */
interface FilterConfig<T> {
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
 * Navigation state structure
 */
interface NavigationState {
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
 * Pagination state structure
 */
interface PaginationState {
  /** Current page number (1-indexed) */
  page: number;
  /** Items per page */
  pageSize: number;
}

/**
 * Pagination configuration
 */
interface PaginationConfig {
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
 * Sort direction
 */
type SortDirection = 'asc' | 'desc';

/**
 * Sort state structure
 */
interface SortState<T extends string = string> {
  /** Column to sort by */
  column: T | null;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Sort configuration
 */
interface SortConfig<T extends string = string> {
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

// =====================
// SERIALIZATION UTILITIES
// =====================

/**
 * Default serialization for common types.
 * Handles primitives, arrays, and objects safely.
 *
 * @internal
 */
const defaultSerialize = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

/**
 * Default deserialization with type inference.
 * Attempts to parse JSON for arrays and objects.
 *
 * @internal
 */
const defaultDeserialize = (value: string): any => {
  if (!value) {
    return null;
  }

  // Try boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Try number
  const num = Number(value);
  if (!isNaN(num) && value === String(num)) {
    return num;
  }

  // Try JSON (arrays/objects)
  if (value.startsWith('[') || value.startsWith('{')) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
};

/**
 * Safe JSON parse with error handling
 *
 * @internal
 */
const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};

// =====================
// HOOK: useRouteState
// =====================

/**
 * Hook for persisting state in URL query parameters with type safety.
 *
 * Automatically syncs state with URL params and provides type-safe access.
 * Supports complex types via custom serialization.
 *
 * @template T - The type of state value
 * @param options - Configuration options
 * @returns Tuple of [value, setValue, clearValue]
 *
 * @example
 * ```tsx
 * // Simple string state
 * const [search, setSearch] = useRouteState({
 *   paramName: 'search',
 *   defaultValue: ''
 * });
 *
 * // Array state with custom serialization
 * const [selectedIds, setSelectedIds] = useRouteState({
 *   paramName: 'selected',
 *   defaultValue: [] as string[],
 *   serialize: (ids) => ids.join(','),
 *   deserialize: (str) => str ? str.split(',') : []
 * });
 *
 * // Complex object with validation
 * const [filters, setFilters] = useRouteState({
 *   paramName: 'filters',
 *   defaultValue: { grade: '', status: 'active' },
 *   validate: (val): val is FilterType => {
 *     return typeof val === 'object' && 'grade' in val;
 *   },
 *   onValidationError: (err) => console.error('Invalid filters:', err)
 * });
 * ```
 */
export function useRouteState<T>(options: RouteStateOptions<T>): [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void
] {
  const {
    paramName,
    defaultValue,
    replace = false,
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    validate,
    onValidationError,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse initial value from URL
  const initialValue = useMemo(() => {
    const paramValue = searchParams.get(paramName);

    if (!paramValue) {
      return defaultValue;
    }

    try {
      const deserialized = deserialize(paramValue);

      if (validate && !validate(deserialized)) {
        const error = new Error(`Invalid value for parameter "${paramName}"`);
        onValidationError?.(error);
        return defaultValue;
      }

      return deserialized as T;
    } catch (error) {
      console.error(`Failed to deserialize "${paramName}":`, error);
      onValidationError?.(error as Error);
      return defaultValue;
    }
  }, [paramName, searchParams, defaultValue, deserialize, validate, onValidationError]);

  const [value, setValue] = useState<T>(initialValue);

  // Sync value to URL when it changes
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolvedValue = typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue;

        // Update URL params
        const newParams = new URLSearchParams(searchParams.toString());

        if (resolvedValue === defaultValue || resolvedValue === null || resolvedValue === undefined) {
          // Remove param if value is default/null/undefined
          newParams.delete(paramName);
        } else {
          try {
            const serialized = serialize(resolvedValue);
            if (serialized) {
              newParams.set(paramName, serialized);
            } else {
              newParams.delete(paramName);
            }
          } catch (error) {
            console.error(`Failed to serialize "${paramName}":`, error);
          }
        }

        const queryString = newParams.toString();
        const method = replace ? router.replace : router.push;
        method(queryString ? `${pathname}?${queryString}` : pathname);

        return resolvedValue;
      });
    },
    [paramName, defaultValue, serialize, searchParams, router, pathname, replace]
  );

  // Clear value and remove from URL
  const clearValue = useCallback(() => {
    setValue(defaultValue);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(paramName);
    const queryString = newParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }, [paramName, defaultValue, searchParams, router, pathname]);

  // Sync from URL when search params change externally
  useEffect(() => {
    const paramValue = searchParams.get(paramName);

    if (!paramValue) {
      if (value !== defaultValue) {
        setValue(defaultValue);
      }
      return;
    }

    try {
      const deserialized = deserialize(paramValue);

      if (validate && !validate(deserialized)) {
        console.warn(`Invalid value for parameter "${paramName}", using default`);
        setValue(defaultValue);
        return;
      }

      setValue(deserialized as T);
    } catch (error) {
      console.error(`Failed to deserialize "${paramName}":`, error);
      setValue(defaultValue);
    }
  }, [paramName, searchParams, defaultValue, deserialize, validate]);

  return [value, updateValue, clearValue];
}

// =====================
// HOOK: usePersistedFilters
// =====================

/**
 * Hook for persisting filter state to localStorage with debouncing.
 *
 * Automatically saves and restores filter state across page reloads.
 * Includes debouncing to avoid excessive localStorage writes.
 *
 * @template T - The type of filter state
 * @param config - Filter configuration
 * @returns Object with filters, setFilters, clearFilters, and isRestored
 *
 * @example
 * ```tsx
 * interface StudentFilters {
 *   grade: string;
 *   gender: string;
 *   status: string;
 *   search: string;
 * }
 *
 * const {
 *   filters,
 *   setFilters,
 *   updateFilter,
 *   clearFilters,
 *   isRestored
 * } = usePersistedFilters<StudentFilters>({
 *   storageKey: 'student-filters',
 *   defaultFilters: {
 *     grade: '',
 *     gender: '',
 *     status: 'active',
 *     search: ''
 *   },
 *   debounceMs: 500,
 *   syncWithUrl: true
 * });
 *
 * // Update a single filter
 * updateFilter('grade', '5');
 *
 * // Update multiple filters
 * setFilters({ ...filters, grade: '5', status: 'active' });
 *
 * // Clear all filters
 * clearFilters();
 * ```
 */
export function usePersistedFilters<T extends Record<string, any>>(
  config: FilterConfig<T>
) {
  const {
    storageKey,
    defaultFilters,
    debounceMs = 300,
    syncWithUrl = false,
    validate,
  } = config;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isRestored, setIsRestored] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize filters from localStorage or URL
  const [filters, setFiltersState] = useState<T>(() => {
    if (syncWithUrl) {
      // Try to load from URL first
      const urlFilters: Partial<T> = {};
      let hasUrlParams = false;

      Object.keys(defaultFilters).forEach((key) => {
        const value = searchParams.get(key);
        if (value !== null) {
          hasUrlParams = true;
          try {
            urlFilters[key as keyof T] = defaultDeserialize(value);
          } catch {
            urlFilters[key as keyof T] = value as any;
          }
        }
      });

      if (hasUrlParams) {
        const merged = { ...defaultFilters, ...urlFilters };
        if (!validate || validate(merged)) {
          return merged;
        }
      }
    }

    // Fall back to localStorage
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        if (!validate || validate(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(`Failed to restore filters from localStorage:`, error);
    }

    return defaultFilters;
  });

  // Mark as restored after initial render
  useEffect(() => {
    setIsRestored(true);
  }, []);

  // Debounced save to localStorage
  const saveToStorage = useCallback(
    (filtersToSave: T) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(filtersToSave));
        } catch (error) {
          console.error(`Failed to save filters to localStorage:`, error);
        }
      }, debounceMs);
    },
    [storageKey, debounceMs]
  );

  // Update filters with localStorage and optional URL sync
  const setFilters = useCallback(
    (newFilters: T | ((prev: T) => T)) => {
      setFiltersState((prev) => {
        const resolved = typeof newFilters === 'function'
          ? (newFilters as (prev: T) => T)(prev)
          : newFilters;

        // Validate if validator provided
        if (validate && !validate(resolved)) {
          console.warn('Invalid filters provided, keeping previous state');
          return prev;
        }

        // Save to localStorage
        saveToStorage(resolved);

        // Sync with URL if enabled
        if (syncWithUrl) {
          const newParams = new URLSearchParams(searchParams.toString());

          Object.entries(resolved).forEach(([key, value]) => {
            if (value === defaultFilters[key as keyof T] || value === null || value === undefined || value === '') {
              newParams.delete(key);
            } else {
              newParams.set(key, defaultSerialize(value));
            }
          });

          const queryString = newParams.toString();
          router.replace(queryString ? `${pathname}?${queryString}` : pathname);
        }

        return resolved;
      });
    },
    [validate, saveToStorage, syncWithUrl, searchParams, router, pathname, defaultFilters]
  );

  // Update a single filter property
  const updateFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFilters]
  );

  // Clear filters back to defaults
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);

    if (syncWithUrl) {
      router.replace(pathname);
    }

    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`Failed to clear filters from localStorage:`, error);
    }
  }, [defaultFilters, setFilters, syncWithUrl, router, pathname, storageKey]);

  // Clean up debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    /** Current filter state */
    filters,
    /** Update all filters */
    setFilters,
    /** Update a single filter */
    updateFilter,
    /** Clear all filters to defaults */
    clearFilters,
    /** Whether filters have been restored from storage */
    isRestored,
  };
}

// =====================
// HOOK: useNavigationState
// =====================

/**
 * Hook for tracking navigation history and preserving state.
 *
 * Tracks previous route state and scroll position, enabling
 * "back with state" functionality and scroll restoration.
 *
 * @returns Navigation state utilities
 *
 * @example
 * ```tsx
 * const {
 *   previousPath,
 *   previousState,
 *   navigateBack,
 *   navigateWithState,
 *   getScrollPosition
 * } = useNavigationState();
 *
 * // Navigate with preserved state
 * const handleNavigate = () => {
 *   navigateWithState('/students/123', { from: 'list' });
 * };
 *
 * // Navigate back with state restoration
 * const handleBack = () => {
 *   navigateBack(); // Returns to previous route with scroll position
 * };
 * ```
 */
export function useNavigationState() {
  const pathname = usePathname();
  const router = useRouter();
  const navigationHistoryRef = useRef<NavigationState[]>([]);
  const currentScrollRef = useRef({ x: 0, y: 0 });

  // Track current scroll position
  useEffect(() => {
    const handleScroll = () => {
      currentScrollRef.current = {
        x: window.scrollX,
        y: window.scrollY,
      };
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track navigation changes
  useEffect(() => {
    const history = navigationHistoryRef.current;
    const currentPath = pathname;

    // Don't track if it's the same path (just param changes)
    if (history.length > 0 && history[history.length - 1].previousPath === currentPath) {
      return;
    }

    // Add to history
    const newEntry: NavigationState = {
      previousPath: history.length > 0 ? history[history.length - 1].previousPath : null,
      previousState: null, // Next.js doesn't support location.state in the same way
      scrollPosition: { ...currentScrollRef.current },
      timestamp: Date.now(),
    };

    navigationHistoryRef.current = [
      ...history.slice(-9), // Keep last 10 entries
      { ...newEntry, previousPath: currentPath },
    ];
  }, [pathname]);

  // Get previous navigation state
  const getPreviousState = useCallback((): NavigationState | null => {
    const history = navigationHistoryRef.current;
    return history.length > 1 ? history[history.length - 2] : null;
  }, []);

  // Navigate to a path with state
  // Note: Next.js doesn't support state in the same way as React Router
  // Consider using URL params or other state management instead
  const navigateWithState = useCallback(
    (path: string, state?: any) => {
      if (state) {
        console.warn('Next.js navigation does not support state parameter. Consider using URL params instead.');
      }
      router.push(path);
    },
    [router]
  );

  // Navigate back with state restoration
  const navigateBack = useCallback(
    (fallbackPath: string = '/') => {
      const prevState = getPreviousState();

      if (prevState?.previousPath) {
        router.push(prevState.previousPath);

        // Restore scroll position after navigation
        if (prevState.scrollPosition) {
          setTimeout(() => {
            window.scrollTo(
              prevState.scrollPosition!.x,
              prevState.scrollPosition!.y
            );
          }, 0);
        }
      } else {
        router.push(fallbackPath);
      }
    },
    [router, getPreviousState]
  );

  // Get scroll position for a specific path
  const getScrollPosition = useCallback(
    (path?: string): { x: number; y: number } | null => {
      if (!path) {
        return currentScrollRef.current;
      }

      const entry = navigationHistoryRef.current.find(
        (state) => state.previousPath === path
      );

      return entry?.scrollPosition || null;
    },
    []
  );

  const prevState = getPreviousState();

  return {
    /** Previous route path */
    previousPath: prevState?.previousPath || null,
    /** Previous route state */
    previousState: prevState?.previousState || null,
    /** Whether there is a previous path to navigate back to */
    canGoBack: !!prevState?.previousPath,
    /** Navigate with state preservation */
    navigateWithState,
    /** Navigate back with state restoration */
    navigateBack,
    /** Get scroll position for a path */
    getScrollPosition,
    /** Current scroll position */
    currentScroll: currentScrollRef.current,
  };
}

// =====================
// HOOK: usePageState
// =====================

/**
 * Hook for managing pagination state with URL sync and per-route memory.
 *
 * Automatically syncs pagination with URL params and remembers
 * page state per route path.
 *
 * @param config - Pagination configuration
 * @returns Pagination state and utilities
 *
 * @example
 * ```tsx
 * const {
 *   page,
 *   pageSize,
 *   setPage,
 *   setPageSize,
 *   resetPage,
 *   totalPages
 * } = usePageState({
 *   defaultPage: 1,
 *   defaultPageSize: 20,
 *   pageSizeOptions: [10, 20, 50, 100],
 *   resetOnFilterChange: true
 * });
 *
 * // Use with API calls
 * const { data } = useQuery({
 *   queryKey: ['students', page, pageSize, filters],
 *   queryFn: () => fetchStudents({ page, pageSize, ...filters })
 * });
 *
 * // Calculate total pages
 * useEffect(() => {
 *   if (data?.total) {
 *     // Component will have access to totalPages
 *   }
 * }, [data]);
 * ```
 */
export function usePageState(config: PaginationConfig = {}) {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    pageParam = 'page',
    pageSizeParam = 'pageSize',
    resetOnFilterChange = true,
  } = config;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Per-route page memory
  const pageMemoryRef = useRef<Map<string, PaginationState>>(new Map());
  
  // Ref to track last filter state for resetOnFilterChange
  const lastFiltersRef = useRef<string>('');

  // Initialize from URL or memory
  const [state, setState] = useState<PaginationState>(() => {
    const urlPage = searchParams.get(pageParam);
    const urlPageSize = searchParams.get(pageSizeParam);

    if (urlPage || urlPageSize) {
      return {
        page: urlPage ? Math.max(1, parseInt(urlPage, 10)) : defaultPage,
        pageSize: urlPageSize ? parseInt(urlPageSize, 10) : defaultPageSize,
      };
    }

    // Check memory for this route
    const remembered = pageMemoryRef.current.get(pathname);
    if (remembered) {
      return remembered;
    }

    return {
      page: defaultPage,
      pageSize: defaultPageSize,
    };
  });

  // Update URL and memory when state changes
  const updateState = useCallback(
    (newState: Partial<PaginationState>) => {
      setState((prev) => {
        const updated = { ...prev, ...newState };

        // Save to route memory
        pageMemoryRef.current.set(pathname, updated);

        // Update URL using router
        const newParams = new URLSearchParams(searchParams.toString());

        if (updated.page === defaultPage) {
          newParams.delete(pageParam);
        } else {
          newParams.set(pageParam, String(updated.page));
        }

        if (updated.pageSize === defaultPageSize) {
          newParams.delete(pageSizeParam);
        } else {
          newParams.set(pageSizeParam, String(updated.pageSize));
        }

        const queryString = newParams.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);

        return updated;
      });
    },
    [pathname, router, searchParams, pageParam, pageSizeParam, defaultPage, defaultPageSize]
  );

  // Set page number
  const setPage = useCallback(
    (page: number | ((prev: number) => number)) => {
      const newPage = typeof page === 'function' ? page(state.page) : page;
      updateState({ page: Math.max(1, newPage) });
    },
    [state.page, updateState]
  );

  // Set page size (resets to page 1)
  const setPageSize = useCallback(
    (pageSize: number) => {
      if (!pageSizeOptions.includes(pageSize)) {
        console.warn(`Invalid page size: ${pageSize}. Must be one of ${pageSizeOptions.join(', ')}`);
        return;
      }
      updateState({ page: 1, pageSize });
    },
    [pageSizeOptions, updateState]
  );

  // Reset to first page
  const resetPage = useCallback(() => {
    updateState({ page: defaultPage });
  }, [updateState, defaultPage]);

  // Reset page when filters change (if enabled)
  useEffect(() => {
    if (resetOnFilterChange) {
      // Get all params except pagination
      const filterParams = new URLSearchParams(searchParams);
      filterParams.delete(pageParam);
      filterParams.delete(pageSizeParam);

      // Store filter string to detect changes
      const filterString = filterParams.toString();

      if (lastFiltersRef.current !== filterString && state.page !== defaultPage) {
        resetPage();
      }

      lastFiltersRef.current = filterString;
    }
  }, [searchParams, pageParam, pageSizeParam, resetOnFilterChange, resetPage, state.page, defaultPage]);

  return {
    /** Current page number */
    page: state.page,
    /** Current page size */
    pageSize: state.pageSize,
    /** Available page size options */
    pageSizeOptions,
    /** Set page number */
    setPage,
    /** Set page size */
    setPageSize,
    /** Reset to first page */
    resetPage,
    /** Full pagination state */
    state,
  };
}

// =====================
// HOOK: useSortState
// =====================

/**
 * Hook for managing sort state with URL sync and persistence.
 *
 * Validates sort columns and persists sort preferences.
 * Syncs with URL params for shareable sorted views.
 *
 * @template T - Union type of valid column names
 * @param config - Sort configuration
 * @returns Sort state and utilities
 *
 * @example
 * ```tsx
 * type StudentColumn = 'lastName' | 'firstName' | 'grade' | 'dateOfBirth';
 *
 * const {
 *   column,
 *   direction,
 *   sortBy,
 *   toggleSort,
 *   clearSort,
 *   getSortIndicator
 * } = useSortState<StudentColumn>({
 *   validColumns: ['lastName', 'firstName', 'grade', 'dateOfBirth'],
 *   defaultColumn: 'lastName',
 *   defaultDirection: 'asc',
 *   persistPreference: true,
 *   storageKey: 'student-sort-preference'
 * });
 *
 * // Use in table headers
 * <th onClick={() => toggleSort('lastName')}>
 *   Last Name {getSortIndicator('lastName')}
 * </th>
 *
 * // Use with API calls
 * const { data } = useQuery({
 *   queryKey: ['students', sortBy],
 *   queryFn: () => fetchStudents({ sortBy })
 * });
 * ```
 */
export function useSortState<T extends string = string>(
  config: SortConfig<T>
) {
  const {
    validColumns,
    defaultColumn = null,
    defaultDirection = 'asc',
    columnParam = 'sortBy',
    directionParam = 'sortDir',
    persistPreference = false,
    storageKey = 'sort-preference',
  } = config;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Initialize sort state
  const [state, setState] = useState<SortState<T>>(() => {
    // Try URL first
    const urlColumn = searchParams.get(columnParam) as T | null;
    const urlDirection = searchParams.get(directionParam) as SortDirection | null;

    if (urlColumn && validColumns.includes(urlColumn)) {
      return {
        column: urlColumn,
        direction: urlDirection === 'desc' ? 'desc' : 'asc',
      };
    }

    // Try localStorage if persistence enabled
    if (persistPreference) {
      try {
        const stored = localStorage.getItem(`${storageKey}-${pathname}`);
        if (stored) {
          const parsed = JSON.parse(stored) as SortState<T>;
          if (parsed.column && validColumns.includes(parsed.column)) {
            return parsed;
          }
        }
      } catch (error) {
        console.error('Failed to restore sort preference:', error);
      }
    }

    return {
      column: defaultColumn,
      direction: defaultDirection,
    };
  });

  // Update sort state with URL and localStorage sync
  const updateSort = useCallback(
    (newState: SortState<T>) => {
      setState(newState);

      // Update URL
      const newParams = new URLSearchParams(searchParams.toString());

      if (newState.column === null) {
        newParams.delete(columnParam);
        newParams.delete(directionParam);
      } else {
        newParams.set(columnParam, newState.column);
        newParams.set(directionParam, newState.direction);
      }

      const queryString = newParams.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);

      // Persist to localStorage if enabled
      if (persistPreference) {
        try {
          localStorage.setItem(
            `${storageKey}-${pathname}`,
            JSON.stringify(newState)
          );
        } catch (error) {
          console.error('Failed to persist sort preference:', error);
        }
      }
    },
    [searchParams, router, pathname, columnParam, directionParam, persistPreference, storageKey]
  );

  // Sort by a specific column
  const sortBy = useCallback(
    (column: T, direction?: SortDirection) => {
      if (!validColumns.includes(column)) {
        console.warn(`Invalid sort column: ${column}`);
        return;
      }

      updateSort({
        column,
        direction: direction || defaultDirection,
      });
    },
    [validColumns, defaultDirection, updateSort]
  );

  // Toggle sort for a column (cycles: asc -> desc -> null)
  const toggleSort = useCallback(
    (column: T) => {
      if (!validColumns.includes(column)) {
        console.warn(`Invalid sort column: ${column}`);
        return;
      }

      setState((prev) => {
        let newState: SortState<T>;

        if (prev.column !== column) {
          // New column: start with asc
          newState = { column, direction: 'asc' };
        } else if (prev.direction === 'asc') {
          // Same column, asc: switch to desc
          newState = { column, direction: 'desc' };
        } else {
          // Same column, desc: clear sort
          newState = { column: defaultColumn, direction: defaultDirection };
        }

        // Update URL and storage
        updateSort(newState);

        return newState;
      });
    },
    [validColumns, defaultColumn, defaultDirection, updateSort]
  );

  // Clear sort back to default
  const clearSort = useCallback(() => {
    updateSort({
      column: defaultColumn,
      direction: defaultDirection,
    });
  }, [defaultColumn, defaultDirection, updateSort]);

  // Get sort indicator for UI (arrows, etc.)
  const getSortIndicator = useCallback(
    (column: T): '↑' | '↓' | '' => {
      if (state.column !== column) {
        return '';
      }
      return state.direction === 'asc' ? '↑' : '↓';
    },
    [state]
  );

  // Get CSS class for sort indicator
  const getSortClass = useCallback(
    (column: T): string => {
      if (state.column !== column) {
        return '';
      }
      return state.direction === 'asc' ? 'sort-asc' : 'sort-desc';
    },
    [state]
  );

  return {
    /** Current sort column */
    column: state.column,
    /** Current sort direction */
    direction: state.direction,
    /** Sort by specific column */
    sortBy,
    /** Toggle sort for column */
    toggleSort,
    /** Clear sort to default */
    clearSort,
    /** Get sort indicator character */
    getSortIndicator,
    /** Get sort CSS class */
    getSortClass,
    /** Full sort state */
    state,
  };
}

// =====================
// EXPORTS
// =====================

export type {
  RouteStateOptions,
  FilterConfig,
  NavigationState,
  PaginationState,
  PaginationConfig,
  SortState,
  SortDirection,
  SortConfig,
};
