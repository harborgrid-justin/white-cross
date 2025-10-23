/**
 * HealthPlans Component
 * 
 * Health Plans for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthPlansProps {
  className?: string;
}

/**
 * HealthPlans component - Health Plans
 */
const HealthPlans: React.FC<HealthPlansProps> = ({ className = '' }) => {
  return (
    <div className={`health-plans ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Plans</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Plans functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthPlans;
