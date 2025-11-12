/**
 * MetricCard Component
 *
 * Displays an individual analytics metric with trend indicator
 */

import React from 'react';
import { AnalyticsMetric, TimePeriod } from './ReportAnalytics.types';
import { getTrendDisplay, formatNumber } from './ReportAnalytics.helpers';

interface MetricCardProps {
  metric: AnalyticsMetric;
  selectedPeriod: TimePeriod;
  onDrillDown?: (metricId: string, filters: Record<string, unknown>) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, selectedPeriod, onDrillDown }) => {
  const Icon = metric.icon;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onDrillDown?.(metric.id, { period: selectedPeriod })}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-opacity-20" style={{ backgroundColor: metric.color }}>
          <Icon className="w-6 h-6" style={{ color: metric.color }} />
        </div>
        {getTrendDisplay(metric.trend, metric.trendPercentage)}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatNumber(metric.value)}
          </span>
          <span className="text-sm text-gray-500">{metric.unit}</span>
        </div>
        <p className="text-xs text-gray-500">
          vs {formatNumber(metric.previousValue)} last period
        </p>
      </div>
    </div>
  );
};

export default MetricCard;
