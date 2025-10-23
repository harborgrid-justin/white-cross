/**
 * VendorProfile Component
 * 
 * Vendor Profile for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorProfileProps {
  className?: string;
}

/**
 * VendorProfile component - Vendor Profile
 */
const VendorProfile: React.FC<VendorProfileProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-profile ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Profile</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor Profile functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
