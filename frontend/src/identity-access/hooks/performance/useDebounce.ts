/**
 * useDebounce Hook - Performance Optimization
 *
 * Debounces function execution to delay calls until after inactivity.
 * Useful for search inputs, form validation, etc.
 *
 * @module hooks/performance/useDebounce
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Debounces a callback function to execute only after specified delay of inactivity.
 *
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds to wait after last call
 * @returns Debounced function
 *
 * @example
 * ```tsx
 * const handleSearch = useDebounce((query: string) => {
 *   performSearch(query);
 * }, 300); // Wait 300ms after user stops typing
 *
 * <input onChange={(e) => handleSearch(e.target.value)} />
 * ```
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Debounces a value to update only after specified delay of inactivity.
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebouncedValue(searchQuery, 300);
 *
 * useEffect(() => {
 *   performSearch(debouncedQuery);
 * }, [debouncedQuery]);
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

// Fix import
import { useState, useEffect } from 'react';
