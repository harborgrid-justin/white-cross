/**
 * WF-COMP-145 | usePersistedFilters.ts - Persisted filter state hook
 * Purpose: Hook for managing filter state with localStorage and URL sync
 * Upstream: React, Next.js | Dependencies: react, next/navigation
 * Downstream: Filter components, list views | Called by: React component tree
 * Related: Route state types, utilities
 * Exports: usePersistedFilters hook | Key Features: localStorage, URL sync, debouncing
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Storage restoration → Filter updates → Persistence
 * LLM Context: Filter persistence hook for Next.js App Router
 */

/**
 * Persisted Filters Hook
 *
 * Provides filter state management with automatic persistence to localStorage
 * and optional URL synchronization. Includes debouncing for performance.
 *
 * @module hooks/utilities/routeState/usePersistedFilters
 * @author White Cross Healthcare Platform
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { FilterConfig, UsePersistedFiltersReturn } from './types';
import { defaultSerialize, defaultDeserialize } from './serialization';
import {
  buildQueryString,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from './urlStorage';

// =====================
// HOOK: usePersistedFilters
// =====================

/**
 * Hook for persisting filter state to localStorage with debouncing.
 *
 * Automatically saves and restores filter state across page reloads.
 * Includes debouncing to avoid excessive localStorage writes.
 *
 * @template T - The type of filter state
 * @param config - Filter configuration
 * @returns Object with filters, setFilters, clearFilters, and isRestored
 *
 * @example
 * ```tsx
 * interface StudentFilters {
 *   grade: string;
 *   gender: string;
 *   status: string;
 *   search: string;
 * }
 *
 * const {
 *   filters,
 *   setFilters,
 *   updateFilter,
 *   clearFilters,
 *   isRestored
 * } = usePersistedFilters<StudentFilters>({
 *   storageKey: 'student-filters',
 *   defaultFilters: {
 *     grade: '',
 *     gender: '',
 *     status: 'active',
 *     search: ''
 *   },
 *   debounceMs: 500,
 *   syncWithUrl: true
 * });
 *
 * // Update a single filter
 * updateFilter('grade', '5');
 *
 * // Update multiple filters
 * setFilters({ ...filters, grade: '5', status: 'active' });
 *
 * // Clear all filters
 * clearFilters();
 * ```
 */
export function usePersistedFilters<T extends Record<string, any>>(
  config: FilterConfig<T>
): UsePersistedFiltersReturn<T> {
  const {
    storageKey,
    defaultFilters,
    debounceMs = 300,
    syncWithUrl = false,
    validate,
  } = config;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isRestored, setIsRestored] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize filters from localStorage or URL
  const [filters, setFiltersState] = useState<T>(() => {
    if (syncWithUrl) {
      // Try to load from URL first
      const urlFilters: Partial<T> = {};
      let hasUrlParams = false;

      Object.keys(defaultFilters).forEach((key) => {
        const value = searchParams.get(key);
        if (value !== null) {
          hasUrlParams = true;
          try {
            urlFilters[key as keyof T] = defaultDeserialize(value);
          } catch {
            urlFilters[key as keyof T] = value as any;
          }
        }
      });

      if (hasUrlParams) {
        const merged = { ...defaultFilters, ...urlFilters };
        if (!validate || validate(merged)) {
          return merged;
        }
      }
    }

    // Fall back to localStorage
    const stored = getStorageItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as T;
        if (!validate || validate(parsed)) {
          return parsed;
        }
      } catch (error) {
        console.error(`Failed to restore filters from localStorage:`, error);
      }
    }

    return defaultFilters;
  });

  // Mark as restored after initial render
  useEffect(() => {
    setIsRestored(true);
  }, []);

  // Debounced save to localStorage
  const saveToStorage = useCallback(
    (filtersToSave: T) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setStorageItem(storageKey, JSON.stringify(filtersToSave));
      }, debounceMs);
    },
    [storageKey, debounceMs]
  );

  // Update filters with localStorage and optional URL sync
  const setFilters = useCallback(
    (newFilters: T | ((prev: T) => T)) => {
      setFiltersState((prev) => {
        const resolved =
          typeof newFilters === 'function'
            ? (newFilters as (prev: T) => T)(prev)
            : newFilters;

        // Validate if validator provided
        if (validate && !validate(resolved)) {
          console.warn('Invalid filters provided, keeping previous state');
          return prev;
        }

        // Save to localStorage
        saveToStorage(resolved);

        // Sync with URL if enabled
        if (syncWithUrl) {
          const newParams = new URLSearchParams(searchParams.toString());

          Object.entries(resolved).forEach(([key, value]) => {
            if (
              value === defaultFilters[key as keyof T] ||
              value === null ||
              value === undefined ||
              value === ''
            ) {
              newParams.delete(key);
            } else {
              newParams.set(key, defaultSerialize(value));
            }
          });

          const url = buildQueryString(newParams, pathname);
          router.replace(url);
        }

        return resolved;
      });
    },
    [
      validate,
      saveToStorage,
      syncWithUrl,
      searchParams,
      pathname,
      router,
      defaultFilters,
    ]
  );

  // Update a single filter property
  const updateFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFilters]
  );

  // Clear filters back to defaults
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);

    if (syncWithUrl) {
      router.replace(pathname);
    }

    removeStorageItem(storageKey);
  }, [defaultFilters, setFilters, syncWithUrl, router, pathname, storageKey]);

  // Clean up debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    isRestored,
  };
}
