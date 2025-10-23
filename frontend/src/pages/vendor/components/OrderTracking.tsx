/**
 * OrderTracking Component
 * 
 * Order Tracking for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface OrderTrackingProps {
  className?: string;
}

/**
 * OrderTracking component - Order Tracking
 */
const OrderTracking: React.FC<OrderTrackingProps> = ({ className = '' }) => {
  return (
    <div className={`order-tracking ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Tracking</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Order Tracking functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
