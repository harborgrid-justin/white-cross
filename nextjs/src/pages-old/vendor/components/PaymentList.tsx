/**
 * PaymentList Component
 * 
 * Payment List for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PaymentListProps {
  className?: string;
}

/**
 * PaymentList component - Payment List
 */
const PaymentList: React.FC<PaymentListProps> = ({ className = '' }) => {
  return (
    <div className={`payment-list ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment List</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Payment List functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
