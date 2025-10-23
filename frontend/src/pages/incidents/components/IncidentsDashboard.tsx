/**
 * IncidentsDashboard Component
 * 
 * Incidents Dashboard for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentsDashboardProps {
  className?: string;
}

/**
 * IncidentsDashboard component - Incidents Dashboard
 */
const IncidentsDashboard: React.FC<IncidentsDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`incidents-dashboard ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents Dashboard</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incidents Dashboard functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentsDashboard;
