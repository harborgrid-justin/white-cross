/**
 * VendorInformation Component
 * 
 * Vendor Information for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorInformationProps {
  className?: string;
}

/**
 * VendorInformation component - Vendor Information
 */
const VendorInformation: React.FC<VendorInformationProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-information ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor Information functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorInformation;
