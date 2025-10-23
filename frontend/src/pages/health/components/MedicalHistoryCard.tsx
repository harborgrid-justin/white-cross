/**
 * MedicalHistoryCard Component
 * 
 * Medical History Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface MedicalHistoryCardProps {
  className?: string;
}

/**
 * MedicalHistoryCard component - Medical History Card
 */
const MedicalHistoryCard: React.FC<MedicalHistoryCardProps> = ({ className = '' }) => {
  return (
    <div className={`medical-history-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Medical History Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryCard;
