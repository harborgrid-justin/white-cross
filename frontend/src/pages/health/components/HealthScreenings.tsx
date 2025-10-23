/**
 * HealthScreenings Component
 * 
 * Health Screenings for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthScreeningsProps {
  className?: string;
}

/**
 * HealthScreenings component - Health Screenings
 */
const HealthScreenings: React.FC<HealthScreeningsProps> = ({ className = '' }) => {
  return (
    <div className={`health-screenings ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Screenings</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Screenings functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthScreenings;
