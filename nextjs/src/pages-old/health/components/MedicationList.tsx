/**
 * MedicationList Component
 * 
 * Medication List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MedicationListProps {
  className?: string;
}

/**
 * MedicationList component - Medication List
 */
const MedicationList: React.FC<MedicationListProps> = ({ className = '' }) => {
  return (
    <div className={`medication-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Medication List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MedicationList;
