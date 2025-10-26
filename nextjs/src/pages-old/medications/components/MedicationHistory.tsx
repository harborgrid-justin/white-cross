/**
 * MedicationHistory Component
 * 
 * Medication History for medications module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MedicationHistoryProps {
  className?: string;
}

/**
 * MedicationHistory component - Medication History
 */
const MedicationHistory: React.FC<MedicationHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`medication-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Medication History functionality</p>
          <p className="text-sm mt-2">Connected to medications Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MedicationHistory;
