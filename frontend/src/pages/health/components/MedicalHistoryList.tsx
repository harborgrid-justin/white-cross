/**
 * MedicalHistoryList Component
 * 
 * Medical History List for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MedicalHistoryListProps {
  className?: string;
}

/**
 * MedicalHistoryList component - Medical History List
 */
const MedicalHistoryList: React.FC<MedicalHistoryListProps> = ({ className = '' }) => {
  return (
    <div className={`medical-history-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Medical History List functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryList;
