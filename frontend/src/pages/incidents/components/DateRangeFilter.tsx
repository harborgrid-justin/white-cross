/**
 * DateRangeFilter Component
 *
 * Production-grade date range filter with:
 * - Start and end date pickers
 * - Quick preset options (Today, This Week, This Month, Last 30/90 Days, Custom)
 * - Clear functionality
 * - Proper date validation
 *
 * @module pages/incidents/components/DateRangeFilter
 */

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  /** Start date in ISO format */
  startDate?: string;
  /** End date in ISO format */
  endDate?: string;
  /** Callback when date range changes */
  onChange: (startDate: string | undefined, endDate: string | undefined) => void;
  /** Optional CSS class name */
  className?: string;
  /** Whether filter is disabled */
  disabled?: boolean;
  /** Label for the filter */
  label?: string;
}

type DatePreset = 'today' | 'this-week' | 'this-month' | 'last-30' | 'last-90' | 'custom';

interface Preset {
  id: DatePreset;
  label: string;
}

/**
 * DateRangeFilter component
 *
 * Provides date range filtering with convenient presets and custom date selection.
 * Presets include:
 * - Today
 * - This Week
 * - This Month
 * - Last 30 Days
 * - Last 90 Days
 * - Custom (manual date selection)
 *
 * @example
 * ```tsx
 * <DateRangeFilter
 *   startDate={filters.dateFrom}
 *   endDate={filters.dateTo}
 *   onChange={(start, end) => dispatch(setFilters({ dateFrom: start, dateTo: end }))}
 * />
 * ```
 */
export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onChange,
  className = '',
  disabled = false,
  label = 'Date Range',
}) => {
  const [selectedPreset, setSelectedPreset] = useState<DatePreset>('custom');
  const [showCustomDates, setShowCustomDates] = useState(false);

  const presets: Preset[] = [
    { id: 'today', label: 'Today' },
    { id: 'this-week', label: 'This Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'last-30', label: 'Last 30 Days' },
    { id: 'last-90', label: 'Last 90 Days' },
    { id: 'custom', label: 'Custom Range' },
  ];

  /**
   * Calculate date range based on preset
   */
  const getDateRangeForPreset = (preset: DatePreset): { start: string; end: string } | null => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (preset) {
      case 'today':
        return {
          start: today.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };

      case 'this-week': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
        return {
          start: startOfWeek.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }

      case 'this-month': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          start: startOfMonth.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }

      case 'last-30': {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return {
          start: thirtyDaysAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }

      case 'last-90': {
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        return {
          start: ninetyDaysAgo.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        };
      }

      case 'custom':
        return null;

      default:
        return null;
    }
  };

  /**
   * Handle preset selection
   */
  const handlePresetChange = (preset: DatePreset) => {
    setSelectedPreset(preset);

    if (preset === 'custom') {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
      const range = getDateRangeForPreset(preset);
      if (range) {
        onChange(range.start, range.end);
      }
    }
  };

  /**
   * Handle custom start date change
   */
  const handleStartDateChange = (value: string) => {
    onChange(value || undefined, endDate);
    setSelectedPreset('custom');
    setShowCustomDates(true);
  };

  /**
   * Handle custom end date change
   */
  const handleEndDateChange = (value: string) => {
    onChange(startDate, value || undefined);
    setSelectedPreset('custom');
    setShowCustomDates(true);
  };

  /**
   * Clear date range
   */
  const handleClear = () => {
    onChange(undefined, undefined);
    setSelectedPreset('custom');
    setShowCustomDates(false);
  };

  const hasDateRange = startDate || endDate;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>

      {/* Date range presets */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => !disabled && handlePresetChange(preset.id)}
            disabled={disabled}
            className={`
              px-3 py-2 text-xs font-medium rounded-md border transition-colors
              ${
                selectedPreset === preset.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom date inputs - show when custom preset or dates are selected */}
      {(showCustomDates || selectedPreset === 'custom' || hasDateRange) && (
        <div className="space-y-3">
          {/* Start date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
                disabled={disabled}
                max={endDate || new Date().toISOString().split('T')[0]}
                className="
                  w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  rounded-md shadow-sm
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                "
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* End date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                disabled={disabled}
                min={startDate}
                max={new Date().toISOString().split('T')[0]}
                className="
                  w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  rounded-md shadow-sm
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
                "
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Clear button */}
      {hasDateRange && (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          className="mt-3 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          Clear date range
        </button>
      )}

      {/* Date range summary */}
      {hasDateRange && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {startDate && endDate ? (
              <>
                From <span className="font-semibold">{new Date(startDate).toLocaleDateString()}</span> to{' '}
                <span className="font-semibold">{new Date(endDate).toLocaleDateString()}</span>
              </>
            ) : startDate ? (
              <>
                From <span className="font-semibold">{new Date(startDate).toLocaleDateString()}</span> onwards
              </>
            ) : endDate ? (
              <>
                Until <span className="font-semibold">{new Date(endDate).toLocaleDateString()}</span>
              </>
            ) : null}
          </p>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
