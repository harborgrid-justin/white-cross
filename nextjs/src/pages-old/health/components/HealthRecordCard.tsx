/**
 * HealthRecordCard Component
 * 
 * Health Record Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface HealthRecordCardProps {
  className?: string;
}

/**
 * HealthRecordCard component - Health Record Card
 */
const HealthRecordCard: React.FC<HealthRecordCardProps> = ({ className = '' }) => {
  return (
    <div className={`health-record-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Record Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Health Record Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordCard;
