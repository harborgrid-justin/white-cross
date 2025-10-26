/**
 * ProgressWidget Component - Progress Bars for Goals/Tasks
 *
 * Displays multiple progress items with progress bars, percentages, and color coding.
 * Useful for tracking goals, completion rates, and other metrics.
 *
 * @module components/features/dashboard/ProgressWidget
 */

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Progress status indicators
 * @typedef {'on-track' | 'at-risk' | 'behind' | 'complete'} ProgressStatus
 */
export type ProgressStatus = 'on-track' | 'at-risk' | 'behind' | 'complete';

/**
 * Progress item data structure
 * @interface ProgressItem
 * @property {string} id - Unique identifier
 * @property {string} label - Progress item label
 * @property {number} current - Current value
 * @property {number} target - Target value
 * @property {ProgressStatus} [status] - Progress status affecting color
 * @property {string} [description] - Additional description
 * @property {number} [trend] - Percentage change from previous period
 */
export interface ProgressItem {
  id: string;
  label: string;
  current: number;
  target: number;
  status?: ProgressStatus;
  description?: string;
  trend?: number;
}

/**
 * Props for ProgressWidget component
 * @interface ProgressWidgetProps
 * @property {string} title - Widget title
 * @property {string} [subtitle] - Optional subtitle
 * @property {ProgressItem[]} items - Array of progress items
 * @property {boolean} [loading=false] - Show loading state
 * @property {boolean} [darkMode=false] - Enable dark theme
 * @property {string} [className=''] - Additional CSS classes
 * @property {boolean} [showPercentage=true] - Display percentages instead of fractions
 * @property {boolean} [showTrend=true] - Show trend indicators
 */
export interface ProgressWidgetProps {
  title: string;
  subtitle?: string;
  items: ProgressItem[];
  loading?: boolean;
  darkMode?: boolean;
  className?: string;
  showPercentage?: boolean;
  showTrend?: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

const getProgressColor = (percentage: number, status?: ProgressStatus, darkMode?: boolean) => {
  // Use status if provided
  if (status) {
    const colors = {
      complete: darkMode ? 'bg-green-500' : 'bg-green-600',
      'on-track': darkMode ? 'bg-blue-500' : 'bg-blue-600',
      'at-risk': darkMode ? 'bg-yellow-500' : 'bg-yellow-600',
      behind: darkMode ? 'bg-red-500' : 'bg-red-600'
    };
    return colors[status];
  }

  // Otherwise, use percentage
  if (percentage >= 100) return darkMode ? 'bg-green-500' : 'bg-green-600';
  if (percentage >= 75) return darkMode ? 'bg-blue-500' : 'bg-blue-600';
  if (percentage >= 50) return darkMode ? 'bg-yellow-500' : 'bg-yellow-600';
  return darkMode ? 'bg-red-500' : 'bg-red-600';
};

const getStatusBadge = (status: ProgressStatus, darkMode: boolean) => {
  const badges = {
    complete: {
      label: 'Complete',
      bg: darkMode ? 'bg-green-900/20' : 'bg-green-100',
      text: darkMode ? 'text-green-400' : 'text-green-700'
    },
    'on-track': {
      label: 'On Track',
      bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-100',
      text: darkMode ? 'text-blue-400' : 'text-blue-700'
    },
    'at-risk': {
      label: 'At Risk',
      bg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100',
      text: darkMode ? 'text-yellow-400' : 'text-yellow-700'
    },
    behind: {
      label: 'Behind',
      bg: darkMode ? 'bg-red-900/20' : 'bg-red-100',
      text: darkMode ? 'text-red-400' : 'text-red-700'
    }
  };

  return badges[status];
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ProgressWidget Component - Progress tracking for goals and tasks
 *
 * Displays multiple progress items with animated progress bars, status badges,
 * and trend indicators. Useful for tracking goals, completion rates, and KPIs.
 *
 * @component
 * @param {ProgressWidgetProps} props - Component props
 * @returns {React.ReactElement} Rendered progress widget
 *
 * @example
 * ```tsx
 * <ProgressWidget
 *   title="Health Screening Goals"
 *   items={[
 *     {
 *       id: '1',
 *       label: 'Vision Screenings',
 *       current: 145,
 *       target: 200,
 *       status: 'on-track',
 *       trend: 12
 *     }
 *   ]}
 * />
 * ```
 */
export const ProgressWidget = React.memo<ProgressWidgetProps>(({
  title,
  subtitle,
  items,
  loading = false,
  darkMode = false,
  className = '',
  showPercentage = true,
  showTrend = true
}) => {
  // Theme classes
  const themeClasses = useMemo(() => ({
    container: darkMode
      ? 'bg-gray-800 border-gray-700 text-gray-200'
      : 'bg-white border-gray-200 text-gray-900',
    subtitle: darkMode ? 'text-gray-400' : 'text-gray-600',
    progressBg: darkMode ? 'bg-gray-700' : 'bg-gray-200'
  }), [darkMode]);

  return (
    <div
      className={`rounded-lg border shadow-sm ${themeClasses.container} ${className}`}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && (
          <p className={`text-sm mt-1 ${themeClasses.subtitle}`}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Progress Items */}
      <div className="p-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-8">
            <p className={themeClasses.subtitle}>No progress items to display</p>
          </div>
        )}

        {!loading && items.map((item) => {
          const percentage = Math.min((item.current / item.target) * 100, 100);
          const progressColor = getProgressColor(percentage, item.status, darkMode);
          const statusBadge = item.status ? getStatusBadge(item.status, darkMode) : null;

          return (
            <div key={item.id} className="space-y-2">
              {/* Label and Value */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {statusBadge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.text}`}
                      >
                        {statusBadge.label}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className={`text-xs mt-0.5 ${themeClasses.subtitle}`}>
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Trend */}
                  {showTrend && item.trend !== undefined && (
                    <div className="flex items-center gap-1">
                      {item.trend > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : item.trend < 0 ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : (
                        <Minus className="w-3 h-3 text-gray-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          item.trend > 0
                            ? 'text-green-600 dark:text-green-400'
                            : item.trend < 0
                            ? 'text-red-600 dark:text-red-400'
                            : themeClasses.subtitle
                        }`}
                      >
                        {Math.abs(item.trend)}%
                      </span>
                    </div>
                  )}

                  {/* Current/Target */}
                  <div className="text-sm font-medium">
                    {showPercentage ? (
                      <span>{percentage.toFixed(0)}%</span>
                    ) : (
                      <span>
                        {item.current} / {item.target}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`h-2 rounded-full overflow-hidden ${themeClasses.progressBg}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label} progress`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ProgressWidget.displayName = 'ProgressWidget';

export default ProgressWidget;
