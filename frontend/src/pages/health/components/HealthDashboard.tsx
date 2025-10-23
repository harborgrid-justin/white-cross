/**
 * HealthDashboard Component
 * 
 * Health Dashboard for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthDashboardProps {
  className?: string;
}

/**
 * HealthDashboard component - Health Dashboard
 */
const HealthDashboard: React.FC<HealthDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`health-dashboard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Dashboard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Dashboard functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;
