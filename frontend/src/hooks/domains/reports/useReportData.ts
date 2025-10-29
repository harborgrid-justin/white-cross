/**
 * useReportData Hook
 *
 * Comprehensive hook for fetching and managing report data with:
 * - Dynamic query building
 * - Real-time data updates
 * - HIPAA-compliant caching
 * - Performance optimization
 * - Error handling and retry logic
 *
 * @module hooks/domains/reports/useReportData
 */

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import type {
  ReportDefinition,
  ReportParameters,
  ReportFilter,
  DateRange
} from '@/types/schemas/reports.schema';
import { reportsQueryKeys, REPORTS_CACHE_CONFIG } from './config';

// ============================================================================
// TYPES
// ============================================================================

interface ReportDataOptions {
  definition: ReportDefinition;
  parameters?: ReportParameters;
  enabled?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseReportDataResult {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  updateFilters: (filters: ReportFilter[]) => void;
  updateDateRange: (dateRange: DateRange) => void;
  updateParameters: (params: Partial<ReportParameters>) => void;
  resetParameters: () => void;
  currentParameters: ReportParameters;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetches report data from the backend
 */
async function fetchReportData(
  definition: ReportDefinition,
  parameters: ReportParameters
): Promise<any> {
  const { dataSource } = definition;

  // Build query parameters
  const queryParams = new URLSearchParams();

  if (parameters.dateRange?.startDate) {
    queryParams.append('startDate', parameters.dateRange.startDate);
  }
  if (parameters.dateRange?.endDate) {
    queryParams.append('endDate', parameters.dateRange.endDate);
  }
  if (parameters.groupBy) {
    queryParams.append('groupBy', parameters.groupBy);
  }
  if (parameters.studentIds?.length) {
    queryParams.append('studentIds', parameters.studentIds.join(','));
  }
  if (parameters.schoolIds?.length) {
    queryParams.append('schoolIds', parameters.schoolIds.join(','));
  }

  // Add custom parameters
  if (parameters.customParameters) {
    Object.entries(parameters.customParameters).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });
  }

  // Build endpoint URL
  const baseUrl = dataSource.endpoint || '/api/reports/data';
  const url = `${baseUrl}/${definition.id}?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: dataSource.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to fetch report data' }));
    throw new Error(error.message || 'Failed to fetch report data');
  }

  return response.json();
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook for fetching and managing report data
 *
 * @example
 * ```tsx
 * const { data, isLoading, updateFilters } = useReportData({
 *   definition: reportDefinition,
 *   parameters: {
 *     dateRange: { startDate: '2025-01-01', endDate: '2025-01-31' }
 *   }
 * });
 * ```
 */
export function useReportData(options: ReportDataOptions): UseReportDataResult {
  const {
    definition,
    parameters: initialParameters,
    enabled = true,
    refetchInterval,
    onSuccess,
    onError
  } = options;

  const queryClient = useQueryClient();

  // Local state for dynamic parameters
  const [parameters, setParameters] = useState<ReportParameters>(
    initialParameters || {}
  );

  // Determine cache configuration based on PHI content
  const cacheConfig = useMemo(() => {
    if (definition.includesPHI) {
      return {
        staleTime: 0, // No caching for PHI
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true
      };
    }
    return {
      staleTime: REPORTS_CACHE_CONFIG.lists.staleTime,
      gcTime: REPORTS_CACHE_CONFIG.lists.gcTime,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    };
  }, [definition.includesPHI]);

  // Query
  const query = useQuery({
    queryKey: reportsQueryKeys.details.byId(definition.id),
    queryFn: () => fetchReportData(definition, parameters),
    enabled,
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.gcTime,
    refetchInterval: refetchInterval || definition.dataSource.cacheTime,
    refetchOnMount: cacheConfig.refetchOnMount,
    refetchOnWindowFocus: cacheConfig.refetchOnWindowFocus,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Handle success/error callbacks
  useMemo(() => {
    if (query.isSuccess && onSuccess) {
      onSuccess(query.data);
    }
    if (query.isError && onError && query.error) {
      onError(query.error as Error);
    }
  }, [query.isSuccess, query.isError, query.data, query.error, onSuccess, onError]);

  // Update filters
  const updateFilters = useCallback((filters: ReportFilter[]) => {
    setParameters((prev) => ({
      ...prev,
      filters
    }));

    // Invalidate query to refetch with new filters
    queryClient.invalidateQueries({
      queryKey: reportsQueryKeys.details.byId(definition.id)
    });
  }, [definition.id, queryClient]);

  // Update date range
  const updateDateRange = useCallback((dateRange: DateRange) => {
    setParameters((prev) => ({
      ...prev,
      dateRange
    }));

    queryClient.invalidateQueries({
      queryKey: reportsQueryKeys.details.byId(definition.id)
    });
  }, [definition.id, queryClient]);

  // Update parameters
  const updateParameters = useCallback((params: Partial<ReportParameters>) => {
    setParameters((prev) => ({
      ...prev,
      ...params
    }));

    queryClient.invalidateQueries({
      queryKey: reportsQueryKeys.details.byId(definition.id)
    });
  }, [definition.id, queryClient]);

  // Reset parameters
  const resetParameters = useCallback(() => {
    setParameters(initialParameters || {});

    queryClient.invalidateQueries({
      queryKey: reportsQueryKeys.details.byId(definition.id)
    });
  }, [definition.id, initialParameters, queryClient]);

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    isFetching: query.isFetching,
    refetch: query.refetch,
    updateFilters,
    updateDateRange,
    updateParameters,
    resetParameters,
    currentParameters: parameters
  };
}
