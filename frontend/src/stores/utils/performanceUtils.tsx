/**
 * Redux Performance Optimization Utilities
 *
 * Tools and helpers for optimizing Redux performance in the application.
 */

import { createSelector } from '@reduxjs/toolkit';
import { useEffect, useRef, useMemo, useState } from 'react';
import { useAppSelector } from '../hooks';
import type { RootState } from '../reduxStore';

/**
 * Create a memoized selector factory for parameterized selectors
 *
 * @example
 * const selectStudentsByGrade = createParameterizedSelector(
 *   (state: RootState) => state.students.entities,
 *   (entities, grade: string) =>
 *     Object.values(entities).filter(s => s?.grade === grade)
 * );
 *
 * // Usage in component:
 * const grade5Students = useAppSelector(state => selectStudentsByGrade(state, '5'));
 */
export function createParameterizedSelector<State, Params extends any[], Result>(
  ...funcs: any[]
) {
  return createSelector(...funcs);
}

/**
 * Shallow compare two objects for equality
 * Useful for optimizing re-renders
 */
export function shallowEqual(objA: any, objB: any): boolean {
  if (objA === objB) return true;
  if (!objA || !objB) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => objA[key] === objB[key]);
}

/**
 * Hook that only triggers re-render when selected value changes deeply
 *
 * @example
 * const student = useDeepEqualSelector(state =>
 *   state.students.entities[studentId]
 * );
 */
export function useDeepEqualSelector<T>(
  selector: (state: RootState) => T
): T {
  const value = useAppSelector(selector);
  const ref = useRef<T>(value);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Deep equality check
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every(key => deepEqual(a[key], b[key]));
}

/**
 * Hook for throttled selector updates
 * Useful for high-frequency updates like scroll position
 *
 * @example
 * const scrollPosition = useThrottledSelector(
 *   state => state.ui.scrollPosition,
 *   100 // Update at most every 100ms
 * );
 */
export function useThrottledSelector<T>(
  selector: (state: RootState) => T,
  delay: number
): T {
  const value = useAppSelector(selector);
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeLeft = delay - (now - lastRan.current);

    if (timeLeft <= 0) {
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, timeLeft);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

/**
 * Create a selector that paginate results
 *
 * @example
 * const selectPaginatedStudents = createPaginatedSelector(
 *   (state: RootState) => selectActiveStudents(state),
 *   (state: RootState) => state.students.pagination
 * );
 */
export function createPaginatedSelector<T>(
  dataSelector: (state: RootState) => T[],
  paginationSelector: (state: RootState) => { page: number; limit: number }
) {
  return createSelector(
    [dataSelector, paginationSelector],
    (data, pagination) => {
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      return data.slice(start, end);
    }
  );
}

/**
 * Create a selector that sorts data
 *
 * @example
 * const selectSortedStudents = createSortedSelector(
 *   (state: RootState) => selectActiveStudents(state),
 *   (state: RootState) => state.students.sortConfig,
 *   {
 *     firstName: (a, b) => a.firstName.localeCompare(b.firstName),
 *     lastName: (a, b) => a.lastName.localeCompare(b.lastName),
 *     grade: (a, b) => parseInt(a.grade) - parseInt(b.grade),
 *   }
 * );
 */
export function createSortedSelector<T extends Record<string, any>>(
  dataSelector: (state: RootState) => T[],
  sortConfigSelector: (state: RootState) => { field: string; direction: 'asc' | 'desc' },
  comparators: Record<string, (a: T, b: T) => number>
) {
  return createSelector(
    [dataSelector, sortConfigSelector],
    (data, sortConfig) => {
      const comparator = comparators[sortConfig.field];
      if (!comparator) return data;

      const sorted = [...data].sort(comparator);
      return sortConfig.direction === 'desc' ? sorted.reverse() : sorted;
    }
  );
}

/**
 * Create a filtered selector with multiple filter conditions
 *
 * @example
 * const selectFilteredStudents = createFilteredSelector(
 *   (state: RootState) => selectAllStudents(state),
 *   (state: RootState) => state.students.filters,
 *   {
 *     grade: (student, value) => student.grade === value,
 *     isActive: (student, value) => student.isActive === value,
 *     search: (student, value) =>
 *       student.firstName.toLowerCase().includes(value.toLowerCase()) ||
 *       student.lastName.toLowerCase().includes(value.toLowerCase()),
 *   }
 * );
 */
export function createFilteredSelector<T extends Record<string, any>, F extends Record<string, any>>(
  dataSelector: (state: RootState) => T[],
  filtersSelector: (state: RootState) => F,
  filterFunctions: Record<keyof F, (item: T, value: any) => boolean>
) {
  return createSelector(
    [dataSelector, filtersSelector],
    (data, filters) => {
      return data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null || value === '') return true;

          const filterFn = filterFunctions[key as keyof F];
          return filterFn ? filterFn(item, value) : true;
        });
      });
    }
  );
}

/**
 * Hook that batches multiple selector updates
 * Useful when you need to select multiple pieces of state at once
 *
 * @example
 * const [students, medications, appointments] = useBatchedSelectors([
 *   (state) => selectActiveStudents(state),
 *   (state) => selectActiveMedications(state),
 *   (state) => selectUpcomingAppointments(state),
 * ]);
 */
