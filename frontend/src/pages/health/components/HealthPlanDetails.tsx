/**
 * HealthPlanDetails Component
 * 
 * Health Plan Details for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthPlanDetailsProps {
  className?: string;
}

/**
 * HealthPlanDetails component - Health Plan Details
 */
const HealthPlanDetails: React.FC<HealthPlanDetailsProps> = ({ className = '' }) => {
  return (
    <div className={`health-plan-details ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Plan Details</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Plan Details functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthPlanDetails;
