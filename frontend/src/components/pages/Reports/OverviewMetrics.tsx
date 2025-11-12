/**
 * OverviewMetrics Component
 *
 * Displays a collapsible section with a grid of metric cards
 */

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AnalyticsMetric, TimePeriod } from './ReportAnalytics.types';
import MetricCard from './MetricCard';

interface OverviewMetricsProps {
  metrics: AnalyticsMetric[];
  selectedPeriod: TimePeriod;
  expanded: boolean;
  onToggle: () => void;
  onDrillDown?: (metricId: string, filters: Record<string, unknown>) => void;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
  selectedPeriod,
  expanded,
  onToggle,
  onDrillDown
}) => {
  return (
    <div className="space-y-4">
      <button
        onClick={onToggle}
        className="flex items-center w-full text-left"
        aria-label="Toggle overview section"
      >
        {expanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
        )}
        <h2 className="text-lg font-semibold text-gray-900">Overview Metrics</h2>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              selectedPeriod={selectedPeriod}
              onDrillDown={onDrillDown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OverviewMetrics;
