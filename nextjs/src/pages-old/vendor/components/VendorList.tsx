/**
 * VendorList Component
 * 
 * Vendor List for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorListProps {
  className?: string;
}

/**
 * VendorList component - Vendor List
 */
const VendorList: React.FC<VendorListProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor List functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorList;
