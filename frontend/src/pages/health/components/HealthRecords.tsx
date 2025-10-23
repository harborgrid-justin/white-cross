/**
 * HealthRecords Component
 * 
 * Health Records for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthRecordsProps {
  className?: string;
}

/**
 * HealthRecords component - Health Records
 */
const HealthRecords: React.FC<HealthRecordsProps> = ({ className = '' }) => {
  return (
    <div className={`health-records ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Records</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Records functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;
