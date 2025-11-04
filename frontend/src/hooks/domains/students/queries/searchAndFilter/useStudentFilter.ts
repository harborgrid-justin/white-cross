/**
 * Student Filter Hook
 *
 * Advanced filtering with multiple criteria, debouncing, and auto-apply functionality.
 * Provides comprehensive filtering capabilities for student data.
 *
 * @module hooks/students/searchAndFilter/useStudentFilter
 * @author White Cross Healthcare Platform
 * @version 2.0.0
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { studentQueryKeys } from '../queryKeys';
import { cacheConfig } from '../cacheConfig';
import { apiActions } from '@/lib/api';
import type {
  AdvancedFilters,
  ApiError,
  FilterOptions
} from './searchFilterTypes';

/**
 * Hook for advanced filtering with multiple criteria
 *
 * @param initialFilters - Initial filter values
 * @param options - Filter options
 * @returns Filter state and control functions
 *
 * @example
 * ```tsx
 * const {
 *   filters,
 *   updateFilter,
 *   clearFilters,
 *   applyFilters,
 *   results,
 *   isFiltering
 * } = useAdvancedFilters({
 *   grade: '5',
 *   isActive: true
 * });
 * ```
 */
export const useAdvancedFilters = (
  initialFilters: Partial<AdvancedFilters> = {},
  options?: FilterOptions
) => {
  const { autoApply = true, debounceMs = 500 } = options || {};
  const config = cacheConfig.lists;

  const [filters, setFilters] = useState<AdvancedFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFilters>(initialFilters);

  // Debounce filter application
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!autoApply) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setAppliedFilters(filters);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters, autoApply, debounceMs]);

  // Filtered results query
  const filteredQuery = useQuery({
    queryKey: studentQueryKeys.lists.filtered(appliedFilters),
    queryFn: async () => {
      const response = await apiActions.students.getAll(appliedFilters);
      return response;
    },
    enabled: Object.keys(appliedFilters).length > 0,
    staleTime: config.staleTime,
    gcTime: config.gcTime,
    retry: config.retry,
    retryDelay: config.retryDelay,
  });

  // Filter control functions
  const updateFilter = useCallback(<K extends keyof AdvancedFilters>(
    key: K,
    value: AdvancedFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilters = useCallback((newFilters: Partial<AdvancedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setAppliedFilters({});
  }, []);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [initialFilters]);

  // Check if filters have changed
  const hasChanges = useMemo(() => {
    return JSON.stringify(filters) !== JSON.stringify(appliedFilters);
  }, [filters, appliedFilters]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    return Object.values(appliedFilters).filter(value =>
      value !== undefined && value !== null && value !== ''
    ).length;
  }, [appliedFilters]);

  return {
    // Filter state
    filters,
    appliedFilters,
    hasChanges,
    activeFilterCount,

    // Results
    results: filteredQuery.data?.students || [],
    pagination: filteredQuery.data?.pagination,

    // Status
    isFiltering: filteredQuery.isFetching,
    isLoading: filteredQuery.isLoading,
    error: filteredQuery.error as ApiError | null,

    // Controls
    updateFilter,
    updateFilters,
    clearFilters,
    applyFilters,
    resetFilters,
    refetch: filteredQuery.refetch,
  };
};
