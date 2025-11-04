/**
 * @fileoverview Analytics Content Component - Main analytics dashboard coordinator
 * @module app/(dashboard)/analytics/_components/AnalyticsContent
 * @category Analytics - Components
 */

'use client';

import { BarChart3, Plus, Shield, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsDashboardMetrics } from './AnalyticsDashboardMetrics';
import { AnalyticsHealthMetrics } from './AnalyticsHealthMetrics';
import { AnalyticsReportActivity } from './AnalyticsReportActivity';
import { AnalyticsPerformanceOverview } from './AnalyticsPerformanceOverview';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { useAnalyticsFilters } from './hooks/useAnalyticsFilters';
import type { AnalyticsContentProps } from './utils/analytics.types';

/**
 * Main Analytics Content Component
 *
 * Coordinates the analytics dashboard by composing sub-components and managing data flow
 *
 * @param props - Component props
 * @param props.searchParams - URL search parameters for filtering and pagination
 *
 * @example
 * ```tsx
 * <AnalyticsContent searchParams={{ dateRange: '30d', metric: 'health' }} />
 * ```
 */
export function AnalyticsContent({ searchParams }: AnalyticsContentProps) {
  // Manage filter state
  const { selectedDateRange, dateRangeOptions, setDateRange } = useAnalyticsFilters('30d');

  // Fetch analytics data
  const { summary, metrics, reportActivity, loading } = useAnalyticsData(
    searchParams,
    selectedDateRange
  );

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Empty state
  if (!summary) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <AnalyticsHeader
        dateRange={selectedDateRange}
        dateRangeOptions={dateRangeOptions}
        onDateRangeChange={setDateRange}
        onExport={() => console.log('Exporting dashboard...')}
      />

      {/* Summary Statistics */}
      <AnalyticsDashboardMetrics summary={summary} />

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Report
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Health Metrics
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Compliance Dashboard
            </Button>
            <Button variant="outline" className="justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Real-time Monitoring
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Health Metrics */}
      <AnalyticsHealthMetrics
        metrics={metrics}
        onFilter={() => console.log('Filter clicked')}
        onSearch={() => console.log('Search clicked')}
      />

      {/* Recent Reports & Performance Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <AnalyticsReportActivity
          reportActivity={reportActivity}
          onViewAll={() => console.log('View all reports clicked')}
        />
        <AnalyticsPerformanceOverview summary={summary} />
      </div>
    </div>
  );
}
