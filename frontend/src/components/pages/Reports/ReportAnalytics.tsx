'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, ChevronDown } from 'lucide-react';
import { ReportAnalyticsProps, TimePeriod } from './ReportAnalytics.types';
import OverviewMetrics from './OverviewMetrics';
import ChartSection from './ChartSection';
import ReportUsageTable from './ReportUsageTable';
import UserEngagementPanel from './UserEngagementPanel';
import SystemPerformancePanel from './SystemPerformancePanel';

/**
 * ReportAnalytics Component
 *
 * A comprehensive analytics dashboard component that provides insights into
 * report usage, user engagement, system performance, and trending metrics.
 * Features interactive charts, drill-down capabilities, and export functionality.
 *
 * @param props - ReportAnalytics component props
 * @returns JSX element representing the analytics dashboard
 */
const ReportAnalytics: React.FC<ReportAnalyticsProps> = ({
  metrics = [],
  charts = [],
  reportUsage = [],
  userEngagement = [],
  systemMetrics,
  loading = false,
  className = '',
  onTimePeriodChange,
  onExportData,
  onRefreshData,
  onDrillDown
}) => {
  // State
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    usage: true,
    engagement: false,
    performance: false
  });

  /**
   * Handles time period change
   */
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onTimePeriodChange?.(period);
  };

  /**
   * Toggles section expansion
   */
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Analytics</h1>
            <p className="text-gray-600 mt-1">
              Monitor report performance, user engagement, and system metrics
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Time Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePeriodChange(e.target.value as TimePeriod)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Select time period"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Export Options */}
            <div className="relative">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                aria-label="Export data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={onRefreshData}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50
                       disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* Overview Metrics */}
          <OverviewMetrics
            metrics={metrics}
            selectedPeriod={selectedPeriod}
            expanded={expandedSections.overview}
            onToggle={() => toggleSection('overview')}
            onDrillDown={onDrillDown}
          />

          {/* Charts Section */}
          {charts.length > 0 && <ChartSection charts={charts} />}

          {/* Report Usage Analytics */}
          <ReportUsageTable
            reportUsage={reportUsage}
            expanded={expandedSections.usage}
            onToggle={() => toggleSection('usage')}
          />

          {/* User Engagement */}
          <UserEngagementPanel
            userEngagement={userEngagement}
            expanded={expandedSections.engagement}
            onToggle={() => toggleSection('engagement')}
          />

          {/* System Performance */}
          <SystemPerformancePanel
            systemMetrics={systemMetrics}
            expanded={expandedSections.performance}
            onToggle={() => toggleSection('performance')}
          />
        </div>
      )}
    </div>
  );
};

export default ReportAnalytics;
