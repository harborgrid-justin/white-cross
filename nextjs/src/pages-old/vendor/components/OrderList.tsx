/**
 * OrderList Component
 * 
 * Order List for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface OrderListProps {
  className?: string;
}

/**
 * OrderList component - Order List
 */
const OrderList: React.FC<OrderListProps> = ({ className = '' }) => {
  return (
    <div className={`order-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Order List functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
