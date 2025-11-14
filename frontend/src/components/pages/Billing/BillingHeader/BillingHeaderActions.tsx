'use client';

import React from 'react';
import {
  Plus,
  Upload,
  Download,
  CreditCard,
  Settings,
  RefreshCw,
  FileText
} from 'lucide-react';
import { BillingHeaderActionsProps } from './types';

/**
 * BillingHeaderActions Component
 *
 * Displays action buttons for billing operations including:
 * - Refresh data
 * - Process payments
 * - Send statements
 * - Import/Export invoices
 * - Settings
 * - Create new invoice
 *
 * @param props - BillingHeaderActions component props
 * @returns JSX element containing action buttons
 */
const BillingHeaderActions: React.FC<BillingHeaderActionsProps> = ({
  loading,
  onRefresh,
  onProcessPayments,
  onSendStatements,
  onImportInvoices,
  onExportInvoices,
  onSettings,
  onCreateInvoice
}) => {
  return (
    <div className="flex items-center space-x-3">
      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        aria-label="Refresh data"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </button>

      {/* Process Payments Button */}
      <button
        onClick={onProcessPayments}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Process Payments
      </button>

      {/* Send Statements Button */}
      <button
        onClick={onSendStatements}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <FileText className="w-4 h-4 mr-2" />
        Send Statements
      </button>

      {/* Import Button */}
      <button
        onClick={onImportInvoices}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </button>

      {/* Export Button */}
      <button
        onClick={onExportInvoices}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </button>

      {/* Settings Button */}
      <button
        onClick={onSettings}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        aria-label="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {/* Create New Invoice Button */}
      <button
        onClick={onCreateInvoice}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                 bg-green-600 border border-transparent rounded-md hover:bg-green-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Invoice
      </button>
    </div>
  );
};

export default BillingHeaderActions;
