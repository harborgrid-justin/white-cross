/**
 * ReorderPoints Component
 * 
 * Reorder Points for inventory module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ReorderPointsProps {
  className?: string;
}

/**
 * ReorderPoints component - Reorder Points
 */
const ReorderPoints: React.FC<ReorderPointsProps> = ({ className = '' }) => {
  return (
    <div className={`reorder-points ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reorder Points</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Reorder Points functionality</p>
          <p className="text-sm mt-2">Connected to inventory Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ReorderPoints;
