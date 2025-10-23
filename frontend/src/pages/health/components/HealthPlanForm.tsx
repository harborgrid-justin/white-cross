/**
 * HealthPlanForm Component
 * 
 * Health Plan Form for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthPlanFormProps {
  className?: string;
}

/**
 * HealthPlanForm component - Health Plan Form
 */
const HealthPlanForm: React.FC<HealthPlanFormProps> = ({ className = '' }) => {
  return (
    <div className={`health-plan-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Plan Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Plan Form functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthPlanForm;
