/**
 * @fileoverview Custom hook for managing analytics filter state
 * @module app/(dashboard)/analytics/_components/hooks/useAnalyticsFilters
 * @category Analytics - Hooks
 */

'use client';

import { useState, useCallback } from 'react';
import type { DateRangeOption, UseAnalyticsFiltersReturn } from '../utils/analytics.types';

/**
 * Available date range options for analytics filtering
 */
const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
];

/**
 * Custom hook for managing analytics filter state
 *
 * @param initialDateRange - Initial date range value (defaults to '30d')
 * @returns Object containing selected date range, options, and setter function
 *
 * @example
 * ```tsx
 * const { selectedDateRange, dateRangeOptions, setDateRange } = useAnalyticsFilters('30d');
 * ```
 */
export function useAnalyticsFilters(
  initialDateRange: string = '30d'
): UseAnalyticsFiltersReturn {
  const [selectedDateRange, setSelectedDateRange] = useState(initialDateRange);

  const setDateRange = useCallback((value: string) => {
    setSelectedDateRange(value);
  }, []);

  return {
    selectedDateRange,
    dateRangeOptions: DATE_RANGE_OPTIONS,
    setDateRange
  };
}
