/**
 * WF-COMP-201 | useIncidentReportsData.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: ../../../stores/hooks/reduxHooks, ../../../stores/slices/incidentReportsSlice | Dependencies: react, ../../../stores/hooks/reduxHooks, ../../../stores/slices/incidentReportsSlice
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions | Key Features: useEffect, useCallback, component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * useIncidentReportsData Hook
 *
 * Manages data fetching and state for incident reports
 *
 * @module hooks/useIncidentReportsData
 */

import { useEffect, useCallback } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  fetchIncidentReports,
  searchIncidentReports,
  setFilters,
  clearSelectedIncident,
  selectFilteredAndSortedReports,
  selectPagination,
  selectFilters,
  selectIsLoading,
  selectError,
  selectReportStatistics,
} from '../../../stores';
import type {
  IncidentReportFilters,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '../../../types/incidents';
import type { IncidentFiltersForm } from '../types';

interface UseIncidentReportsDataParams {
  localFilters: IncidentFiltersForm;
  page: number;
  pageSize: number;
  isSearchMode: boolean;
  isRestored: boolean;
}

/**
 * Custom hook for managing incident reports data
 */
export function useIncidentReportsData({
  localFilters,
  page,
  pageSize,
  isSearchMode,
  isRestored,
}: UseIncidentReportsDataParams) {
  const dispatch = useAppDispatch();

  // Redux selectors
  const reports = useAppSelector(selectFilteredAndSortedReports);
  const pagination = useAppSelector(selectPagination);
  const reduxFilters = useAppSelector(selectFilters);
  const statistics = useAppSelector(selectReportStatistics);
  const isLoadingList = useAppSelector(selectIsLoading('list'));
  const isSearching = useAppSelector(selectIsLoading('searching'));
  const listError = useAppSelector(selectError('list'));
  const searchError = useAppSelector(selectError('search'));

  // Derived state
  const isLoading = isLoadingList || isSearching;
  const currentError = listError || searchError;

  /**
   * Fetch incident reports with current filters
   */
  const loadIncidentReports = useCallback(() => {
    // Build API filters from local filters
    const apiFilters: IncidentReportFilters = {
      page,
      limit: pageSize,
    };

    if (localFilters.type) apiFilters.type = localFilters.type as IncidentType;
    if (localFilters.severity) apiFilters.severity = localFilters.severity as IncidentSeverity;
    if (localFilters.status) apiFilters.status = localFilters.status as IncidentStatus;
    if (localFilters.dateFrom) apiFilters.dateFrom = localFilters.dateFrom;
    if (localFilters.dateTo) apiFilters.dateTo = localFilters.dateTo;
    if (localFilters.parentNotified !== 'all') {
      apiFilters.parentNotified = localFilters.parentNotified === 'true';
    }
    if (localFilters.followUpRequired !== 'all') {
      apiFilters.followUpRequired = localFilters.followUpRequired === 'true';
    }

    // Update Redux filters
    dispatch(setFilters(apiFilters));

    // Fetch data
    if (isSearchMode && localFilters.search.trim()) {
      dispatch(searchIncidentReports({
        query: localFilters.search.trim(),
        page,
        limit: pageSize,
      }));
    } else {
      dispatch(fetchIncidentReports(apiFilters));
    }
  }, [
    dispatch,
    page,
    pageSize,
    localFilters,
    isSearchMode,
  ]);

  /**
   * Initial load and reload on filter/pagination changes
   */
  useEffect(() => {
    if (!isRestored) return; // Wait for filters to be restored

    loadIncidentReports();

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedIncident());
    };
  }, [isRestored, page, pageSize, localFilters, isSearchMode, loadIncidentReports, dispatch]);

  return {
    reports,
    pagination,
    reduxFilters,
    statistics,
    isLoading,
    currentError,
    loadIncidentReports,
  };
}
