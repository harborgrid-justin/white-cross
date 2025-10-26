/**
 * GrowthCharts Component
 * 
 * Growth Charts for health module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface GrowthChartsProps {
  className?: string;
}

/**
 * GrowthCharts component - Growth Charts
 */
const GrowthCharts: React.FC<GrowthChartsProps> = ({ className = '' }) => {
  return (
    <div className={`growth-charts ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Charts</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Growth Charts functionality</p>
          <p className="text-sm mt-2">Connected to health Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default GrowthCharts;
