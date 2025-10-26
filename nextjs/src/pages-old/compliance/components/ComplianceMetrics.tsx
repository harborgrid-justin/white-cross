/**
 * ComplianceMetrics Component
 * 
 * Compliance Metrics for compliance module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ComplianceMetricsProps {
  className?: string;
}

/**
 * ComplianceMetrics component - Compliance Metrics
 */
const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ className = '' }) => {
  return (
    <div className={`compliance-metrics ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Metrics</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Compliance Metrics functionality</p>
          <p className="text-sm mt-2">Connected to compliance Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMetrics;
