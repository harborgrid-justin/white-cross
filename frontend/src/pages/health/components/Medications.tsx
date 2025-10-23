/**
 * Medications Component
 * 
 * Medications for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MedicationsProps {
  className?: string;
}

/**
 * Medications component - Medications
 */
const Medications: React.FC<MedicationsProps> = ({ className = '' }) => {
  return (
    <div className={`medications ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medications</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Medications functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default Medications;
