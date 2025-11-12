'use client';

import React from 'react';
import {
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { SelectedTimeframe } from './types';

interface AnalyticsHeaderProps {
  dateRange: {
    start: string;
    end: string;
  };
  selectedTimeframe: SelectedTimeframe;
  showExportMenu: boolean;
  onTimeframeChange: (timeframe: SelectedTimeframe) => void;
  onToggleExportMenu: (show: boolean) => void;
}

/**
 * Header component for Communication Analytics with timeframe selector and export menu
 */
export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  dateRange,
  selectedTimeframe,
  showExportMenu,
  onTimeframeChange,
  onToggleExportMenu
}): React.ReactElement => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <ChartBarIcon className="h-6 w-6 text-gray-900" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication Analytics</h1>
          <p className="text-sm text-gray-500">
            {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Timeframe Selector */}
        <div className="flex rounded-md shadow-sm">
          {(['7d', '30d', '90d', 'custom'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => onTimeframeChange(timeframe)}
              className={`px-3 py-2 text-sm font-medium border ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              } ${
                timeframe === '7d' ? 'rounded-l-md' :
                timeframe === 'custom' ? 'rounded-r-md -ml-px' :
                '-ml-px'
              }`}
            >
              {timeframe === 'custom' ? 'Custom' : timeframe.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Export Menu */}
        <div className="relative">
          <button
            onClick={() => onToggleExportMenu(!showExportMenu)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2 inline" />
            Export
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div className="py-1">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Export as PDF
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Export as CSV
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Export as Excel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
