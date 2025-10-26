/**
 * DentalList Component
 * 
 * Dental List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DentalListProps {
  className?: string;
}

/**
 * DentalList component - Dental List
 */
const DentalList: React.FC<DentalListProps> = ({ className = '' }) => {
  return (
    <div className={`dental-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dental List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Dental List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DentalList;
