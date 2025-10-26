/**
 * SystemStatistics Component
 * 
 * System Statistics for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SystemStatisticsProps {
  className?: string;
}

/**
 * SystemStatistics component - System Statistics
 */
const SystemStatistics: React.FC<SystemStatisticsProps> = ({ className = '' }) => {
  return (
    <div className={`system-statistics ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
        <div className="text-center text-gray-500 py-8">
          <p>System Statistics functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SystemStatistics;