export function useBatchedSelectors<T extends any[]>(
  selectors: Array<(state: RootState) => any>
): T {
  return useMemo(() => {
    const state = (window as any).__REDUX_STORE__?.getState();
    return selectors.map(selector => selector(state)) as T;
  }, [selectors]);
}

/**
 * Monitor selector performance
 * Logs timing information for slow selectors in development
 *
 * @example
 * const students = useAppSelector(
 *   monitorPerformance(
 *     selectComplexStudentData,
 *     'Complex Student Selector'
 *   )
 * );
 */
export function monitorPerformance<T>(
  selector: (state: RootState) => T,
  label: string
): (state: RootState) => T {
  return (state: RootState) => {
    if (import.meta.env.DEV) {
      const start = performance.now();
      const result = selector(state);
      const end = performance.now();
      const duration = end - start;

      if (duration > 16) { // Slower than 60fps (16.67ms)
        console.warn(
          `[Redux Performance] Slow selector "${label}": ${duration.toFixed(2)}ms`
        );
      }

      return result;
    }

    return selector(state);
  };
}

/**
 * Create a selector that implements virtual scrolling logic
 * Only returns items in the current viewport
 *
 * @example
 * const visibleStudents = useAppSelector(
 *   createVirtualizedSelector(
 *     selectAllStudents,
 *     100, // Item height in pixels
 *     state => state.ui.scrollPosition,
 *     state => state.ui.viewportHeight
 *   )
 * );
 */
export function createVirtualizedSelector<T>(
  dataSelector: (state: RootState) => T[],
  itemHeight: number,
  scrollPositionSelector: (state: RootState) => number,
  viewportHeightSelector: (state: RootState) => number,
  overscan: number = 5
) {
  return createSelector(
    [dataSelector, scrollPositionSelector, viewportHeightSelector],
    (data, scrollPosition, viewportHeight) => {
      const startIndex = Math.max(
        0,
        Math.floor(scrollPosition / itemHeight) - overscan
      );
      const endIndex = Math.min(
        data.length,
        Math.ceil((scrollPosition + viewportHeight) / itemHeight) + overscan
      );

      return {
        items: data.slice(startIndex, endIndex),
        startIndex,
        endIndex,
        totalHeight: data.length * itemHeight,
        offsetY: startIndex * itemHeight,
      };
    }
  );
}

/**
 * Create a cached selector that invalidates after a certain time
 * Useful for data that should auto-refresh
 *
 * @example
 * const recentStudents = useAppSelector(
 *   createCachedSelector(
 *     selectAllStudents,
 *     60000 // Cache for 60 seconds
 *   )
 * );
 */
export function createCachedSelector<T>(
  selector: (state: RootState) => T,
  ttlMs: number
): (state: RootState) => T {
  let cache: { value: T; timestamp: number } | null = null;

  return (state: RootState) => {
    const now = Date.now();

    if (!cache || now - cache.timestamp > ttlMs) {
      cache = {
        value: selector(state),
        timestamp: now,
      };
    }

    return cache.value;
  };
}

/**
 * Performance monitoring HOC for components
 * Logs render time and re-render frequency
 *
 * @example
 * export default withPerformanceMonitoring(StudentsList, 'StudentsList');
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const renderCount = useRef(0);
    const lastRenderTime = useRef(Date.now());

    useEffect(() => {
      renderCount.current++;
      const now = Date.now();
      const timeSinceLastRender = now - lastRenderTime.current;

      if (import.meta.env.DEV) {
        console.log(
          `[Performance] ${componentName} rendered ${renderCount.current} times. ` +
          `Time since last render: ${timeSinceLastRender}ms`
        );
      }

      lastRenderTime.current = now;
    });

    return <Component {...props} />;
  };
}

/**
 * Utilities for state normalization
 * Helps convert between normalized and denormalized data
 */
export const normalizationUtils = {
  /**
   * Normalize an array of entities by ID
   */
  normalize<T extends { id: string }>(entities: T[]) {
    return entities.reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {} as Record<string, T>);
  },

  /**
   * Denormalize entities by extracting them from normalized state
   */
  denormalize<T>(
    ids: string[],
    entities: Record<string, T | undefined>
  ): T[] {
    return ids
      .map(id => entities[id])
      .filter((entity): entity is T => entity !== undefined);
  },

  /**
   * Add related entities to normalized data
   */
  addRelations<T extends { id: string }, R extends { id: string }>(
    entities: T[],
    relationKey: keyof T,
    relatedEntities: Record<string, R>
  ) {
    return entities.map(entity => ({
      ...entity,
      [relationKey]: relatedEntities[(entity[relationKey] as any) as string],
    }));
  },
};

/**
 * Create a selector that implements search/filter with highlighting
 *
 * @example
 * const searchResults = useAppSelector(
 *   createSearchSelector(
 *     selectAllStudents,
 *     state => state.students.searchQuery,
 *     ['firstName', 'lastName', 'email']
 *   )
 * );
 */
export function createSearchSelector<T extends Record<string, any>>(
  dataSelector: (state: RootState) => T[],
  searchQuerySelector: (state: RootState) => string,
  searchFields: (keyof T)[]
) {
  return createSelector(
    [dataSelector, searchQuerySelector],
    (data, searchQuery) => {
      if (!searchQuery) return data;

      const query = searchQuery.toLowerCase();

      return data.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return typeof value === 'string' && value.toLowerCase().includes(query);
        })
      );
    }
  );
}

// Re-export React for convenience
import React from 'react';
