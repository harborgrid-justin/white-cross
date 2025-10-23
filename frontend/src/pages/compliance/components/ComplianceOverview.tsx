/**
 * ComplianceOverview Component
 * 
 * Compliance Overview for compliance module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ComplianceOverviewProps {
  className?: string;
}

/**
 * ComplianceOverview component - Compliance Overview
 */
const ComplianceOverview: React.FC<ComplianceOverviewProps> = ({ className = '' }) => {
  return (
    <div className={`compliance-overview ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Compliance Overview functionality</p>
          <p className="text-sm mt-2">Connected to compliance Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverview;
