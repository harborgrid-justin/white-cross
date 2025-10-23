/**
 * AllergyCard Component
 * 
 * Allergy Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface AllergyCardProps {
  className?: string;
}

/**
 * AllergyCard component - Allergy Card
 */
const AllergyCard: React.FC<AllergyCardProps> = ({ className = '' }) => {
  return (
    <div className={`allergy-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergy Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Allergy Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default AllergyCard;
