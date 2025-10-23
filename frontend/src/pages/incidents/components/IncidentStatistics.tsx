/**
 * IncidentStatistics Component
 * 
 * Incident Statistics for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentStatisticsProps {
  className?: string;
}

/**
 * IncidentStatistics component - Incident Statistics
 */
const IncidentStatistics: React.FC<IncidentStatisticsProps> = ({ className = '' }) => {
  return (
    <div className={`incident-statistics ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Statistics</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Statistics functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentStatistics;
