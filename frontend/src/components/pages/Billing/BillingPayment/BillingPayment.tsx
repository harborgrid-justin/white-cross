'use client';

import React from 'react';
import {
  DollarSign,
  Plus,
  Download,
  RefreshCw,
  X
} from 'lucide-react';
import { BillingPaymentProps } from './types';
import { getActiveFilterCount, calculateSuccessRate } from './utils';
import PaymentAnalyticsCards from './PaymentAnalyticsCards';
import PaymentFilters from './PaymentFilters';
import PaymentTable from './PaymentTable';

/**
 * BillingPayment Component
 *
 * A comprehensive payment management component for tracking and managing all
 * payment transactions. Features payment processing, refund management, bulk
 * operations, and detailed analytics with filtering and search capabilities.
 *
 * @param props - BillingPayment component props
 * @returns JSX element representing the payment management interface
 */
const BillingPayment: React.FC<BillingPaymentProps> = ({
  payments = [],
  loading = false,
  totalPayments = 0,
  totalAmount = 0,
  totalRefunds = 0,
  pendingPayments = 0,
  failedPayments = 0,
  searchTerm = '',
  filters = {
    status: [],
    method: [],
    type: [],
    dateRange: '',
    amountRange: { min: 0, max: 10000 }
  },
  selectedPayments = [],
  className = '',
  onSearchChange,
  onFilterChange,
  onPaymentClick,
  onCreatePayment,
  onEditPayment,
  onDeletePayment,
  onProcessRefund,
  onVoidPayment,
  onViewInvoice,
  onViewPatient,
  onSelectionChange,
  onBulkActions,
  onExportPayments,
  onRefresh
}) => {
  /**
   * Handles payment selection
   */
  const handlePaymentSelect = (paymentId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedPayments, paymentId]
      : selectedPayments.filter(id => id !== paymentId);
    onSelectionChange?.(newSelection);
  };

  /**
   * Handles select all
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? payments.map(payment => payment.id) : [];
    onSelectionChange?.(newSelection);
  };

  const activeFilterCount = getActiveFilterCount(filters);
  const successRate = calculateSuccessRate(totalPayments, failedPayments);

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
                <p className="text-gray-600">
                  Track and manage all payment transactions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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

            <button
              onClick={onExportPayments}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

            <button
              onClick={onCreatePayment}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white
                       bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </button>
          </div>
        </div>

        {/* Payment Analytics Cards */}
        <PaymentAnalyticsCards
          totalPayments={totalPayments}
          totalAmount={totalAmount}
          totalRefunds={totalRefunds}
          pendingPayments={pendingPayments}
          failedPayments={failedPayments}
          successRate={successRate}
        />
      </div>

      {/* Search and Filters */}
      <PaymentFilters
        searchTerm={searchTerm}
        filters={filters}
        activeFilterCount={activeFilterCount}
        onSearchChange={onSearchChange}
        onFilterChange={onFilterChange}
      />

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-green-900">
                {selectedPayments.length} payment{selectedPayments.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => onSelectionChange?.([])}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Clear selection
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onBulkActions?.('export', selectedPayments)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600
                         bg-white border border-green-200 rounded hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => onBulkActions?.('void', selectedPayments)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600
                         bg-white border border-red-200 rounded hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Void
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment List */}
      <div className="p-6">
        <PaymentTable
          payments={payments}
          loading={loading}
          searchTerm={searchTerm}
          activeFilterCount={activeFilterCount}
          selectedPayments={selectedPayments}
          onPaymentClick={onPaymentClick}
          onEditPayment={onEditPayment}
          onProcessRefund={onProcessRefund}
          onVoidPayment={onVoidPayment}
          onViewInvoice={onViewInvoice}
          onViewPatient={onViewPatient}
          onPaymentSelect={handlePaymentSelect}
          onSelectAll={handleSelectAll}
        />
      </div>
    </div>
  );
};

export default BillingPayment;
