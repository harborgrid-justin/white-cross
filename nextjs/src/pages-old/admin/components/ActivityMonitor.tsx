/**
 * ActivityMonitor Component
 * 
 * Activity Monitor for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ActivityMonitorProps {
  className?: string;
}

/**
 * ActivityMonitor component - Activity Monitor
 */
const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ className = '' }) => {
  return (
    <div className={`activity-monitor ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Monitor</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Activity Monitor functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitor;
