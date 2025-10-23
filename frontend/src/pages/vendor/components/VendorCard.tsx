/**
 * VendorCard Component
 * 
 * Vendor Card for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorCardProps {
  className?: string;
}

/**
 * VendorCard component - Vendor Card
 */
const VendorCard: React.FC<VendorCardProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor Card functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorCard;
