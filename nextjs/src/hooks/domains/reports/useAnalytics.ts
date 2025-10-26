/**
 * useAnalytics Hook
 *
 * Comprehensive analytics hook for health trends, usage patterns,
 * and performance metrics with real-time updates.
 *
 * Features:
 * - Health trend analysis
 * - Usage pattern tracking
 * - Performance metrics
 * - Comparison periods
 * - Real-time data updates
 * - HIPAA-compliant caching
 *
 * @module hooks/domains/reports/useAnalytics
 */

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import type {
  AnalyticsQuery,
  AnalyticsResult,
  DateRange,
  DateGrouping,
  ReportType
} from '@/types/schemas/reports.schema';
import { reportsQueryKeys, REPORTS_CACHE_CONFIG } from './config';

// ============================================================================
// TYPES
// ============================================================================

interface UseAnalyticsOptions {
  type: ReportType;
  dateRange: DateRange;
  groupBy?: DateGrouping;
  includeComparison?: boolean;
  studentIds?: string[];
  schoolIds?: string[];
  enabled?: boolean;
  refetchInterval?: number;
}

interface UseAnalyticsResult {
  data: AnalyticsResult | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  updateDateRange: (dateRange: DateRange) => void;
  updateGroupBy: (groupBy: DateGrouping) => void;
  toggleComparison: () => void;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculates date range based on period
 */
function calculateDateRange(period: string): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'yesterday':
      startDate = new Date(now.setDate(now.getDate() - 1));
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'last-7-days':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'last-30-days':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case 'last-90-days':
      startDate = new Date(now.setDate(now.getDate() - 90));
      break;
    case 'this-month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'last-month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      break;
    case 'this-year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 30));
  }

  return {
    startDate: startDate.toISOString(),
    endDate
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetches analytics data from the backend
 */
async function fetchAnalytics(query: AnalyticsQuery): Promise<AnalyticsResult> {
  const params = new URLSearchParams();

  // Date range
  if (query.dateRange.startDate) {
    params.append('startDate', query.dateRange.startDate);
  }
  if (query.dateRange.endDate) {
    params.append('endDate', query.dateRange.endDate);
  }
  if (query.dateRange.period) {
    params.append('period', query.dateRange.period);
  }

  // Grouping
  if (query.groupBy) {
    params.append('groupBy', query.groupBy);
  }

  // Comparison
  if (query.includeComparison) {
    params.append('includeComparison', 'true');
    if (query.comparisonPeriod) {
      params.append('comparisonPeriod', query.comparisonPeriod);
    }
  }

  // Filters
  if (query.studentIds?.length) {
    params.append('studentIds', query.studentIds.join(','));
  }
  if (query.schoolIds?.length) {
    params.append('schoolIds', query.schoolIds.join(','));
  }

  const url = `/api/analytics/${query.type}?${params.toString()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch analytics' }));
    throw new Error(error.message || 'Failed to fetch analytics data');
  }

  return response.json();
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for fetching and managing analytics data
 *
 * @example
 * ```tsx
 * const { data, isLoading, updateDateRange } = useAnalytics({
 *   type: 'health',
 *   dateRange: { period: 'last-30-days' },
 *   groupBy: 'daily',
 *   includeComparison: true
 * });
 * ```
 */
export function useAnalytics(options: UseAnalyticsOptions): UseAnalyticsResult {
  const {
    type,
    dateRange: initialDateRange,
    groupBy: initialGroupBy = 'daily',
    includeComparison: initialIncludeComparison = false,
    studentIds,
    schoolIds,
    enabled = true,
    refetchInterval
  } = options;

  const queryClient = useQueryClient();

  // Local state
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);
  const [groupBy, setGroupBy] = useState<DateGrouping>(initialGroupBy);
  const [includeComparison, setIncludeComparison] = useState(initialIncludeComparison);

  // Build analytics query
  const analyticsQuery = useMemo<AnalyticsQuery>(() => ({
    type,
    dateRange,
    groupBy,
    includeComparison,
    studentIds,
    schoolIds
  }), [type, dateRange, groupBy, includeComparison, studentIds, schoolIds]);

  // Query
  const query = useQuery({
    queryKey: ['analytics', type, analyticsQuery],
    queryFn: () => fetchAnalytics(analyticsQuery),
    enabled,
    staleTime: REPORTS_CACHE_CONFIG.lists.staleTime,
    gcTime: REPORTS_CACHE_CONFIG.lists.gcTime,
    refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Update date range
  const updateDateRange = useCallback((newDateRange: DateRange) => {
    setDateRange(newDateRange);
    queryClient.invalidateQueries({
      queryKey: ['analytics', type]
    });
  }, [type, queryClient]);

  // Update grouping
  const updateGroupBy = useCallback((newGroupBy: DateGrouping) => {
    setGroupBy(newGroupBy);
    queryClient.invalidateQueries({
      queryKey: ['analytics', type]
    });
  }, [type, queryClient]);

  // Toggle comparison
  const toggleComparison = useCallback(() => {
    setIncludeComparison((prev) => !prev);
    queryClient.invalidateQueries({
      queryKey: ['analytics', type]
    });
  }, [type, queryClient]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    isFetching: query.isFetching,
    refetch: query.refetch,
    updateDateRange,
    updateGroupBy,
    toggleComparison
  };
}

/**
 * Hook for multiple analytics queries (dashboard)
 */
export function useMultipleAnalytics(queries: UseAnalyticsOptions[]) {
  const results = queries.map((options) => useAnalytics(options));

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const isFetching = results.some((r) => r.isFetching);

  return {
    results,
    isLoading,
    isError,
    isFetching,
    refetchAll: () => results.forEach((r) => r.refetch())
  };
}

/**
 * Hook for real-time analytics with auto-refresh
 */
export function useRealtimeAnalytics(
  options: UseAnalyticsOptions,
  refreshInterval: number = 30000 // 30 seconds default
) {
  return useAnalytics({
    ...options,
    refetchInterval: refreshInterval
  });
}
