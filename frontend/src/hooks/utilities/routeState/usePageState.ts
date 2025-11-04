/**
 * WF-COMP-145 | usePageState.ts - Pagination state hook
 * Purpose: Hook for managing pagination with URL sync and route memory
 * Upstream: React, Next.js | Dependencies: react, next/navigation
 * Downstream: List components, tables | Called by: React component tree
 * Related: Route state types, utilities
 * Exports: usePageState hook | Key Features: URL sync, route memory, filter reset
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Pagination state → URL updates → Memory persistence
 * LLM Context: Pagination state hook for Next.js App Router
 */

/**
 * Pagination State Hook
 *
 * Provides pagination state management with URL synchronization and
 * per-route memory for better user experience.
 *
 * @module hooks/utilities/routeState/usePageState
 * @author White Cross Healthcare Platform
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { PaginationConfig, PaginationState, UsePageStateReturn } from './types';
import { buildQueryString } from './urlStorage';

// =====================
// HOOK: usePageState
// =====================

/**
 * Hook for managing pagination state with URL sync and per-route memory.
 *
 * Automatically syncs pagination with URL params and remembers
 * page state per route path.
 *
 * @param config - Pagination configuration
 * @returns Pagination state and utilities
 *
 * @example
 * ```tsx
 * const {
 *   page,
 *   pageSize,
 *   setPage,
 *   setPageSize,
 *   resetPage,
 *   totalPages
 * } = usePageState({
 *   defaultPage: 1,
 *   defaultPageSize: 20,
 *   pageSizeOptions: [10, 20, 50, 100],
 *   resetOnFilterChange: true
 * });
 *
 * // Use with API calls
 * const { data } = useQuery({
 *   queryKey: ['students', page, pageSize, filters],
 *   queryFn: () => fetchStudents({ page, pageSize, ...filters })
 * });
 *
 * // Calculate total pages
 * useEffect(() => {
 *   if (data?.total) {
 *     // Component will have access to totalPages
 *   }
 * }, [data]);
 * ```
 */
export function usePageState(config: PaginationConfig = {}): UsePageStateReturn {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
    pageParam = 'page',
    pageSizeParam = 'pageSize',
    resetOnFilterChange = true,
  } = config;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Per-route page memory
  const pageMemoryRef = useRef<Map<string, PaginationState>>(new Map());

  // Ref to track last filter state for resetOnFilterChange
  const lastFiltersRef = useRef<string>('');

  // Initialize from URL or memory
  const [state, setState] = useState<PaginationState>(() => {
    const urlPage = searchParams.get(pageParam);
    const urlPageSize = searchParams.get(pageSizeParam);

    if (urlPage || urlPageSize) {
      return {
        page: urlPage ? Math.max(1, parseInt(urlPage, 10)) : defaultPage,
        pageSize: urlPageSize ? parseInt(urlPageSize, 10) : defaultPageSize,
      };
    }

    // Check memory for this route
    const remembered = pageMemoryRef.current.get(pathname);
    if (remembered) {
      return remembered;
    }

    return {
      page: defaultPage,
      pageSize: defaultPageSize,
    };
  });

  // Update URL and memory when state changes
  const updateState = useCallback(
    (newState: Partial<PaginationState>) => {
      setState((prev) => {
        const updated = { ...prev, ...newState };

        // Save to route memory
        pageMemoryRef.current.set(pathname, updated);

        // Update URL using router
        const newParams = new URLSearchParams(searchParams.toString());

        if (updated.page === defaultPage) {
          newParams.delete(pageParam);
        } else {
          newParams.set(pageParam, String(updated.page));
        }

        if (updated.pageSize === defaultPageSize) {
          newParams.delete(pageSizeParam);
        } else {
          newParams.set(pageSizeParam, String(updated.pageSize));
        }

        const url = buildQueryString(newParams, pathname);
        router.replace(url);

        return updated;
      });
    },
    [
      pathname,
      router,
      searchParams,
      pageParam,
      pageSizeParam,
      defaultPage,
      defaultPageSize,
    ]
  );

  // Set page number
  const setPage = useCallback(
    (page: number | ((prev: number) => number)) => {
      const newPage = typeof page === 'function' ? page(state.page) : page;
      updateState({ page: Math.max(1, newPage) });
    },
    [state.page, updateState]
  );

  // Set page size (resets to page 1)
  const setPageSize = useCallback(
    (pageSize: number) => {
      if (!pageSizeOptions.includes(pageSize)) {
        console.warn(
          `Invalid page size: ${pageSize}. Must be one of ${pageSizeOptions.join(', ')}`
        );
        return;
      }
      updateState({ page: 1, pageSize });
    },
    [pageSizeOptions, updateState]
  );

  // Reset to first page
  const resetPage = useCallback(() => {
    updateState({ page: defaultPage });
  }, [updateState, defaultPage]);

  // Reset page when filters change (if enabled)
  useEffect(() => {
    if (resetOnFilterChange) {
      // Get all params except pagination
      const filterParams = new URLSearchParams(searchParams);
      filterParams.delete(pageParam);
      filterParams.delete(pageSizeParam);

      // Store filter string to detect changes
      const filterString = filterParams.toString();

      if (lastFiltersRef.current !== filterString && state.page !== defaultPage) {
        resetPage();
      }

      lastFiltersRef.current = filterString;
    }
  }, [
    searchParams,
    pageParam,
    pageSizeParam,
    resetOnFilterChange,
    resetPage,
    state.page,
    defaultPage,
  ]);

  return {
    page: state.page,
    pageSize: state.pageSize,
    pageSizeOptions,
    setPage,
    setPageSize,
    resetPage,
    state,
  };
}
