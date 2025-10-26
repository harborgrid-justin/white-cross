/**
 * DuplicateOrder Component
 * 
 * Duplicate Order for purchase-order module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface DuplicateOrderProps {
  className?: string;
}

/**
 * DuplicateOrder component - Duplicate Order
 */
const DuplicateOrder: React.FC<DuplicateOrderProps> = ({ className = '' }) => {
  return (
    <div className={`duplicate-order ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Duplicate Order</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Duplicate Order functionality</p>
          <p className="text-sm mt-2">Connected to purchase-order Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default DuplicateOrder;
