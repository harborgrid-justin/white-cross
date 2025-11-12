'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { BillingListProps } from './BillingList/types';
import BillingInvoiceCard from './BillingList/BillingInvoiceCard';
import BillingInvoiceRow from './BillingList/BillingInvoiceRow';
import BillingListBulkActions from './BillingList/BillingListBulkActions';
import BillingListEmptyState from './BillingList/BillingListEmptyState';
import BillingListPagination from './BillingList/BillingListPagination';

/**
 * BillingList Component
 *
 * A comprehensive list component for displaying billing invoices with multiple
 * view modes (grid, list, table), bulk operations, pagination, and filtering.
 * Features responsive design and accessibility support.
 *
 * @param props - BillingList component props
 * @returns JSX element representing the billing invoices list
 */
const BillingList: React.FC<BillingListProps> = ({
  invoices = [],
  loading = false,
  viewMode = 'grid',
  selectedInvoices = [],
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 12,
  totalItems = 0,
  searchTerm = '',
  activeFilters = {
    status: [],
    priority: [],
    paymentMethod: [],
    dateRange: ''
  },
  className = '',
  onInvoiceClick,
  onViewDetails,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadInvoice,
  onSendInvoice,
  onRecordPayment,
  onSelectionChange,
  onPageChange,
  onViewModeChange,
  onBulkActions
}) => {
  /**
   * Handles invoice selection
   */
  const handleInvoiceSelect = (invoiceId: string, selected: boolean) => {
    const newSelection = selected
      ? [...selectedInvoices, invoiceId]
      : selectedInvoices.filter(id => id !== invoiceId);
    onSelectionChange?.(newSelection);
  };

  /**
   * Handles select all in table view
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? invoices.map(inv => inv.id) : [];
    onSelectionChange?.(newSelection);
  };

  /**
   * Handles clearing all selections
   */
  const handleClearSelection = () => {
    onSelectionChange?.([]);
  };

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Bulk Actions Bar */}
      <BillingListBulkActions
        selectedCount={selectedInvoices.length}
        selectedInvoices={selectedInvoices}
        onClearSelection={handleClearSelection}
        onBulkActions={onBulkActions}
      />

      {/* Content */}
      <div className="p-6">
        {invoices.length === 0 ? (
          <BillingListEmptyState
            searchTerm={searchTerm}
            activeFilters={activeFilters}
          />
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {invoices.map(invoice => (
                  <BillingInvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    isSelected={selectedInvoices.includes(invoice.id)}
                    onInvoiceClick={onInvoiceClick}
                    onSelectionChange={handleInvoiceSelect}
                    onViewDetails={onViewDetails}
                    onEditInvoice={onEditInvoice}
                    onDownloadInvoice={onDownloadInvoice}
                    onRecordPayment={onRecordPayment}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {invoices.map(invoice => (
                  <BillingInvoiceCard
                    key={invoice.id}
                    invoice={invoice}
                    isSelected={selectedInvoices.includes(invoice.id)}
                    onInvoiceClick={onInvoiceClick}
                    onSelectionChange={handleInvoiceSelect}
                    onViewDetails={onViewDetails}
                    onEditInvoice={onEditInvoice}
                    onDownloadInvoice={onDownloadInvoice}
                    onRecordPayment={onRecordPayment}
                  />
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.length === invoices.length && invoices.length > 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          aria-label="Select all invoices"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance Due
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map(invoice => (
                      <BillingInvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        isSelected={selectedInvoices.includes(invoice.id)}
                        onInvoiceClick={onInvoiceClick}
                        onSelectionChange={handleInvoiceSelect}
                        onViewDetails={onViewDetails}
                        onEditInvoice={onEditInvoice}
                        onDeleteInvoice={onDeleteInvoice}
                        onRecordPayment={onRecordPayment}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <BillingListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BillingList;
