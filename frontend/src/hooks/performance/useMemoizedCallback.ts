/**
 * Performance Optimization Hooks
 *
 * Collection of hooks for optimizing React component performance:
 * - Deep comparison memoization
 * - Stable callback references
 * - Computed value caching
 *
 * @module hooks/performance/useMemoizedCallback
 * @since 1.2.0
 */

import { useCallback, useMemo, useRef, DependencyList } from 'react';

/**
 * Deep comparison for objects and arrays
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

/**
 * UseMemo with deep comparison of dependencies
 *
 * Useful when dependencies are objects or arrays that may have the same
 * values but different references.
 *
 * @example
 * ```tsx
 * const filteredData = useDeepMemo(
 *   () => data.filter(item => filters.includes(item.type)),
 *   [data, filters] // Will only recompute if data/filters values change
 * )
 * ```
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  const ref = useRef<{ deps: DependencyList; value: T }>();

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  return ref.current.value;
}

/**
 * UseCallback with deep comparison of dependencies
 *
 * @example
 * ```tsx
 * const handleFilter = useDeepCallback(
 *   () => filterData(filters),
 *   [filters] // Won't recreate if filters object has same values
 * )
 * ```
 */
export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: DependencyList
): T {
  const ref = useRef<{ deps: DependencyList; callback: T }>();

  if (!ref.current || !deepEqual(ref.current.deps, deps)) {
    ref.current = {
      deps,
      callback,
    };
  }

  return ref.current.callback;
}

/**
 * Stable callback that never changes reference
 *
 * Useful for callbacks passed to child components that should not trigger re-renders.
 * The callback always has access to the latest values through a ref.
 *
 * @example
 * ```tsx
 * const handleClick = useStableCallback((id: string) => {
 *   // This function never changes reference
 *   // But always has access to latest props/state
 *   onSelect(id, selectedItems)
 * })
 * ```
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef(callback);

  // Update ref on every render to have latest values
  callbackRef.current = callback;

  // Return stable callback that calls the latest version
  return useCallback(((...args) => callbackRef.current(...args)) as T, []);
}

/**
 * Memoize expensive computations with cache
 *
 * @example
 * ```tsx
 * const expensiveValue = useMemoizedComputation(
 *   (data, filters) => {
 *     // Expensive computation
 *     return processLargeDataset(data, filters)
 *   },
 *   [data, filters]
 * )
 * ```
 */
export function useMemoizedComputation<TArgs extends any[], TResult>(
  computeFn: (...args: TArgs) => TResult,
  deps: DependencyList
): TResult {
  return useMemo(() => {
    return computeFn(...(deps as unknown as TArgs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Debounced value hook
 *
 * Returns a debounced version of the value that only updates after the
 * specified delay has passed without changes.
 *
 * @example
 * ```tsx
 * const searchQuery = useDebouncedValue(inputValue, 300)
 *
 * // searchQuery only updates 300ms after user stops typing
 * useEffect(() => {
 *   fetchResults(searchQuery)
 * }, [searchQuery])
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttled value hook
 *
 * Returns a throttled version of the value that updates at most once
 * per specified interval.
 *
 * @example
 * ```tsx
 * const scrollPosition = useThrottledValue(currentScroll, 100)
 *
 * // scrollPosition updates at most once per 100ms
 * ```
 */
export function useThrottledValue<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Date.now() - lastRan.current >= interval) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, interval - (Date.now() - lastRan.current));

    return () => clearTimeout(timer);
  }, [value, interval]);

  return throttledValue;
}

// Missing import
import { useEffect, useState } from 'react';
