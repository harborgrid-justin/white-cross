/**
 * VendorMetrics Component
 * 
 * Vendor Metrics for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorMetricsProps {
  className?: string;
}

/**
 * VendorMetrics component - Vendor Metrics
 */
const VendorMetrics: React.FC<VendorMetricsProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-metrics ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Metrics</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor Metrics functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorMetrics;
