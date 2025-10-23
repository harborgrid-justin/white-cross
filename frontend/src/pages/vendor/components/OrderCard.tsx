/**
 * OrderCard Component
 * 
 * Order Card for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface OrderCardProps {
  className?: string;
}

/**
 * OrderCard component - Order Card
 */
const OrderCard: React.FC<OrderCardProps> = ({ className = '' }) => {
  return (
    <div className={`order-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Order Card functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
