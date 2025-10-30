'use client';

import React, { useState } from 'react';
import { 
  DollarSign,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Download,
  Send,
  CreditCard,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Grid,
  List,
  Users,
  Building,
  Receipt,
  Banknote,
  Wallet
} from 'lucide-react';
import { BillingInvoice, InvoiceStatus, InvoicePriority, PaymentMethod } from './BillingCard';

/**
 * View mode types
 */
type BillingListViewMode = 'grid' | 'list' | 'table';

/**
 * Props for the BillingList component
 */
interface BillingListProps {
  /** Array of billing invoices */
  invoices?: BillingInvoice[];
  /** Loading state */
  loading?: boolean;
  /** Current view mode */
  viewMode?: BillingListViewMode;
  /** Selected invoice IDs for bulk operations */
  selectedInvoices?: string[];
  /** Current page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Total items count */
  totalItems?: number;
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  activeFilters?: {
    status: string[];
    priority: string[];
    paymentMethod: string[];
    dateRange: string;
  };
  /** Custom CSS classes */
  className?: string;
  /** Invoice click handler */
  onInvoiceClick?: (invoice: BillingInvoice) => void;
  /** View details handler */
  onViewDetails?: (invoice: BillingInvoice) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Delete invoice handler */
  onDeleteInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: BillingListViewMode) => void;
  /** Bulk actions handler */
  onBulkActions?: (action: string, invoiceIds: string[]) => void;
}

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
const BillingList = ({
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
}: BillingListProps) => {
  // State
  const [showBulkActions, setShowBulkActions] = useState(false);

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Gets status configuration
   */
  const getStatusConfig = (status: InvoiceStatus) => {
    const configs = {
      draft: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: FileText,
        label: 'Draft'
      },
      sent: {
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: Clock,
        label: 'Sent'
      },
      paid: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Paid'
      },
      overdue: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Overdue'
      },
      cancelled: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: FileText,
        label: 'Cancelled'
      },
      refunded: {
        color: 'text-orange-600 bg-orange-100 border-orange-200',
        icon: Receipt,
        label: 'Refunded'
      }
    };
    return configs[status];
  };

  /**
   * Gets priority configuration
   */
  const getPriorityConfig = (priority: InvoicePriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400' },
      medium: { color: 'text-yellow-600', dot: 'bg-yellow-400' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400' },
      urgent: { color: 'text-red-600', dot: 'bg-red-400' }
    };
    return configs[priority];
  };

  /**
   * Gets payment method icon
   */
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const icons = {
      cash: Banknote,
      check: FileText,
      'credit-card': CreditCard,
      'debit-card': CreditCard,
      'bank-transfer': Building,
      insurance: Building
    };
    return icons[method] || Wallet;
  };

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
   * Handles select all
   */
  const handleSelectAll = (selected: boolean) => {
    const newSelection = selected ? invoices.map(inv => inv.id) : [];
    onSelectionChange?.(newSelection);
  };

  /**
   * Calculates days until due date
   */
  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Renders invoice card for grid/list view
   */
  const renderInvoiceCard = (invoice: BillingInvoice) => {
    const statusConfig = getStatusConfig(invoice.status);
    const priorityConfig = getPriorityConfig(invoice.priority);
    const StatusIcon = statusConfig.icon;
    const daysUntilDue = getDaysUntilDue(invoice.dueDate);
    const paymentPercentage = invoice.totalAmount > 0 
      ? Math.round((invoice.amountPaid / invoice.totalAmount) * 100) 
      : 0;

    return (
      <div
        key={invoice.id}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onInvoiceClick?.(invoice)}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onInvoiceClick?.(invoice);
          }
        }}
        aria-label={`Invoice ${invoice.invoiceNumber} for ${invoice.patientName}`}
      >
        {/* Selection checkbox */}
        <div className="flex items-start justify-between mb-4">
          <input
            type="checkbox"
            checked={selectedInvoices.includes(invoice.id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              e.stopPropagation();
              handleInvoiceSelect(invoice.id, e.target.checked);
            }}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
          
          <div className="flex items-center space-x-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
              <span className={`text-xs font-medium capitalize ${priorityConfig.color}`}>
                {invoice.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            #{invoice.invoiceNumber}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
            <User className="w-4 h-4" />
            <span>{invoice.patientName}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Service: {new Date(invoice.serviceDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Amount Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(invoice.totalAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Balance Due</p>
            <p className={`text-xl font-bold ${
              invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(invoice.balanceDue)}
            </p>
          </div>
        </div>

        {/* Payment Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Payment Progress</span>
            <span className="text-sm text-gray-600">{paymentPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                paymentPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${paymentPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
          
          {invoice.status === 'overdue' && daysUntilDue < 0 && (
            <span className="text-sm font-medium text-red-600">
              {Math.abs(daysUntilDue)} days overdue
            </span>
          )}
          
          {daysUntilDue > 0 && daysUntilDue <= 7 && (
            <span className="text-sm font-medium text-orange-600">
              Due in {daysUntilDue} days
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Updated {new Date(invoice.updatedAt).toLocaleDateString()}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onViewDetails?.(invoice);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              aria-label="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEditInvoice?.(invoice);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              aria-label="Edit invoice"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onRecordPayment?.(invoice);
                }}
                className="p-1 text-gray-400 hover:text-green-600 rounded"
                aria-label="Record payment"
              >
                <DollarSign className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDownloadInvoice?.(invoice);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              aria-label="Download invoice"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders invoice row for table view
   */
  const renderInvoiceRow = (invoice: BillingInvoice) => {
    const statusConfig = getStatusConfig(invoice.status);
    const priorityConfig = getPriorityConfig(invoice.priority);
    const StatusIcon = statusConfig.icon;

    return (
      <tr
        key={invoice.id}
        className="hover:bg-gray-50 cursor-pointer"
        onClick={() => onInvoiceClick?.(invoice)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedInvoices.includes(invoice.id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              handleInvoiceSelect(invoice.id, e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">#{invoice.invoiceNumber}</div>
          <div className="text-sm text-gray-500">{new Date(invoice.issueDate).toLocaleDateString()}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{invoice.patientName}</div>
          <div className="text-sm text-gray-500">{invoice.patientEmail}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
            <span className={`text-sm font-medium capitalize ${priorityConfig.color}`}>
              {invoice.priority}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {formatCurrency(invoice.totalAmount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`text-sm font-medium ${
            invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {formatCurrency(invoice.balanceDue)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {new Date(invoice.dueDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onViewDetails?.(invoice);
              }}
              className="text-blue-600 hover:text-blue-900"
              aria-label="View details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEditInvoice?.(invoice);
              }}
              className="text-gray-600 hover:text-gray-900"
              aria-label="Edit invoice"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
              <button
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onRecordPayment?.(invoice);
                }}
                className="text-green-600 hover:text-green-900"
                aria-label="Record payment"
              >
                <DollarSign className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDeleteInvoice?.(invoice);
              }}
              className="text-red-600 hover:text-red-900"
              aria-label="Delete invoice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
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
      {/* Header with bulk actions */}
      {selectedInvoices.length > 0 && (
        <div className="bg-green-50 border-b border-green-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-green-900">
                {selectedInvoices.length} invoice{selectedInvoices.length !== 1 ? 's' : ''} selected
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
                onClick={() => onBulkActions?.('send', selectedInvoices)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 
                         bg-white border border-green-200 rounded hover:bg-green-50"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
              <button
                onClick={() => onBulkActions?.('download', selectedInvoices)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 
                         bg-white border border-green-200 rounded hover:bg-green-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={() => onBulkActions?.('payment', selectedInvoices)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-600 
                         bg-white border border-green-200 rounded hover:bg-green-50"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payment
              </button>
              <button
                onClick={() => onBulkActions?.('delete', selectedInvoices)}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-red-600 
                         bg-white border border-red-200 rounded hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || Object.values(activeFilters).some(arr => Array.isArray(arr) ? arr.length > 0 : !!arr)
                ? 'No invoices match your current search or filters.'
                : 'No invoices have been created yet.'
              }
            </p>
            {searchTerm || Object.values(activeFilters).some(arr => Array.isArray(arr) ? arr.length > 0 : !!arr) ? (
              <button
                onClick={() => {/* Clear filters */}}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 
                         bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {invoices.map(renderInvoiceCard)}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {invoices.map(renderInvoiceCard)}
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
                    {invoices.map(renderInvoiceRow)}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{' '}
                      to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, totalItems)}
                      </span>{' '}
                      of{' '}
                      <span className="font-medium">{totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => onPageChange?.(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + Math.max(1, currentPage - 2);
                        return (
                          <button
                            key={page}
                            onClick={() => onPageChange?.(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === currentPage
                                ? 'z-10 bg-green-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => onPageChange?.(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Next page"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BillingList;
