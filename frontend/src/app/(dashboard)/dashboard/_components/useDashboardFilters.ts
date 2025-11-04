/**
 * useDashboardFilters Hook
 *
 * Custom hook for managing dashboard filter state including:
 * - Timeframe selection (today, week, month, quarter)
 * - Alert severity filtering
 * - Activity search
 *
 * @returns Filter state and setter functions
 */

'use client';

import { useState } from 'react';

export type TimeframeType = 'today' | 'week' | 'month' | 'quarter';
export type AlertFilterType = 'all' | 'critical' | 'high' | 'medium' | 'low';

interface UseDashboardFiltersReturn {
  selectedTimeframe: TimeframeType;
  setSelectedTimeframe: (timeframe: TimeframeType) => void;
  alertFilter: AlertFilterType;
  setAlertFilter: (filter: AlertFilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function useDashboardFilters(): UseDashboardFiltersReturn {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeType>('today');
  const [alertFilter, setAlertFilter] = useState<AlertFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return {
    selectedTimeframe,
    setSelectedTimeframe,
    alertFilter,
    setAlertFilter,
    searchQuery,
    setSearchQuery,
  };
}
