/**
 * ImmunizationCard Component
 * 
 * Immunization Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ImmunizationCardProps {
  className?: string;
}

/**
 * ImmunizationCard component - Immunization Card
 */
const ImmunizationCard: React.FC<ImmunizationCardProps> = ({ className = '' }) => {
  return (
    <div className={`immunization-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Immunization Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Immunization Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ImmunizationCard;
