/**
 * HealthRecordsList Component
 * 
 * Health Records List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthRecordsListProps {
  className?: string;
}

/**
 * HealthRecordsList component - Health Records List
 */
const HealthRecordsList: React.FC<HealthRecordsListProps> = ({ className = '' }) => {
  return (
    <div className={`health-records-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Records List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Records List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordsList;
