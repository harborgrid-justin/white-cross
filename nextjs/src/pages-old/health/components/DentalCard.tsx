/**
 * DentalCard Component
 * 
 * Dental Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DentalCardProps {
  className?: string;
}

/**
 * DentalCard component - Dental Card
 */
const DentalCard: React.FC<DentalCardProps> = ({ className = '' }) => {
  return (
    <div className={`dental-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dental Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Dental Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DentalCard;
