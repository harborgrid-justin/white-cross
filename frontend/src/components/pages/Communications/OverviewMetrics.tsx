'use client';

import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CommunicationMetrics } from './types';
import { getTrendIcon, getTrendColor } from './analyticsHelpers';

interface OverviewMetricsProps {
  metrics: CommunicationMetrics;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Overview metrics section displaying key communication statistics
 */
export const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  metrics,
  isExpanded,
  onToggle
}): React.ReactElement => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Total Sent</h3>
                {getTrendIcon(metrics.total_sent.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.total_sent.value.toLocaleString()}</div>
              {metrics.total_sent.change !== undefined && (
                <div className={`text-sm ${getTrendColor(metrics.total_sent.trend)}`}>
                  {metrics.total_sent.change > 0 ? '+' : ''}{metrics.total_sent.change}% from last period
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Delivery Rate</h3>
                {getTrendIcon(metrics.delivery_rate.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.delivery_rate.percentage}%</div>
              {metrics.delivery_rate.change !== undefined && (
                <div className={`text-sm ${getTrendColor(metrics.delivery_rate.trend)}`}>
                  {metrics.delivery_rate.change > 0 ? '+' : ''}{metrics.delivery_rate.change}% from last period
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
                {getTrendIcon(metrics.response_rate.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.response_rate.percentage}%</div>
              {metrics.response_rate.change !== undefined && (
                <div className={`text-sm ${getTrendColor(metrics.response_rate.trend)}`}>
                  {metrics.response_rate.change > 0 ? '+' : ''}{metrics.response_rate.change}% from last period
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
                {getTrendIcon(metrics.avg_response_time.trend)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{metrics.avg_response_time.value}h</div>
              {metrics.avg_response_time.change !== undefined && (
                <div className={`text-sm ${getTrendColor(metrics.avg_response_time.trend)}`}>
                  {metrics.avg_response_time.change > 0 ? '+' : ''}{metrics.avg_response_time.change}h from last period
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
