/**
 * Performance Monitoring and Utility Hooks
 *
 * Utilities for monitoring selector performance and additional hook utilities.
 *
 * @module hooks/utilities/selectors/monitoring
 * @category State Management - Selectors
 */

import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@/stores/hooks';
import type { RootState } from '@/stores/store';
import type { SelectorFn } from './types';

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
