/**
 * HealthPlanCard Component
 * 
 * Health Plan Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthPlanCardProps {
  className?: string;
}

/**
 * HealthPlanCard component - Health Plan Card
 */
const HealthPlanCard: React.FC<HealthPlanCardProps> = ({ className = '' }) => {
  return (
    <div className={`health-plan-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Plan Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Plan Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthPlanCard;
