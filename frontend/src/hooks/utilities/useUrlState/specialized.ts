/**
 * Specialized URL State Hooks
 * @module hooks/utilities/useUrlState/specialized
 */

'use client';

import { useMemo } from 'react';
import { useUrlState } from './core';
import type { UrlStateObject } from './types';

/**
 * Pagination-specific URL state hook
 *
 * @example
 * ```tsx
 * function PaginatedList() {
 *   const pagination = usePaginationState({ defaultPageSize: 20 });
 *
 *   return (
 *     <Pagination
 *       page={pagination.page}
 *       pageSize={pagination.pageSize}
 *       onPageChange={pagination.setPage}
 *       onPageSizeChange={pagination.setPageSize}
 *     />
 *   );
 * }
 * ```
 */
export function usePaginationState(options: {
  defaultPage?: number;
  defaultPageSize?: number;
} = {}) {
  const { defaultPage = 1, defaultPageSize = 20 } = options;

  const { state, setParam } = useUrlState({
    page: defaultPage,
    limit: defaultPageSize,
  });

  return {
    page: state.page,
    pageSize: state.limit,
    setPage: (page: number) => setParam('page', page, { replace: true }),
    setPageSize: (limit: number) => setParam('limit', limit, { replace: true }),
    reset: () => setParam('page', defaultPage, { replace: true }),
  };
}

/**
 * Filter state hook for list views
 *
 * @example
 * ```tsx
 * function FilteredList() {
 *   const filters = useFilterState({
 *     search: '',
 *     category: null,
 *     status: 'active',
 *     tags: [] as string[],
 *   });
 *
 *   return (
 *     <div>
 *       <input
 *         value={filters.state.search}
 *         onChange={(e) => filters.setFilter('search', e.target.value)}
 *       />
 *       <button onClick={filters.clearFilters}>Clear All</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useFilterState<T extends UrlStateObject>(defaults: T) {
  const { state, setState, setParam, clearAll } = useUrlState(defaults, {
    replace: true, // Filters should replace, not push history
  });

  return {
    state,
    setFilter: setParam,
    setFilters: setState,
    clearFilters: clearAll,
    hasActiveFilters: useMemo(() => {
      return Object.entries(state).some(([key, value]) => {
        const defaultValue = defaults[key as keyof T];
        return value !== defaultValue && value !== null && value !== '';
      });
    }, [state, defaults]),
  };
}
