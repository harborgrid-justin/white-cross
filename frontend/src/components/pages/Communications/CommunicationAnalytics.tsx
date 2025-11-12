'use client';

import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { CommunicationAnalyticsProps } from './types';
import { useCommunicationAnalytics } from './useCommunicationAnalytics';
import { AnalyticsHeader } from './AnalyticsHeader';
import { CustomDateRange } from './CustomDateRange';
import { OverviewMetrics } from './OverviewMetrics';
import { ChannelPerformance } from './ChannelPerformance';
import { CategoryBreakdown } from './CategoryBreakdown';
import { StatusOverview } from './StatusOverview';
import { TrendsChart } from './TrendsChart';

/**
 * CommunicationAnalytics component for analyzing communication performance and trends
 *
 * Features:
 * - Communication volume and delivery metrics
 * - Channel performance comparison
 * - Response rate and engagement analysis
 * - Time-based trend analysis
 * - Category and priority breakdowns
 * - Export and reporting capabilities
 * - Real-time dashboard updates
 * - Customizable date ranges and filters
 *
 * @component
 * @example
 * ```tsx
 * <CommunicationAnalytics
 *   dateRange={{ start: '2024-03-01', end: '2024-03-31' }}
 *   category="emergency"
 *   onDateRangeChange={(range) => handleDateChange(range)}
 *   onFiltersChange={(filters) => handleFiltersChange(filters)}
 * />
 * ```
 */
export const CommunicationAnalytics: React.FC<CommunicationAnalyticsProps> = ({
  className = '',
  isLoading = false,
  error,
  dateRange = {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  },
  studentId,
  staffId,
  category,
  onDateRangeChange,
  onFiltersChange
}): React.ReactElement => {
  // Use custom hook for state management
  const {
    metrics,
    timeSeriesData,
    selectedMetric,
    setSelectedMetric,
    selectedTimeframe,
    showExportMenu,
    setShowExportMenu,
    expandedSections,
    toggleSection,
    handleTimeframeChange
  } = useCommunicationAnalytics({
    dateRange,
    studentId,
    staffId,
    category,
    onDateRangeChange
  });

  // Loading state
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    ) as React.ReactElement;
  }

  // No metrics state
  if (!metrics) {
    return <div className={className}>Loading metrics...</div> as React.ReactElement;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <AnalyticsHeader
        dateRange={dateRange}
        selectedTimeframe={selectedTimeframe}
        showExportMenu={showExportMenu}
        onTimeframeChange={handleTimeframeChange}
        onToggleExportMenu={setShowExportMenu}
      />

      {/* Custom Date Range */}
      {selectedTimeframe === 'custom' && onDateRangeChange && (
        <CustomDateRange
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
        />
      )}

      {/* Overview Metrics */}
      <OverviewMetrics
        metrics={metrics}
        isExpanded={expandedSections.overview}
        onToggle={() => toggleSection('overview')}
      />

      {/* Channel Performance */}
      <ChannelPerformance
        metrics={metrics}
        isExpanded={expandedSections.channels}
        onToggle={() => toggleSection('channels')}
      />

      {/* Category Breakdown */}
      <CategoryBreakdown
        metrics={metrics}
        isExpanded={expandedSections.categories}
        onToggle={() => toggleSection('categories')}
      />

      {/* Status Overview */}
      <StatusOverview metrics={metrics} />

      {/* Time Series Chart */}
      <TrendsChart
        timeSeriesData={timeSeriesData}
        selectedMetric={selectedMetric}
        dateRange={dateRange}
        isExpanded={expandedSections.trends}
        onToggle={() => toggleSection('trends')}
        onMetricChange={setSelectedMetric}
      />
    </div>
  );
};

export default CommunicationAnalytics;
