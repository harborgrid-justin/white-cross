/**
 * LoadingSpinner Component
 * 
 * Loading Spinner for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface LoadingSpinnerProps {
  className?: string;
}

/**
 * LoadingSpinner component - Loading Spinner
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '' }) => {
  return (
    <div className={`loading-spinner ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Spinner</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Loading Spinner functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
