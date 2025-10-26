/**
 * HealthOverview Component
 * 
 * Health Overview for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthOverviewProps {
  className?: string;
}

/**
 * HealthOverview component - Health Overview
 */
const HealthOverview: React.FC<HealthOverviewProps> = ({ className = '' }) => {
  return (
    <div className={`health-overview ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Overview</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Overview functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthOverview;
