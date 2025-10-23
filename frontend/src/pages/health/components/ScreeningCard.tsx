/**
 * ScreeningCard Component
 * 
 * Screening Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ScreeningCardProps {
  className?: string;
}

/**
 * ScreeningCard component - Screening Card
 */
const ScreeningCard: React.FC<ScreeningCardProps> = ({ className = '' }) => {
  return (
    <div className={`screening-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Screening Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ScreeningCard;
