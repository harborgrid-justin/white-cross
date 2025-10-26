/**
 * IssuingCard Component
 * 
 * Issuing Card for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface IssuingCardProps {
  className?: string;
}

/**
 * IssuingCard component - Issuing Card
 */
const IssuingCard: React.FC<IssuingCardProps> = ({ className = '' }) => {
  return (
    <div className={`issuing-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Issuing Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Issuing Card functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default IssuingCard;
