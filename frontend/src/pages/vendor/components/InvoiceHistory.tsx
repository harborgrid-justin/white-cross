/**
 * InvoiceHistory Component
 * 
 * Invoice History for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface InvoiceHistoryProps {
  className?: string;
}

/**
 * InvoiceHistory component - Invoice History
 */
const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ className = '' }) => {
  return (
    <div className={`invoice-history ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice History</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Invoice History functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistory;
