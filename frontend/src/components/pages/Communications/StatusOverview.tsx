'use client';

import React from 'react';
import { CommunicationMetrics } from './types';
import { getStatusIcon, getTrendIcon, getTrendColor } from './analyticsHelpers';

interface StatusOverviewProps {
  metrics: CommunicationMetrics;
}

/**
 * Status overview section displaying delivery status statistics
 */
export const StatusOverview: React.FC<StatusOverviewProps> = ({ metrics }): React.ReactElement => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Delivery Status</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics.status).map(([status, data]) => (
            <div key={status} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(status)}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 capitalize">{data.label}</h3>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
