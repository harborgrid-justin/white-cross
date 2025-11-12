'use client';

import React from 'react';
import { ChevronDownIcon, ChevronUpIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { TimeSeriesData, SelectedMetric } from './types';

interface TrendsChartProps {
  timeSeriesData: TimeSeriesData[];
  selectedMetric: SelectedMetric;
  dateRange: {
    start: string;
    end: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
  onMetricChange: (metric: SelectedMetric) => void;
}

/**
 * Trends chart section displaying time series data
 */
export const TrendsChart: React.FC<TrendsChartProps> = ({
  timeSeriesData,
  selectedMetric,
  dateRange,
  isExpanded,
  onToggle,
  onMetricChange
}): React.ReactElement => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-gray-900">Communication Trends</h2>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Show metric:</span>
              <select
                value={selectedMetric}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onMetricChange(e.target.value as SelectedMetric)
                }
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sent">Messages Sent</option>
                <option value="delivered">Messages Delivered</option>
                <option value="read">Messages Read</option>
                <option value="responded">Responses Received</option>
              </select>
            </div>
          </div>

          {/* Simplified chart representation */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Time Series Chart</h3>
              <p className="text-gray-500">
                Showing {selectedMetric} over time
                <br />
                <span className="text-sm">
                  {timeSeriesData.length} data points from {dateRange.start} to {dateRange.end}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
