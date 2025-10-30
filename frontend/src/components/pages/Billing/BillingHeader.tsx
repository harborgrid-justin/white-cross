'use client';

import React, { useState } from 'react';
import { 
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Settings,
  RefreshCw,
  FileText,
  Users,
  Building,
  Bell,
  Eye,
  ChevronDown,
  X,
  Banknote,
  Receipt
} from 'lucide-react';

/**
 * Filter options interface
 */
interface BillingFilterOptions {
  status: string[];
  priority: string[];
  paymentMethod: string[];
  dateRange: string;
  amountRange: { min: number; max: number };
}

/**
 * View mode types
 */
type BillingViewMode = 'grid' | 'list' | 'table' | 'chart';

/**
 * Sort option types
 */
type BillingSortOption = 'date' | 'amount' | 'status' | 'patient' | 'dueDate' | 'updated';

/**
 * Props for the BillingHeader component
 */
interface BillingHeaderProps {
  /** Total invoices count */
  totalInvoices?: number;
  /** Total revenue amount */
  totalRevenue?: number;
  /** Outstanding balance amount */
  outstandingBalance?: number;
  /** Paid invoices count */
  paidInvoices?: number;
  /** Overdue invoices count */
  overdueInvoices?: number;
  /** Draft invoices count */
  draftInvoices?: number;
  /** Average payment time in days */
  averagePaymentTime?: number;
  /** Collection rate percentage */
  collectionRate?: number;
  /** Current search term */
  searchTerm?: string;
  /** Current filters */
  filters?: BillingFilterOptions;
  /** Current view mode */
  viewMode?: BillingViewMode;
  /** Current sort option */
  sortBy?: BillingSortOption;
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: BillingFilterOptions) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: BillingViewMode) => void;
  /** Sort change handler */
  onSortChange?: (sortBy: BillingSortOption, direction: 'asc' | 'desc') => void;
  /** Create new invoice handler */
  onCreateInvoice?: () => void;
  /** Import invoices handler */
  onImportInvoices?: () => void;
  /** Export invoices handler */
  onExportInvoices?: () => void;
  /** Refresh data handler */
  onRefresh?: () => void;
  /** Settings handler */
  onSettings?: () => void;
  /** Bulk actions handler */
  onBulkActions?: () => void;
  /** Send statements handler */
  onSendStatements?: () => void;
  /** Payment processing handler */
  onProcessPayments?: () => void;
}

/**
 * BillingHeader Component
 * 
 * A comprehensive header component for billing management with financial metrics,
 * search, filtering, view controls, and billing-specific actions. Features revenue
 * tracking, payment analytics, and bulk operations support.
 * 
 * @param props - BillingHeader component props
 * @returns JSX element representing the billing management header
 */
