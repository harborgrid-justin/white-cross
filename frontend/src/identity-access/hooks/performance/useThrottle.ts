/**
 * useThrottle Hook - Performance Optimization
 *
 * Throttles function execution to limit calls per time period.
 * Useful for high-frequency events like scrolling, mouse movement, etc.
 *
 * @module hooks/performance/useThrottle
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Throttles a callback function to execute at most once per specified delay.
 *
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls in milliseconds
 * @returns Throttled function
 *
 * @example
 * ```tsx
 * const handleMouseMove = useThrottle((e) => {
 *   console.log('Mouse position:', e.clientX, e.clientY);
 * }, 100); // Max once per 100ms
 *
 * <div onMouseMove={handleMouseMove}>Content</div>
 * ```
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        // Execute immediately if enough time has passed
        lastRun.current = now;
        callback(...args);
      } else {
        // Schedule execution at the end of the delay period
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRun.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [callback, delay]
  );
}
