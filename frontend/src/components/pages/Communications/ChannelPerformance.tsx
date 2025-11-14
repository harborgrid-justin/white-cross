'use client';

import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CommunicationMetrics } from './types';
import { getChannelIcon, getTrendIcon, getTrendColor } from './analyticsHelpers';

interface ChannelPerformanceProps {
  metrics: CommunicationMetrics;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Channel performance section displaying communication channel statistics
 */
export const ChannelPerformance: React.FC<ChannelPerformanceProps> = ({
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
          <h2 className="text-lg font-semibold text-gray-900">Channel Performance</h2>
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
            {Object.entries(metrics.channels).map(([channel, data]) => (
              <div key={channel} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {getChannelIcon(channel)}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{data.label}</h3>
                    <p className="text-xs text-gray-500">{data.percentage}% of total</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gray-900">{data.value.toLocaleString()}</div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(data.trend)}
                    {data.change !== undefined && (
                      <span className={`text-xs ${getTrendColor(data.trend)}`}>
                        {data.change > 0 ? '+' : ''}{data.change}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${data.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
