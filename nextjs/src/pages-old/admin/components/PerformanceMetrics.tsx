/**
 * PerformanceMetrics Component
 * 
 * Performance Metrics for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PerformanceMetricsProps {
  className?: string;
}

/**
 * PerformanceMetrics component - Performance Metrics
 */
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ className = '' }) => {
  return (
    <div className={`performance-metrics ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Performance Metrics functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
