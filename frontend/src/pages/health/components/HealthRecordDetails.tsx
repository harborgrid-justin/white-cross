/**
 * HealthRecordDetails Component
 * 
 * Health Record Details for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthRecordDetailsProps {
  className?: string;
}

/**
 * HealthRecordDetails component - Health Record Details
 */
const HealthRecordDetails: React.FC<HealthRecordDetailsProps> = ({ className = '' }) => {
  return (
    <div className={`health-record-details ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Record Details</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Record Details functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordDetails;
