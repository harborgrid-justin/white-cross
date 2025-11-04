/**
 * WF-COMP-145 | useSortState.ts - Sort state hook
 * Purpose: Hook for managing sort state with URL sync and persistence
 * Upstream: React, Next.js | Dependencies: react, next/navigation
 * Downstream: Table components, lists | Called by: React component tree
 * Related: Route state types, utilities
 * Exports: useSortState hook | Key Features: URL sync, column validation, persistence
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Sort state → URL updates → localStorage persistence
 * LLM Context: Sort state hook for Next.js App Router
 */

/**
 * Sort State Hook
 *
 * Provides sort state management with URL synchronization, column validation,
 * and optional localStorage persistence for user preferences.
 *
 * @module hooks/utilities/routeState/useSortState
 * @author White Cross Healthcare Platform
 */

'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type {
  SortConfig,
  SortState,
  SortDirection,
  UseSortStateReturn,
} from './types';
import { buildQueryString, getStorageItem, setStorageItem } from './urlStorage';

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
): UseSortStateReturn<T> {
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
      const stored = getStorageItem(`${storageKey}-${pathname}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as SortState<T>;
          if (parsed.column && validColumns.includes(parsed.column)) {
            return parsed;
          }
        } catch (error) {
          console.error('Failed to restore sort preference:', error);
        }
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

      const url = buildQueryString(newParams, pathname);
      router.replace(url);

      // Persist to localStorage if enabled
      if (persistPreference) {
        setStorageItem(
          `${storageKey}-${pathname}`,
          JSON.stringify(newState)
        );
      }
    },
    [
      searchParams,
      router,
      pathname,
      columnParam,
      directionParam,
      persistPreference,
      storageKey,
    ]
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
    column: state.column,
    direction: state.direction,
    sortBy,
    toggleSort,
    clearSort,
    getSortIndicator,
    getSortClass,
    state,
  };
}
