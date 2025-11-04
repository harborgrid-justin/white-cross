/**
 * Memoized Selector Utilities
 *
 * Utilities and patterns for creating performant, memoized Redux selectors
 * using Reselect and Redux Toolkit.
 *
 * @module hooks/utilities/useMemoizedSelectors
 * @category State Management - Selectors
 *
 * Features:
 * - Memoized selector creation with createSelector
 * - Parametric selector patterns
 * - Composite selector patterns
 * - Performance monitoring
 * - Type-safe selector composition
 *
 * Compliance: Item 154 (NEXTJS_GAP_ANALYSIS_CHECKLIST.md)
 * - [x] 154. Selectors memoized
 */

import { createSelector, createDraftSafeSelector } from '@reduxjs/toolkit';
import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@/stores/hooks';
import type { RootState } from '@/stores/store';

/**
 * Selector function type
 */
export type SelectorFn<T> = (state: RootState) => T;

/**
 * Parametric selector function type
 */
export type ParametricSelectorFn<T, P> = (state: RootState, params: P) => T;

// ============================================================
// BASIC MEMOIZED SELECTORS
// ============================================================

/**
 * Create a simple memoized selector
 *
 * @example
 * ```ts
 * const selectActiveStudents = createMemoizedSelector(
 *   (state: RootState) => state.students.entities,
 *   (entities) => Object.values(entities).filter(s => s.isActive)
 * );
 * ```
 */
export const createMemoizedSelector = createSelector;

/**
 * Create a draft-safe memoized selector (for use with Immer)
 *
 * @example
 * ```ts
 * const selectStudentCount = createDraftSafeMemoizedSelector(
 *   (state: RootState) => state.students.ids,
 *   (ids) => ids.length
 * );
 * ```
 */
export const createDraftSafeMemoizedSelector = createDraftSafeSelector;

// ============================================================
// PARAMETRIC SELECTORS
// ============================================================

/**
 * Create a parametric memoized selector that accepts arguments
 *
 * @example
 * ```ts
 * const selectStudentById = createParametricSelector(
 *   (id: string) => (state: RootState) => state.students.entities[id]
 * );
 *
 * // Usage in component
 * function StudentCard({ id }: { id: string }) {
 *   const student = useParametricSelector(selectStudentById, id);
 * }
 * ```
 */
export function createParametricSelector<T, P>(
  selectorFactory: (params: P) => SelectorFn<T>
) {
  const cache = new Map<string, SelectorFn<T>>();

  return (params: P): SelectorFn<T> => {
    const key = JSON.stringify(params);

    if (!cache.has(key)) {
      cache.set(key, selectorFactory(params));
    }

    return cache.get(key)!;
  };
}

/**
 * Hook to use parametric selectors
 *
 * @example
 * ```ts
 * const selectStudentById = createParametricSelector(
 *   (id: string) => (state: RootState) => state.students.entities[id]
 * );
 *
 * function StudentCard({ id }: { id: string }) {
 *   const student = useParametricSelector(selectStudentById, id);
 * }
 * ```
 */
export function useParametricSelector<T, P>(
  selectorFactory: (params: P) => SelectorFn<T>,
  params: P
): T {
  const selector = useMemo(() => selectorFactory(params), [selectorFactory, params]);
  return useAppSelector(selector);
}

// ============================================================
// COMPOSITE SELECTORS
// ============================================================

/**
 * Combine multiple selectors into one
 *
 * @example
 * ```ts
 * const selectStudentData = createCompositeSelector({
 *   student: (state) => state.students.entities[id],
 *   healthRecords: (state) => state.healthRecords.byStudent[id],
 *   medications: (state) => state.medications.byStudent[id],
 * });
 * ```
 */
export function createCompositeSelector<
  T extends Record<string, any>
>(
  selectors: { [K in keyof T]: SelectorFn<T[K]> }
): SelectorFn<T> {
  return createSelector(
    Object.values(selectors) as SelectorFn<any>[],
    (...results) => {
      const keys = Object.keys(selectors);
      return keys.reduce((acc, key, index) => {
        acc[key as keyof T] = results[index];
        return acc;
      }, {} as T);
    }
  );
}

// ============================================================
// FILTERED & SORTED SELECTORS
// ============================================================

/**
 * Create a filtered selector with memoization
 *
 * @example
 * ```ts
 * const selectActiveStudents = createFilteredSelector(
 *   (state) => state.students,
 *   (student) => student.isActive === true
 * );
 * ```
 */
export function createFilteredSelector<T, Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  predicate: (entity: Entity) => boolean
): SelectorFn<Entity[]> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .filter(predicate);
    }
  );
}

/**
 * Create a sorted selector with memoization
 *
 * @example
 * ```ts
 * const selectStudentsSortedByName = createSortedSelector(
 *   (state) => state.students,
 *   (a, b) => a.lastName.localeCompare(b.lastName)
 * );
 * ```
 */
export function createSortedSelector<T, Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  compareFn: (a: Entity, b: Entity) => number
): SelectorFn<Entity[]> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .sort(compareFn);
    }
  );
}

/**
 * Create a filtered and sorted selector
 *
 * @example
 * ```ts
 * const selectActiveStudentsByGrade = createFilteredAndSortedSelector(
 *   (state) => state.students,
 *   (student) => student.isActive,
 *   (a, b) => a.grade.localeCompare(b.grade)
 * );
 * ```
 */
