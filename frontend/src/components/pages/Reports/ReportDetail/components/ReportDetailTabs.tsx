'use client';

import React from 'react';
import type { TabType } from '../types';

interface ReportDetailTabsProps {
  activeTab: TabType;
  parametersCount: number;
  historyCount: number;
  onTabChange: (tab: TabType) => void;
}

/**
 * ReportDetailTabs Component
 *
 * Tab navigation for switching between overview, parameters, and history views.
 */
const ReportDetailTabs: React.FC<ReportDetailTabsProps> = ({
  activeTab,
  parametersCount,
  historyCount,
  onTabChange
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => onTabChange('overview')}
            className={`
              py-4 px-1 border-b-2 text-sm font-medium
              ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Overview
          </button>
          {parametersCount > 0 && (
            <button
              onClick={() => onTabChange('parameters')}
              className={`
                py-4 px-1 border-b-2 text-sm font-medium
                ${activeTab === 'parameters'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Parameters ({parametersCount})
            </button>
          )}
          {historyCount > 0 && (
            <button
              onClick={() => onTabChange('history')}
              className={`
                py-4 px-1 border-b-2 text-sm font-medium
                ${activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              History ({historyCount})
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default ReportDetailTabs;
