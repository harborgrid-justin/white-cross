/**
 * @fileoverview System Status Widget - Real-time system metrics display
 * @module app/(dashboard)/admin/_components/sidebar/SystemStatusWidget
 * @category Admin - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';
import { SystemMetric } from './types';
import { getMetricStatusColor } from './utils';

interface SystemStatusWidgetProps {
  metrics: SystemMetric[];
  isExpanded: boolean;
  onToggle: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

/**
 * System Status Widget Component
 *
 * Displays real-time system metrics:
 * - CPU usage
 * - Memory consumption
 * - Storage capacity
 * - Network status
 *
 * Features:
 * - Color-coded status indicators (normal/warning/critical)
 * - Manual refresh capability
 * - Expandable/collapsible section
 *
 * @param metrics - Array of system metrics to display
 * @param isExpanded - Whether the section is expanded
 * @param onToggle - Handler for section toggle
 * @param onRefresh - Optional refresh handler
 * @param isRefreshing - Whether metrics are currently refreshing
 */
export function SystemStatusWidget({
  metrics,
  isExpanded,
  onToggle,
  onRefresh,
  isRefreshing = false,
  className = '',
}: SystemStatusWidgetProps) {
  const handleRefresh = () => {
    if (onRefresh && !isRefreshing) {
      onRefresh();
    }
  };

  return (
    <Card className={className}>
      <div
        className="px-4 py-3 border-b border-gray-200 cursor-pointer flex items-center justify-between"
        onClick={onToggle}
      >
        <h3 className="text-sm font-semibold text-gray-900 flex items-center">
          <Activity className="h-4 w-4 mr-2 text-green-600" />
          System Metrics
        </h3>
        <Button variant="ghost" size="sm" aria-label={isExpanded ? 'Collapse' : 'Expand'}>
          {isExpanded ? '−' : '+'}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-3">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;

              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  role="status"
                  aria-label={`${metric.label}: ${metric.value}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${metric.color}`} aria-hidden="true" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">{metric.label}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${getMetricStatusColor(metric.status)}`}>
                      {metric.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Refreshing...' : 'Refresh Metrics'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
