/**
 * WF-COMP-202 | useIncidentReportsFilters.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../hooks/useRouteState | Dependencies: react, ../../../hooks/useRouteState
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useState, useMemo, useCallback
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * useIncidentReportsFilters Hook
 *
 * Manages filter state and logic for incident reports
 *
 * @module hooks/useIncidentReportsFilters
 */

import { useMemo, useCallback, useState } from 'react';
import { usePersistedFilters } from '../../../hooks/useRouteState';
import type { IncidentFiltersForm } from '../types';

interface UseIncidentReportsFiltersParams {
  onFilterChange?: () => void;
}

/**
 * Custom hook for managing incident reports filters
 */
export function useIncidentReportsFilters({
  onFilterChange,
}: UseIncidentReportsFiltersParams = {}) {
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Persisted filters
  const {
    filters: localFilters,
    updateFilter,
    clearFilters: clearLocalFilters,
    isRestored,
  } = usePersistedFilters<IncidentFiltersForm>({
    storageKey: 'incident-reports-filters',
    defaultFilters: {
      search: '',
      type: '',
      severity: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      parentNotified: 'all',
      followUpRequired: 'all',
    },
    debounceMs: 500,
    syncWithUrl: true,
  });

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      localFilters.type !== '' ||
      localFilters.severity !== '' ||
      localFilters.status !== '' ||
      localFilters.dateFrom !== '' ||
      localFilters.dateTo !== '' ||
      localFilters.parentNotified !== 'all' ||
      localFilters.followUpRequired !== 'all'
    );
  }, [localFilters]);

  /**
   * Handle search input
   */
  const handleSearch = useCallback((searchQuery: string) => {
    updateFilter('search', searchQuery);
    setIsSearchMode(searchQuery.trim().length > 0);
    onFilterChange?.();
  }, [updateFilter, onFilterChange]);

  /**
   * Handle filter changes
   */
  const handleFilterChange = useCallback((
    field: keyof IncidentFiltersForm,
    value: string
  ) => {
    updateFilter(field, value);
    onFilterChange?.();
  }, [updateFilter, onFilterChange]);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    clearLocalFilters();
    setIsSearchMode(false);
    onFilterChange?.();
  }, [clearLocalFilters, onFilterChange]);

  return {
    localFilters,
    isSearchMode,
    hasActiveFilters,
    isRestored,
    handleSearch,
    handleFilterChange,
    handleClearFilters,
  };
}
