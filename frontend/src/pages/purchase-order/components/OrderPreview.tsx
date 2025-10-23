/**
 * OrderPreview Component
 * 
 * Order Preview for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface OrderPreviewProps {
  className?: string;
}

/**
 * OrderPreview component - Order Preview
 */
const OrderPreview: React.FC<OrderPreviewProps> = ({ className = '' }) => {
  return (
    <div className={`order-preview ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Preview</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Order Preview functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default OrderPreview;
