/**
 * IncidentMetrics Component
 * 
 * Incident Metrics for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IncidentMetricsProps {
  className?: string;
}

/**
 * IncidentMetrics component - Incident Metrics
 */
const IncidentMetrics: React.FC<IncidentMetricsProps> = ({ className = '' }) => {
  return (
    <div className={`incident-metrics ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Incident Metrics</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Incident Metrics functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IncidentMetrics;
