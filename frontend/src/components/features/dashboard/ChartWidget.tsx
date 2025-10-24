/**
 * ChartWidget Component - Container for Chart Displays
 *
 * A reusable widget container for displaying charts on dashboards.
 * Includes title, subtitle, time range selector, export button, loading/error states.
 *
 * @module components/features/dashboard/ChartWidget
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Download, RefreshCw, Calendar } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  darkMode?: boolean;
  className?: string;
  showTimeRange?: boolean;
  timeRange?: TimeRange;
  onTimeRangeChange?: (range: TimeRange) => void;
  showExport?: boolean;
  onExport?: () => void;
  showRefresh?: boolean;
  onRefresh?: () => void;
  emptyMessage?: string;
  isEmpty?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
  { value: 'all', label: 'All time' }
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ChartWidget Component
 *
 * Features:
 * - Chart container with title/subtitle
 * - Time range selector
 * - Export functionality
 * - Refresh capability
 * - Loading skeleton
 * - Error state
 * - Empty state
 * - Dark mode support
 */
export const ChartWidget = React.memo<ChartWidgetProps>(({
  title,
  subtitle,
  children,
  loading = false,
  error = null,
  darkMode = false,
  className = '',
  showTimeRange = false,
  timeRange = '30d',
  onTimeRangeChange,
  showExport = false,
  onExport,
  showRefresh = false,
  onRefresh,
  emptyMessage = 'No data available',
  isEmpty = false
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh with loading state
  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, [onRefresh, isRefreshing]);

  // Memoize theme classes
  const themeClasses = useMemo(() => ({
    container: darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-900',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-600',
    button: darkMode
      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    select: darkMode
      ? 'bg-gray-700 border-gray-600 text-gray-200'
      : 'bg-white border-gray-300 text-gray-900'
  }), [darkMode]);

  return (
    <div
      className={`rounded-lg border shadow-sm transition-all duration-200 ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            {subtitle && (
              <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 ml-4">
            {/* Time Range Selector */}
            {showTimeRange && onTimeRangeChange && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <select
                  value={timeRange}
                  onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
                  className={`px-3 py-1.5 text-sm rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.select}`}
                  aria-label="Select time range"
                >
                  {TIME_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Refresh Button */}
            {showRefresh && onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className={`p-2 rounded-md transition-colors ${themeClasses.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin' : ''}`}
                />
              </button>
            )}

            {/* Export Button */}
            {showExport && onExport && (
              <button
                onClick={onExport}
                disabled={loading || isEmpty}
                className={`p-2 rounded-md transition-colors ${themeClasses.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Export chart"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              <p className={`text-sm ${themeClasses.subtitle}`}>Loading chart...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                Failed to load chart
              </p>
              <p className={`text-sm ${themeClasses.subtitle}`}>{error}</p>
              {showRefresh && onRefresh && (
                <button
                  onClick={handleRefresh}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && isEmpty && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className={`${themeClasses.subtitle}`}>{emptyMessage}</p>
            </div>
          </div>
        )}

        {/* Chart Content */}
        {!loading && !error && !isEmpty && (
          <div className="animate-fadeIn">
            {children}
          </div>
        )}
      </div>
    </div>
  );
});

ChartWidget.displayName = 'ChartWidget';

export default ChartWidget;
