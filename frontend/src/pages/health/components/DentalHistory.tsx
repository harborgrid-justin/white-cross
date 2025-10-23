/**
 * DentalHistory Component
 * 
 * Dental History for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DentalHistoryProps {
  className?: string;
}

/**
 * DentalHistory component - Dental History
 */
const DentalHistory: React.FC<DentalHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`dental-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dental History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Dental History functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DentalHistory;
