/**
 * SendToVendor Component
 * 
 * Send To Vendor for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface SendToVendorProps {
  className?: string;
}

/**
 * SendToVendor component - Send To Vendor
 */
const SendToVendor: React.FC<SendToVendorProps> = ({ className = '' }) => {
  return (
    <div className={`send-to-vendor ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send To Vendor</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Send To Vendor functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default SendToVendor;
