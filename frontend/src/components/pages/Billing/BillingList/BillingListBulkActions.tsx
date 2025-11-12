'use client';

import React from 'react';
import {
  Send,
  Download,
  CreditCard,
  Trash2
} from 'lucide-react';
import { BillingListBulkActionsProps } from './types';

/**
 * BillingListBulkActions Component
 *
 * Displays bulk action controls when invoices are selected.
 * Provides options to send, download, process payments, or delete multiple invoices.
 *
 * @param props - BillingListBulkActions component props
 * @returns JSX element representing the bulk actions bar
 */
const BillingListBulkActions: React.FC<BillingListBulkActionsProps> = ({
  selectedCount,
  selectedInvoices,
  onClearSelection,
  onBulkActions
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-green-50 border-b border-green-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-green-900">
            {selectedCount} invoice{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-sm text-green-600 hover:text-green-800"
          >
            Clear selection
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onBulkActions?.('send', selectedInvoices)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600
                     bg-white border border-green-200 rounded hover:bg-green-50"
            aria-label="Send selected invoices"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </button>
          <button
            onClick={() => onBulkActions?.('download', selectedInvoices)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600
                     bg-white border border-green-200 rounded hover:bg-green-50"
            aria-label="Download selected invoices"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={() => onBulkActions?.('payment', selectedInvoices)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600
                     bg-white border border-green-200 rounded hover:bg-green-50"
            aria-label="Process payment for selected invoices"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Payment
          </button>
          <button
            onClick={() => onBulkActions?.('delete', selectedInvoices)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600
                     bg-white border border-red-200 rounded hover:bg-red-50"
            aria-label="Delete selected invoices"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingListBulkActions;
