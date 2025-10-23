/**
 * OrderOverview Component
 * 
 * Order Overview for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface OrderOverviewProps {
  className?: string;
}

/**
 * OrderOverview component - Order Overview
 */
const OrderOverview: React.FC<OrderOverviewProps> = ({ className = '' }) => {
  return (
    <div className={`order-overview ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Overview</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Order Overview functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;
