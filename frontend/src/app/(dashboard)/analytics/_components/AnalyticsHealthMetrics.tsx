/**
 * @fileoverview Analytics Health Metrics Component - Detailed health metrics grid
 * @module app/(dashboard)/analytics/_components/AnalyticsHealthMetrics
 * @category Analytics - Components
 */

'use client';

import React from 'react';
import { Filter, Search, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getTrendIcon,
  getTrendColor,
  getCategoryIcon,
  getCategoryColor,
  formatDate
} from './utils/analytics.helpers';
import type { AnalyticsHealthMetricsProps } from './utils/analytics.types';

/**
 * Analytics Health Metrics Component
 *
 * Displays a grid of detailed health metrics with trends, categories, and descriptions
 *
 * @param props - Component props
 * @param props.metrics - Array of health metric objects
 * @param props.onFilter - Optional callback for filter button click
 * @param props.onSearch - Optional callback for search button click
 *
 * @example
 * ```tsx
 * <AnalyticsHealthMetrics
 *   metrics={metricsArray}
 *   onFilter={handleFilter}
 *   onSearch={handleSearch}
 * />
 * ```
 */
export const AnalyticsHealthMetrics = React.memo(function AnalyticsHealthMetrics({
  metrics,
  onFilter,
  onSearch
}: AnalyticsHealthMetricsProps) {
  return (
    <Card>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Key Health Metrics</h3>
            <p className="text-sm text-gray-500">
              Real-time healthcare performance indicators
            </p>
          </div>
          <div className="flex gap-2">
            {onFilter && (
              <Button variant="outline" size="sm" onClick={onFilter} aria-label="Filter metrics">
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                Filter
              </Button>
            )}
            {onSearch && (
              <Button variant="outline" size="sm" onClick={onSearch} aria-label="Search metrics">
                <Search className="h-4 w-4 mr-2" aria-hidden="true" />
                Search
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => {
            const TrendIcon = getTrendIcon(metric.trend);
            const CategoryIcon = getCategoryIcon(metric.category);

            return (
              <div
                key={metric.id}
                className="p-4 border rounded-lg hover:shadow-sm transition-all"
              >
                {/* Category and Trend Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CategoryIcon
                      className={`h-5 w-5 ${getCategoryColor(metric.category)}`}
                      aria-hidden="true"
                    />
                    <Badge variant="secondary" className="text-xs">
                      {metric.category}
                    </Badge>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}
                    aria-label={`Trend: ${metric.trend}`}
                  >
                    <TrendIcon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">
                      {metric.trend === 'up' || metric.trend === 'down'
                        ? `${Math.abs(metric.change)}${metric.unit}`
                        : 'Stable'}
                    </span>
                  </div>
                </div>

                {/* Metric Value */}
                <div className="mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{metric.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3">{metric.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Updated: {formatDate(metric.lastUpdated)}</span>
                  <Button variant="ghost" size="sm" aria-label={`View details for ${metric.name}`}>
                    <Eye className="h-3 w-3 mr-1" aria-hidden="true" />
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
});
