/**
 * Parametric Selector Utilities
 *
 * Utilities for creating parametric selectors that accept arguments.
 *
 * @module hooks/utilities/selectors/parametric
 * @category State Management - Selectors
 */

import { useMemo } from 'react';
import { useAppSelector } from '@/stores/hooks';
import type { SelectorFn } from './types';

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
