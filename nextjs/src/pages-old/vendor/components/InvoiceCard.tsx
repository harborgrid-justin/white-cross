/**
 * InvoiceCard Component
 * 
 * Invoice Card for vendor module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface InvoiceCardProps {
  className?: string;
}

/**
 * InvoiceCard component - Invoice Card
 */
const InvoiceCard: React.FC<InvoiceCardProps> = ({ className = '' }) => {
  return (
    <div className={`invoice-card ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Card</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Invoice Card functionality</p>
          <p className="text-sm mt-2">Connected to vendor Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
