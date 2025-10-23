/**
 * VendorCategories Component
 * 
 * Vendor Categories for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface VendorCategoriesProps {
  className?: string;
}

/**
 * VendorCategories component - Vendor Categories
 */
const VendorCategories: React.FC<VendorCategoriesProps> = ({ className = '' }) => {
  return (
    <div className={`vendor-categories ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Categories</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Vendor Categories functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default VendorCategories;
