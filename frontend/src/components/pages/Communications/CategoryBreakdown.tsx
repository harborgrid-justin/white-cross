'use client';

import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CommunicationMetrics } from './types';
import { getTrendIcon, getTrendColor, getCategoryColor } from './analyticsHelpers';

interface CategoryBreakdownProps {
  metrics: CommunicationMetrics;
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * Category breakdown section displaying communication by category
 */
export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
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
          <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-3">
            {Object.entries(metrics.categories).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 capitalize">{data.label}</h3>
                    <p className="text-xs text-gray-500">{data.percentage}% of total</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{data.value.toLocaleString()}</div>
                    {data.change !== undefined && (
                      <div className={`text-xs ${getTrendColor(data.trend)}`}>
                        {data.change > 0 ? '+' : ''}{data.change}%
                      </div>
                    )}
                  </div>
                  {getTrendIcon(data.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
