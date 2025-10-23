/**
 * VisitCard Component
 * 
 * Visit Card for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VisitCardProps {
  className?: string;
}

/**
 * VisitCard component - Visit Card
 */
const VisitCard: React.FC<VisitCardProps> = ({ className = '' }) => {
  return (
    <div className={`visit-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Visit Card functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VisitCard;
