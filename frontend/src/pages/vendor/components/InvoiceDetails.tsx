/**
 * InvoiceDetails Component
 * 
 * Invoice Details for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface InvoiceDetailsProps {
  className?: string;
}

/**
 * InvoiceDetails component - Invoice Details
 */
const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ className = '' }) => {
  return (
    <div className={`invoice-details ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Invoice Details functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
