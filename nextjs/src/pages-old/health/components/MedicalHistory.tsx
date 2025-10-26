/**
 * MedicalHistory Component
 * 
 * Medical History for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MedicalHistoryProps {
  className?: string;
}

/**
 * MedicalHistory component - Medical History
 */
const MedicalHistory: React.FC<MedicalHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`medical-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Medical History functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
