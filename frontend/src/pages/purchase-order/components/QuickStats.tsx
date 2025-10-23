/**
 * QuickStats Component
 * 
 * Quick Stats for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface QuickStatsProps {
  className?: string;
}

/**
 * QuickStats component - Quick Stats
 */
const QuickStats: React.FC<QuickStatsProps> = ({ className = '' }) => {
  return (
    <div className={`quick-stats ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Quick Stats functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
