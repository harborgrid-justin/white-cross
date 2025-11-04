/**
 * @fileoverview Analytics Header Component - Title, date range selector, and export button
 * @module app/(dashboard)/analytics/_components/AnalyticsHeader
 * @category Analytics - Components
 */

'use client';

import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AnalyticsHeaderProps } from './utils/analytics.types';

/**
 * Analytics Header Component
 *
 * Displays the analytics dashboard title, description, date range selector, and export button
 *
 * @param props - Component props
 * @param props.title - Dashboard title (defaults to "Healthcare Analytics")
 * @param props.description - Dashboard description (defaults to "Comprehensive health metrics...")
 * @param props.dateRange - Currently selected date range value
 * @param props.dateRangeOptions - Available date range options
 * @param props.onDateRangeChange - Callback when date range changes
 * @param props.onExport - Optional callback for export button click
 *
 * @example
 * ```tsx
 * <AnalyticsHeader
 *   dateRange="30d"
 *   dateRangeOptions={options}
 *   onDateRangeChange={handleChange}
 *   onExport={handleExport}
 * />
 * ```
 */
export function AnalyticsHeader({
  title = 'Healthcare Analytics',
  description = 'Comprehensive health metrics and performance insights',
  dateRange,
  dateRangeOptions,
  onDateRangeChange,
  onExport
}: AnalyticsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" aria-hidden="true" />
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select date range"
          >
            {dateRangeOptions.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
        {onExport && (
          <Button onClick={onExport} aria-label="Export dashboard data">
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Export Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}
