/**
 * PerformanceReviews Component
 * 
 * Performance Reviews for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PerformanceReviewsProps {
  className?: string;
}

/**
 * PerformanceReviews component - Performance Reviews
 */
const PerformanceReviews: React.FC<PerformanceReviewsProps> = ({ className = '' }) => {
  return (
    <div className={`performance-reviews ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Reviews</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Performance Reviews functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReviews;
