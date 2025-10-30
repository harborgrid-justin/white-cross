'use client';

import React, { useState } from 'react';
import { 
  DollarSign,
  CreditCard,
  Calendar,
  User,
  Building,
  Receipt,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Edit3,
  Trash2,
  Search,
  Filter,
  Download,
  Send,
  Banknote,
  Wallet,
  Shield,
  FileText,
  Clock,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Eye,
  RefreshCw,
  Settings
} from 'lucide-react';
import { PaymentMethod, PaymentRecord } from './BillingCard';

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

/**
 * Payment type categories
 */
export type PaymentType = 'payment' | 'refund' | 'adjustment' | 'write-off' | 'transfer';

/**
 * Enhanced payment record interface
 */
export interface BillingPaymentRecord extends PaymentRecord {
  /** Payment status */
  status: PaymentStatus;
  /** Payment type */
  type: PaymentType;
  /** Patient information */
  patientId: string;
  patientName: string;
  /** Invoice information */
  invoiceId: string;
  invoiceNumber: string;
  /** Processing information */
  processedBy: string;
  processedAt: string;
  /** Transaction details */
  transactionId?: string;
  authorizationCode?: string;
  /** Refund information */
  refundedAmount?: number;
  refundReason?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Payment filter options
 */
interface PaymentFilterOptions {
  status: PaymentStatus[];
  method: PaymentMethod[];
  type: PaymentType[];
  dateRange: string;
  amountRange: { min: number; max: number };
}

/**
 * Props for the BillingPayment component
 */
interface BillingPaymentProps {
  /** Array of payment records */
  payments?: BillingPaymentRecord[];
  /** Loading state */
  loading?: boolean;
  /** Total payments count */
  totalPayments?: number;
  /** Total payment amount */
  totalAmount?: number;
  /** Total refunds amount */
  totalRefunds?: number;
  /** Pending payments count */
  pendingPayments?: number;
  /** Failed payments count */
  failedPayments?: number;
  /** Current search term */
  searchTerm?: string;
  /** Current filters */
  filters?: PaymentFilterOptions;
  /** Selected payments for bulk operations */
  selectedPayments?: string[];
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: PaymentFilterOptions) => void;
  /** Payment click handler */
  onPaymentClick?: (payment: BillingPaymentRecord) => void;
  /** Create payment handler */
  onCreatePayment?: () => void;
  /** Edit payment handler */
  onEditPayment?: (payment: BillingPaymentRecord) => void;
  /** Delete payment handler */
  onDeletePayment?: (payment: BillingPaymentRecord) => void;
  /** Process refund handler */
  onProcessRefund?: (payment: BillingPaymentRecord) => void;
  /** Void payment handler */
  onVoidPayment?: (payment: BillingPaymentRecord) => void;
  /** View invoice handler */
  onViewInvoice?: (invoiceId: string) => void;
  /** View patient handler */
  onViewPatient?: (patientId: string) => void;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Bulk actions handler */
  onBulkActions?: (action: string, paymentIds: string[]) => void;
  /** Export payments handler */
  onExportPayments?: () => void;
  /** Refresh data handler */
  onRefresh?: () => void;
}

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
const BillingPayment = ({
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
}: BillingPaymentProps) => {
  // State
  const [showFilters, setShowFilters] = useState(false);

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
   * Gets payment status configuration
   */
  const getStatusConfig = (status: PaymentStatus) => {
    const configs = {
      pending: {
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200',
        icon: Clock,
        label: 'Pending'
      },
      processing: {
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: RefreshCw,
        label: 'Processing'
      },
      completed: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Completed'
      },
      failed: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Failed'
      },
      cancelled: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: X,
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
   * Gets payment method configuration
   */
  const getPaymentMethodConfig = (method: PaymentMethod) => {
    const configs = {
      cash: { icon: Banknote, label: 'Cash', color: 'text-green-600' },
      check: { icon: FileText, label: 'Check', color: 'text-blue-600' },
      'credit-card': { icon: CreditCard, label: 'Credit Card', color: 'text-purple-600' },
      'debit-card': { icon: CreditCard, label: 'Debit Card', color: 'text-indigo-600' },
      'bank-transfer': { icon: Building, label: 'Bank Transfer', color: 'text-gray-600' },
      insurance: { icon: Shield, label: 'Insurance', color: 'text-blue-600' }
    };
    return configs[method] || { icon: Wallet, label: 'Other', color: 'text-gray-600' };
  };

  /**
   * Gets payment type configuration
   */
  const getPaymentTypeConfig = (type: PaymentType) => {
    const configs = {
      payment: { color: 'bg-green-100 text-green-800', label: 'Payment' },
      refund: { color: 'bg-orange-100 text-orange-800', label: 'Refund' },
      adjustment: { color: 'bg-blue-100 text-blue-800', label: 'Adjustment' },
      'write-off': { color: 'bg-red-100 text-red-800', label: 'Write-off' },
      transfer: { color: 'bg-purple-100 text-purple-800', label: 'Transfer' }
    };
    return configs[type];
  };

  /**
   * Gets active filter count
   */
  const getActiveFilterCount = () => {
    return filters.status.length + 
           filters.method.length + 
           filters.type.length + 
           (filters.dateRange ? 1 : 0) +
           (filters.amountRange.min > 0 || filters.amountRange.max < 10000 ? 1 : 0);
  };

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

  /**
   * Handles filter toggle
   */
  const handleFilterToggle = (filterType: keyof PaymentFilterOptions, value: string) => {
    const currentValues = filters[filterType] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange?.({
      ...filters,
      [filterType]: newValues
    });
  };

  const activeFilterCount = getActiveFilterCount();
  const successRate = totalPayments > 0 ? Math.round(((totalPayments - failedPayments) / totalPayments) * 100) : 0;

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
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-green-600">{totalPayments}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Revenue collected</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refunds</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalRefunds)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Amount refunded</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Awaiting processing</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Need attention</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Payment success</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments, patients, invoices..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm 
                         focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md 
                         hover:bg-gray-50 ${activeFilterCount > 0 
                           ? 'text-green-700 bg-green-50 border-green-200' 
                           : 'text-gray-700 bg-white border-gray-300'}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Close filters"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                        <div className="space-y-1">
                          {(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'] as PaymentStatus[]).map((status) => (
                            <label key={status} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.status.includes(status)}
                                onChange={() => handleFilterToggle('status', status)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Payment Method Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="space-y-1">
                          {(['cash', 'check', 'credit-card', 'debit-card', 'bank-transfer', 'insurance'] as PaymentMethod[]).map((method) => (
                            <label key={method} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.method.includes(method)}
                                onChange={() => handleFilterToggle('method', method)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Payment Type Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Payment Type</label>
                        <div className="space-y-1">
                          {(['payment', 'refund', 'adjustment', 'write-off', 'transfer'] as PaymentType[]).map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.type.includes(type)}
                                onChange={() => handleFilterToggle('type', type)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">
                                {type.replace('-', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || activeFilterCount > 0
                ? 'No payments match your current search or filters.'
                : 'No payments have been recorded yet.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedPayments.length === payments.length && payments.length > 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => {
                  const statusConfig = getStatusConfig(payment.status);
                  const methodConfig = getPaymentMethodConfig(payment.method);
                  const typeConfig = getPaymentTypeConfig(payment.type);
                  const StatusIcon = statusConfig.icon;
                  const MethodIcon = methodConfig.icon;
                  
                  return (
                    <tr
                      key={payment.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onPaymentClick?.(payment)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment.id)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                            handlePaymentSelect(payment.id, e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{payment.id.slice(-8)}</div>
                        {payment.transactionId && (
                          <div className="text-sm text-gray-500">Txn: {payment.transactionId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <button
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onViewPatient?.(payment.patientId);
                              }}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {payment.patientName}
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onViewInvoice?.(payment.invoiceId);
                          }}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          #{payment.invoiceNumber}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          payment.type === 'refund' ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {payment.type === 'refund' ? '-' : ''}{formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MethodIcon className={`w-4 h-4 mr-2 ${methodConfig.color}`} />
                          <span className="text-sm text-gray-900">{methodConfig.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                          {typeConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              onPaymentClick?.(payment);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label="View payment details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {payment.status === 'completed' && payment.type === 'payment' && (
                            <button
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onProcessRefund?.(payment);
                              }}
                              className="text-orange-600 hover:text-orange-900"
                              aria-label="Process refund"
                            >
                              <Receipt className="w-4 h-4" />
                            </button>
                          )}
                          {(payment.status === 'pending' || payment.status === 'processing') && (
                            <button
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onVoidPayment?.(payment);
                              }}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Void payment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              onEditPayment?.(payment);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label="Edit payment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPayment;