export function createFilteredAndSortedSelector<T, Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  predicate: (entity: Entity) => boolean,
  compareFn: (a: Entity, b: Entity) => number
): SelectorFn<Entity[]> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .filter(predicate)
        .sort(compareFn);
    }
  );
}

// ============================================================
// AGGREGATION SELECTORS
// ============================================================

/**
 * Create a count selector
 *
 * @example
 * ```ts
 * const selectActiveStudentCount = createCountSelector(
 *   (state) => state.students,
 *   (student) => student.isActive
 * );
 * ```
 */
export function createCountSelector<Entity>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  predicate?: (entity: Entity) => boolean
): SelectorFn<number> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      if (!predicate) return ids.length;

      return ids
        .map(id => entities[id])
        .filter((entity): entity is Entity => entity !== undefined)
        .filter(predicate)
        .length;
    }
  );
}

/**
 * Create a groupBy selector
 *
 * @example
 * ```ts
 * const selectStudentsByGrade = createGroupBySelector(
 *   (state) => state.students,
 *   (student) => student.grade
 * );
 * // Returns: { '1': [...], '2': [...], ... }
 * ```
 */
export function createGroupBySelector<Entity, K extends string | number>(
  baseSelector: SelectorFn<{ ids: string[]; entities: Record<string, Entity> }>,
  keyFn: (entity: Entity) => K
): SelectorFn<Record<K, Entity[]>> {
  return createSelector(
    [baseSelector],
    ({ ids, entities }) => {
      const groups = {} as Record<K, Entity[]>;

      ids.forEach(id => {
        const entity = entities[id];
        if (entity) {
          const key = keyFn(entity);
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(entity);
        }
      });

      return groups;
    }
  );
}

// ============================================================
// PERFORMANCE MONITORING
// ============================================================

/**
 * Wrap a selector with performance monitoring
 *
 * @example
 * ```ts
 * const selectStudents = monitoredSelector(
 *   'selectStudents',
 *   (state) => state.students.entities
 * );
 * ```
 */
export function monitoredSelector<T>(
  name: string,
  selector: SelectorFn<T>,
  warnThreshold: number = 5
): SelectorFn<T> {
  return (state: RootState): T => {
    const start = performance.now();
    const result = selector(state);
    const duration = performance.now() - start;

    if (duration > warnThreshold) {
      console.warn(
        `[Selector Performance] ${name} took ${duration.toFixed(2)}ms (threshold: ${warnThreshold}ms)`
      );
    }

    return result;
  };
}

// ============================================================
// UTILITY HOOKS
// ============================================================

/**
 * Hook to create a memoized selector with dependencies
 *
 * @example
 * ```tsx
 * function StudentCard({ id, grade }: Props) {
 *   const filteredStudents = useMemoSelector(
 *     (state) => Object.values(state.students.entities)
 *       .filter(s => s.id === id && s.grade === grade),
 *     [id, grade]
 *   );
 * }
 * ```
 */
export function useMemoSelector<T>(
  selector: SelectorFn<T>,
  deps: React.DependencyList
): T {
  const memoizedSelector = useMemo(() => selector, deps);
  return useAppSelector(memoizedSelector);
}

/**
 * Hook to create a callback selector
 *
 * @example
 * ```tsx
 * function StudentList() {
 *   const getStudentById = useCallbackSelector(
 *     (id: string) => (state: RootState) => state.students.entities[id],
 *     []
 *   );
 *
 *   const student = getStudentById('student-123');
 * }
 * ```
 */
export function useCallbackSelector<T, Args extends any[]>(
  selectorFactory: (...args: Args) => SelectorFn<T>,
  deps: React.DependencyList
) {
  const factory = useCallback(selectorFactory, deps);

  return useCallback((...args: Args): T => {
    const selector = factory(...args);
    // Note: This approach works but may not be optimal for high-frequency updates
    // Consider using parametric selectors instead
    return selector(window.__REDUX_STORE__?.getState() as RootState);
  }, [factory]);
}

// ============================================================
// BEST PRACTICE EXAMPLES
// ============================================================

/**
 * Example: Student-related selectors
 */
export const studentSelectors = {
  /**
   * Select all students as array
   */
  selectAllStudents: createSelector(
    [(state: RootState) => state.students],
    ({ ids, entities }) => ids.map(id => entities[id]).filter(Boolean)
  ),

  /**
   * Select active students
   */
  selectActiveStudents: createFilteredSelector(
    (state: RootState) => state.students,
    (student: any) => student.isActive === true
  ),

  /**
   * Select students by grade
   */
  selectStudentsByGrade: createGroupBySelector(
    (state: RootState) => state.students,
    (student: any) => student.grade
  ),

  /**
   * Select student count
   */
  selectStudentCount: createCountSelector(
    (state: RootState) => state.students
  ),

  /**
   * Select student by ID (parametric)
   */
  selectStudentById: createParametricSelector(
    (id: string) => (state: RootState) => state.students.entities[id]
  ),
};

export default {
  createMemoizedSelector,
  createParametricSelector,
  createCompositeSelector,
  createFilteredSelector,
  createSortedSelector,
  createFilteredAndSortedSelector,
  createCountSelector,
  createGroupBySelector,
  monitoredSelector,
  useParametricSelector,
  useMemoSelector,
  useCallbackSelector,
};
