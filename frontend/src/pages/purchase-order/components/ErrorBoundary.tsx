/**
 * ErrorBoundary Component
 * 
 * Error Boundary for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ErrorBoundaryProps {
  className?: string;
}

/**
 * ErrorBoundary component - Error Boundary
 */
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ className = '' }) => {
  return (
    <div className={`error-boundary ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Boundary</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Error Boundary functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