const BillingHeader = ({
  totalInvoices = 0,
  totalRevenue = 0,
  outstandingBalance = 0,
  paidInvoices = 0,
  overdueInvoices = 0,
  draftInvoices = 0,
  averagePaymentTime = 0,
  collectionRate = 0,
  searchTerm = '',
  filters = {
    status: [],
    priority: [],
    paymentMethod: [],
    dateRange: '',
    amountRange: { min: 0, max: 10000 }
  },
  viewMode = 'grid',
  sortBy = 'date',
  sortDirection = 'desc',
  loading = false,
  className = '',
  onSearchChange,
  onFilterChange,
  onViewModeChange,
  onSortChange,
  onCreateInvoice,
  onImportInvoices,
  onExportInvoices,
  onRefresh,
  onSettings,
  onBulkActions,
  onSendStatements,
  onProcessPayments
}: BillingHeaderProps) => {
  // State
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  /**
   * Gets active filter count
   */
  const getActiveFilterCount = () => {
    return filters.status.length + 
           filters.priority.length + 
           filters.paymentMethod.length + 
           (filters.dateRange ? 1 : 0) +
           (filters.amountRange.min > 0 || filters.amountRange.max < 10000 ? 1 : 0);
  };

  /**
   * Handles filter clear
   */
  const handleClearFilters = () => {
    onFilterChange?.({
      status: [],
      priority: [],
      paymentMethod: [],
      dateRange: '',
      amountRange: { min: 0, max: 10000 }
    });
  };

  /**
   * Handles status filter toggle
   */
  const handleStatusFilter = (status: string) => {
    const newStatusFilters = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFilterChange?.({
      ...filters,
      status: newStatusFilters
    });
  };

  /**
   * Handles priority filter toggle
   */
  const handlePriorityFilter = (priority: string) => {
    const newPriorityFilters = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFilterChange?.({
      ...filters,
      priority: newPriorityFilters
    });
  };

  /**
   * Handles payment method filter toggle
   */
  const handlePaymentMethodFilter = (method: string) => {
    const newMethodFilters = filters.paymentMethod.includes(method)
      ? filters.paymentMethod.filter(m => m !== method)
      : [...filters.paymentMethod, method];
    
    onFilterChange?.({
      ...filters,
      paymentMethod: newMethodFilters
    });
  };

  const activeFilterCount = getActiveFilterCount();
  const paymentRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
                <p className="text-gray-600">
                  Manage invoices, payments, and financial records
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
              onClick={onProcessPayments}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Process Payments
            </button>
            
            <button
              onClick={onSendStatements}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Send Statements
            </button>
            
            <button
              onClick={onImportInvoices}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            
            <button
              onClick={onExportInvoices}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button
              onClick={onSettings}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={onCreateInvoice}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </button>
          </div>
        </div>

        {/* Financial Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mt-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{totalInvoices} invoices</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(outstandingBalance)}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{totalInvoices - paidInvoices} unpaid</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{paymentRate}% paid</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Requires attention</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Invoices</p>
                <p className="text-2xl font-bold text-gray-600">{draftInvoices}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Pending review</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Payment</p>
                <p className="text-2xl font-bold text-blue-600">{averagePaymentTime}d</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Days to pay</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">{collectionRate}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Success rate</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalRevenue * 0.3)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">{Math.round(totalInvoices * 0.3)} invoices</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices, patients, amounts..."
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
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Filters</h3>
                      <div className="flex items-center space-x-2">
                        {activeFilterCount > 0 && (
                          <button
                            onClick={handleClearFilters}
                            className="text-xs text-green-600 hover:text-green-800"
                          >
                            Clear all
                          </button>
                        )}
                        <button
                          onClick={() => setShowFilters(false)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          aria-label="Close filters"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                        <div className="space-y-1">
                          {['draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded'].map((status) => (
                            <label key={status} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.status.includes(status)}
                                onChange={() => handleStatusFilter(status)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Priority Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                        <div className="space-y-1">
                          {['low', 'medium', 'high', 'urgent'].map((priority) => (
                            <label key={priority} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.priority.includes(priority)}
                                onChange={() => handlePriorityFilter(priority)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Payment Method Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Payment Method</label>
                        <div className="space-y-1">
                          {['cash', 'check', 'credit-card', 'debit-card', 'bank-transfer', 'insurance'].map((method) => (
                            <label key={method} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={filters.paymentMethod.includes(method)}
                                onChange={() => handlePaymentMethodFilter(method)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {method.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Date Range Filter */}
                      <div>
                        <label htmlFor="dateRange" className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
                        <select
                          id="dateRange"
                          value={filters.dateRange}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                            onFilterChange?.({ ...filters, dateRange: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm 
                                   focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">All dates</option>
                          <option value="today">Today</option>
                          <option value="week">This week</option>
                          <option value="month">This month</option>
                          <option value="quarter">This quarter</option>
                          <option value="year">This year</option>
                        </select>
                      </div>
                      
                      {/* Amount Range Filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Amount Range</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Min"
                            value={filters.amountRange.min || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              onFilterChange?.({ 
                                ...filters, 
                                amountRange: { ...filters.amountRange, min: Number(e.target.value) || 0 }
                              })}
                            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm 
                                     focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={filters.amountRange.max || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              onFilterChange?.({ 
                                ...filters, 
                                amountRange: { ...filters.amountRange, max: Number(e.target.value) || 10000 }
                              })}
                            className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm 
                                     focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Sort
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
              
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {[
                      { value: 'date', label: 'Invoice Date' },
                      { value: 'amount', label: 'Amount' },
                      { value: 'status', label: 'Status' },
                      { value: 'patient', label: 'Patient Name' },
                      { value: 'dueDate', label: 'Due Date' },
                      { value: 'updated', label: 'Last Updated' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortChange?.(option.value as BillingSortOption, sortDirection);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          sortBy === option.value ? 'bg-green-50 text-green-700' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="float-right">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* View Mode */}
            <div className="flex items-center border border-gray-300 rounded-md">
              {[
                { mode: 'grid' as BillingViewMode, icon: BarChart3, label: 'Grid view' },
                { mode: 'list' as BillingViewMode, icon: FileText, label: 'List view' },
                { mode: 'table' as BillingViewMode, icon: Users, label: 'Table view' },
                { mode: 'chart' as BillingViewMode, icon: PieChart, label: 'Chart view' }
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.mode}
                    onClick={() => onViewModeChange?.(view.mode)}
                    className={`p-2 text-sm font-medium border-r border-gray-300 last:border-r-0 
                             hover:bg-gray-50 ${viewMode === view.mode 
                               ? 'bg-green-50 text-green-700' 
                               : 'text-gray-600'}`}
                    aria-label={view.label}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHeader;
