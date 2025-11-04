/**
 * DashboardHeader Component
 *
 * Dashboard page header with:
 * - Title and description
 * - Timeframe selector dropdown
 * - Refresh button with loading state
 *
 * @component
 */

'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TimeframeType } from './useDashboardFilters';

interface DashboardHeaderProps {
  selectedTimeframe: TimeframeType;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  selectedTimeframe,
  onTimeframeChange,
  onRefresh,
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Healthcare Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of student health management and activities</p>
      </div>
      <div className="flex items-center space-x-3">
        <Select
          value={selectedTimeframe}
          onValueChange={(value) => onTimeframeChange(value as TimeframeType)}
        >
          <SelectTrigger className="w-32" aria-label="Select time period for dashboard data">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh dashboard data"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          Refresh
        </Button>
      </div>
    </header>
  );
}
