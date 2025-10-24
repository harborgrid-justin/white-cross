/**
 * Selector Utilities
 *
 * Utilities for creating memoized selectors with Reselect.
 * Provides common selector patterns and performance optimizations.
 *
 * @module stores/utils/selectors
 */

import { createSelector, Selector, OutputSelector } from '@reduxjs/toolkit';
import type { RootState } from '../reduxStore';

/**
 * Create a memoized selector that filters an array by predicate
 */
export const createFilterSelector = <T, R>(
  selectItems: Selector<RootState, T[]>,
  filterFn: (item: T, ...args: R[]) => boolean
): OutputSelector<[RootState, ...R[]], T[], (items: T[], ...args: R[]) => T[]> => {
  return createSelector(
    [selectItems, (...args: [RootState, ...R[]]) => args.slice(1) as R[]],
    (items, args) => items.filter(item => filterFn(item, ...args))
  );
};

/**
 * Create a memoized selector that finds a single item by predicate
 */
export const createFindSelector = <T, R extends any[]>(
  selectItems: Selector<RootState, T[]>,
  findFn: (item: T, ...args: R) => boolean
): OutputSelector<[RootState, ...R], T | undefined, (items: T[], ...args: R) => T | undefined> => {
  return createSelector(
    [selectItems, (...args: [RootState, ...R]) => args.slice(1) as R],
    (items, args) => items.find(item => findFn(item, ...args))
  );
};

/**
 * Create a memoized selector that sorts an array
 */
export const createSortSelector = <T>(
  selectItems: Selector<RootState, T[]>,
  compareFn: (a: T, b: T) => number
): OutputSelector<[RootState], T[], (items: T[]) => T[]> => {
  return createSelector(
    [selectItems],
    (items) => [...items].sort(compareFn)
  );
};

/**
 * Create a memoized selector that maps array items
 */
export const createMapSelector = <T, U>(
  selectItems: Selector<RootState, T[]>,
  mapFn: (item: T) => U
): OutputSelector<[RootState], U[], (items: T[]) => U[]> => {
  return createSelector(
    [selectItems],
    (items) => items.map(mapFn)
  );
};

/**
 * Create a memoized selector that counts items matching a predicate
 */
export const createCountSelector = <T, R extends any[]>(
  selectItems: Selector<RootState, T[]>,
  predicate?: (item: T, ...args: R) => boolean
): OutputSelector<[RootState, ...R], number, (items: T[], ...args: R) => number> => {
  return createSelector(
    [selectItems, (...args: [RootState, ...R]) => args.slice(1) as R],
    (items, args) => {
      if (!predicate) return items.length;
      return items.filter(item => predicate(item, ...args)).length;
    }
  );
};

/**
 * Create a memoized selector that groups items by a key function
 */
export const createGroupBySelector = <T, K extends string | number>(
  selectItems: Selector<RootState, T[]>,
  keyFn: (item: T) => K
): OutputSelector<[RootState], Record<K, T[]>, (items: T[]) => Record<K, T[]>> => {
  return createSelector(
    [selectItems],
    (items) => {
      return items.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(item);
        return groups;
      }, {} as Record<K, T[]>);
    }
  );
};

/**
 * Create a memoized selector that computes statistics
 */
export const createStatsSelector = <T>(
  selectItems: Selector<RootState, T[]>,
  valueFn: (item: T) => number
): OutputSelector<[RootState], { count: number; sum: number; avg: number; min: number; max: number }, any> => {
  return createSelector(
    [selectItems],
    (items) => {
      if (items.length === 0) {
        return { count: 0, sum: 0, avg: 0, min: 0, max: 0 };
      }

      const values = items.map(valueFn);
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return { count: items.length, sum, avg, min, max };
    }
  );
};

/**
 * Create a memoized selector that checks if any item matches predicate
 */
export const createExistsSelector = <T, R extends any[]>(
  selectItems: Selector<RootState, T[]>,
  predicate: (item: T, ...args: R) => boolean
): OutputSelector<[RootState, ...R], boolean, (items: T[], ...args: R) => boolean> => {
  return createSelector(
    [selectItems, (...args: [RootState, ...R]) => args.slice(1) as R],
    (items, args) => items.some(item => predicate(item, ...args))
  );
};

/**
 * Create a memoized selector that paginates items
 */
export const createPaginationSelector = <T>(
  selectItems: Selector<RootState, T[]>,
  selectPage: Selector<RootState, number>,
  selectPageSize: Selector<RootState, number>
): OutputSelector<[RootState], { items: T[]; page: number; pageSize: number; total: number; totalPages: number }, any> => {
  return createSelector(
    [selectItems, selectPage, selectPageSize],
    (items, page, pageSize) => {
      const total = items.length;
      const totalPages = Math.ceil(total / pageSize);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedItems = items.slice(start, end);

      return {
        items: paginatedItems,
        page,
        pageSize,
        total,
        totalPages,
      };
    }
  );
};

/**
 * Create a memoized selector that searches items by text
 */
export const createSearchSelector = <T>(
  selectItems: Selector<RootState, T[]>,
  selectSearchQuery: Selector<RootState, string>,
  searchFields: ((item: T) => string)[]
): OutputSelector<[RootState], T[], (items: T[], query: string) => T[]> => {
  return createSelector(
    [selectItems, selectSearchQuery],
    (items, query) => {
      if (!query || query.trim() === '') return items;

      const lowerQuery = query.toLowerCase();
      return items.filter(item =>
        searchFields.some(fieldFn =>
          fieldFn(item).toLowerCase().includes(lowerQuery)
        )
      );
    }
  );
};

/**
 * Create a memoized selector that computes a derived value
 */
export const createComputedSelector = <T, U>(
  selectValue: Selector<RootState, T>,
  computeFn: (value: T) => U
): OutputSelector<[RootState], U, (value: T) => U> => {
  return createSelector(
    [selectValue],
    computeFn
  );
};

/**
 * Create a memoized selector that combines multiple selectors
 */
export const createCombinedSelector = <T1, T2, U>(
  selector1: Selector<RootState, T1>,
  selector2: Selector<RootState, T2>,
  combineFn: (val1: T1, val2: T2) => U
): OutputSelector<[RootState], U, (val1: T1, val2: T2) => U> => {
  return createSelector(
    [selector1, selector2],
    combineFn
  );
};

/**
 * Create a selector that filters by date range
 */
export const createDateRangeSelector = <T>(
  selectItems: Selector<RootState, T[]>,
  dateFn: (item: T) => Date | string | number,
  selectStartDate: Selector<RootState, Date | null>,
  selectEndDate: Selector<RootState, Date | null>
): OutputSelector<[RootState], T[], any> => {
  return createSelector(
    [selectItems, selectStartDate, selectEndDate],
    (items, startDate, endDate) => {
      return items.filter(item => {
        const itemDate = new Date(dateFn(item));

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;

        return true;
      });
    }
  );
};

/**
 * Create a memoized selector with cache size limit
 * Useful for parameterized selectors with many unique parameters
 */
export const createParameterizedSelector = <P, R>(
  selectorFactory: (param: P) => OutputSelector<[RootState], R, any>,
  cacheSize: number = 10
) => {
  const cache = new Map<string, OutputSelector<[RootState], R, any>>();

  return (param: P): OutputSelector<[RootState], R, any> => {
    const key = JSON.stringify(param);

    if (!cache.has(key)) {
      // Evict oldest entry if cache is full
      if (cache.size >= cacheSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      cache.set(key, selectorFactory(param));
    }

    return cache.get(key)!;
  };
};
