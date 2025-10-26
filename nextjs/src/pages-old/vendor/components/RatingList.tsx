/**
 * RatingList Component
 * 
 * Rating List for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface RatingListProps {
  className?: string;
}

/**
 * RatingList component - Rating List
 */
const RatingList: React.FC<RatingListProps> = ({ className = '' }) => {
  return (
    <div className={`rating-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Rating List functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default RatingList;
