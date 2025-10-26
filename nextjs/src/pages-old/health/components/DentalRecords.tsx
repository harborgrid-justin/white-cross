/**
 * DentalRecords Component
 * 
 * Dental Records for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DentalRecordsProps {
  className?: string;
}

/**
 * DentalRecords component - Dental Records
 */
const DentalRecords: React.FC<DentalRecordsProps> = ({ className = '' }) => {
  return (
    <div className={`dental-records ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dental Records</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Dental Records functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DentalRecords;
