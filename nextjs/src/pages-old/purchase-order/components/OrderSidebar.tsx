/**
 * OrderSidebar Component
 * 
 * Order Sidebar for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface OrderSidebarProps {
  className?: string;
}

/**
 * OrderSidebar component - Order Sidebar
 */
const OrderSidebar: React.FC<OrderSidebarProps> = ({ className = '' }) => {
  return (
    <div className={`order-sidebar ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Sidebar</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Order Sidebar functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSidebar;
