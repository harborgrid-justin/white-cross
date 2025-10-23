/**
 * VendorOverview Component
 * 
 * Vendor Overview for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorOverviewProps {
  className?: string;
}

/**
 * VendorOverview component - Vendor Overview
 */
const VendorOverview: React.FC<VendorOverviewProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-overview ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Overview</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor Overview functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorOverview;
