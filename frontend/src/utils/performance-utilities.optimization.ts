/**
 * Performance Optimization Utilities
 *
 * Advanced optimization tools including web workers, memoization,
 * deep comparison, and caching utilities.
 *
 * @module performance-utilities.optimization
 * @version 1.0.0
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import type { WorkerFunction, WebWorkerResult } from './performance-utilities.types';

// ============================================================================
// WEB WORKER
// ============================================================================

/**
 * Web Worker hook for heavy computation without blocking UI
 *
 * @param {WorkerFunction<T, R>} workerFn - Function to execute in worker
 * @returns {WebWorkerResult<T, R>} Execute function and loading state
 *
 * @example
 * ```tsx
 * const workerFn = (data: number[]) => {
 *   return data.reduce((sum, num) => sum + num, 0);
 * };
 *
 * const [execute, isLoading] = useWebWorker(workerFn);
 *
 * const handleCalculate = async () => {
 *   const result = await execute([1, 2, 3, 4, 5]);
 *   console.log('Sum:', result);
 * };
 * ```
 */
export function useWebWorker<T, R>(
  workerFn: WorkerFunction<T, R>
): WebWorkerResult<T, R> {
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Create worker from function
    const workerCode = `
      self.onmessage = function(e) {
        const fn = ${workerFn.toString()};
        const result = fn(e.data);
        self.postMessage(result);
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    return () => {
      workerRef.current?.terminate();
    };
  }, [workerFn]);

  const execute = useCallback((data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not initialized'));
        return;
      }

      setLoading(true);

      workerRef.current.onmessage = (e: MessageEvent<R>) => {
        setLoading(false);
        resolve(e.data);
      };

      workerRef.current.onerror = (error) => {
        setLoading(false);
        reject(error);
      };

      workerRef.current.postMessage(data);
    });
  }, []);

  return [execute, loading];
}

// ============================================================================
// MEMOIZATION HELPERS
// ============================================================================

/**
 * Deep comparison helper function
 *
 * @param {unknown} a - First value to compare
 * @param {unknown} b - Second value to compare
 * @returns {boolean} Whether the values are deeply equal
 */
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Deep comparison for useMemo/useCallback dependencies
 *
 * @param {T} value - Value to memoize with deep comparison
 * @returns {T} Memoized value
 *
 * @example
 * ```tsx
 * const memoizedValue = useMemo(() => {
 *   return expensiveCalculation(complexObject);
 * }, [useDeepCompareMemo(complexObject)]);
 * ```
 */
export function useDeepCompareMemo<T>(value: T): T {
  const ref = useRef<T>(value);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Memoize expensive function calls
 *
 * @param {T} fn - Function to memoize
 * @param {Function} keyFn - Optional custom key function
 * @returns {T} Memoized function
 *
 * @example
 * ```tsx
 * const expensiveCalculation = memoize((a: number, b: number) => {
 *   // Complex computation
 *   return a * b;
 * });
 * ```
 */
export function memoize<T extends (...args: readonly unknown[]) => unknown>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}
