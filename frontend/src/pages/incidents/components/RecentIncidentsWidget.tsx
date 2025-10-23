/**
 * RecentIncidentsWidget Component
 * 
 * Recent Incidents Widget for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface RecentIncidentsWidgetProps {
  className?: string;
}

/**
 * RecentIncidentsWidget component - Recent Incidents Widget
 */
const RecentIncidentsWidget: React.FC<RecentIncidentsWidgetProps> = ({ className = '' }) => {
  return (
    <div className={`recent-incidents-widget ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Incidents Widget</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Recent Incidents Widget functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default RecentIncidentsWidget;
