/**
 * WF-COMP-145 | useRouteStateCore.ts - Core route state hook
 * Purpose: Primary hook for managing route-level state with URL synchronization
 * Upstream: React, Next.js | Dependencies: react, next/navigation
 * Downstream: Components, pages | Called by: React component tree
 * Related: Route state types, utilities
 * Exports: useRouteState hook | Key Features: URL state sync, type safety, validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → URL parsing → State management → URL updates
 * LLM Context: Core route state hook for Next.js App Router
 */

/**
 * Core Route State Hook
 *
 * Provides the main useRouteState hook for persisting state in URL query parameters
 * with full type safety, validation, and custom serialization support.
 *
 * @module hooks/utilities/routeState/useRouteStateCore
 * @author White Cross Healthcare Platform
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { RouteStateOptions, UseRouteStateReturn } from './types';
import { defaultSerialize, defaultDeserialize } from './serialization';
import { buildQueryString } from './urlStorage';

// =====================
// HOOK: useRouteState
// =====================

/**
 * Hook for persisting state in URL query parameters with type safety.
 *
 * Automatically syncs state with URL params and provides type-safe access.
 * Supports complex types via custom serialization.
 *
 * @template T - The type of state value
 * @param options - Configuration options
 * @returns Tuple of [value, setValue, clearValue]
 *
 * @example
 * ```tsx
 * // Simple string state
 * const [search, setSearch] = useRouteState({
 *   paramName: 'search',
 *   defaultValue: ''
 * });
 *
 * // Array state with custom serialization
 * const [selectedIds, setSelectedIds] = useRouteState({
 *   paramName: 'selected',
 *   defaultValue: [] as string[],
 *   serialize: (ids) => ids.join(','),
 *   deserialize: (str) => str ? str.split(',') : []
 * });
 *
 * // Complex object with validation
 * const [filters, setFilters] = useRouteState({
 *   paramName: 'filters',
 *   defaultValue: { grade: '', status: 'active' },
 *   validate: (val): val is FilterType => {
 *     return typeof val === 'object' && 'grade' in val;
 *   },
 *   onValidationError: (err) => console.error('Invalid filters:', err)
 * });
 * ```
 */
export function useRouteState<T>(
  options: RouteStateOptions<T>
): UseRouteStateReturn<T> {
  const {
    paramName,
    defaultValue,
    replace = false,
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    validate,
    onValidationError,
  } = options;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parse initial value from URL
  const initialValue = useMemo(() => {
    const paramValue = searchParams.get(paramName);

    if (!paramValue) {
      return defaultValue;
    }

    try {
      const deserialized = deserialize(paramValue);

      if (validate && !validate(deserialized)) {
        const error = new Error(`Invalid value for parameter "${paramName}"`);
        onValidationError?.(error);
        return defaultValue;
      }

      return deserialized as T;
    } catch (error) {
      console.error(`Failed to deserialize "${paramName}":`, error);
      onValidationError?.(error as Error);
      return defaultValue;
    }
  }, [paramName, searchParams, defaultValue, deserialize, validate, onValidationError]);

  const [value, setValue] = useState<T>(initialValue);

  // Sync value to URL when it changes
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolvedValue =
          typeof newValue === 'function'
            ? (newValue as (prev: T) => T)(prev)
            : newValue;

        // Update URL params
        const newParams = new URLSearchParams(searchParams.toString());

        if (
          resolvedValue === defaultValue ||
          resolvedValue === null ||
          resolvedValue === undefined
        ) {
          // Remove param if value is default/null/undefined
          newParams.delete(paramName);
        } else {
          try {
            const serialized = serialize(resolvedValue);
            if (serialized) {
              newParams.set(paramName, serialized);
            } else {
              newParams.delete(paramName);
            }
          } catch (error) {
            console.error(`Failed to serialize "${paramName}":`, error);
          }
        }

        const url = buildQueryString(newParams, pathname);
        const method = replace ? router.replace : router.push;
        method(url);

        return resolvedValue;
      });
    },
    [
      paramName,
      defaultValue,
      serialize,
      searchParams,
      pathname,
      router,
      replace,
    ]
  );

  // Clear value and remove from URL
  const clearValue = useCallback(() => {
    setValue(defaultValue);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete(paramName);
    const url = buildQueryString(newParams, pathname);
    router.replace(url);
  }, [paramName, defaultValue, searchParams, pathname, router]);

  // Sync from URL when search params change externally
  useEffect(() => {
    const paramValue = searchParams.get(paramName);

    if (!paramValue) {
      if (value !== defaultValue) {
        setValue(defaultValue);
      }
      return;
    }

    try {
      const deserialized = deserialize(paramValue);

      if (validate && !validate(deserialized)) {
        console.warn(`Invalid value for parameter "${paramName}", using default`);
        setValue(defaultValue);
        return;
      }

      setValue(deserialized as T);
    } catch (error) {
      console.error(`Failed to deserialize "${paramName}":`, error);
      setValue(defaultValue);
    }
  }, [paramName, searchParams, defaultValue, deserialize, validate]);

  return [value, updateValue, clearValue];
}
