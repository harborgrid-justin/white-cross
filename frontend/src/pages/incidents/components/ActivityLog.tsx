/**
 * ActivityLog Component
 * 
 * Activity Log for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ActivityLogProps {
  className?: string;
}

/**
 * ActivityLog component - Activity Log
 */
const ActivityLog: React.FC<ActivityLogProps> = ({ className = '' }) => {
  return (
    <div className={`activity-log ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Activity Log functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
