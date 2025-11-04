'use client';

import React from 'react';
import { History } from 'lucide-react';
import type { InvoiceHistoryProps } from './types';

/**
 * InvoiceHistory Component
 *
 * Displays the timeline and audit log of invoice changes, status transitions,
 * and payment events.
 *
 * @param props - InvoiceHistory component props
 * @returns JSX element representing the invoice history
 */
const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ invoice }) => {
  // TODO: Implement invoice history/audit log when backend API is available
  // This component will display:
  // - Status change events
  // - Payment events
  // - Modification history
  // - User actions timeline

  return (
    <div className="text-center py-12">
      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">Invoice history will be displayed here.</p>
      <p className="text-sm text-gray-500 mt-2">
        Timeline of status changes, payments, and modifications
      </p>
    </div>
  );
};

export default InvoiceHistory;
