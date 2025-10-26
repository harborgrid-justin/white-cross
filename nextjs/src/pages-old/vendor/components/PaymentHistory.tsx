/**
 * PaymentHistory Component
 * 
 * Payment History for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface PaymentHistoryProps {
  className?: string;
}

/**
 * PaymentHistory component - Payment History
 */
const PaymentHistory: React.FC<PaymentHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`payment-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Payment History functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
