'use client';

import React from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import { BillingHeaderFiltersProps } from './types';

/**
 * BillingHeaderFilters Component
 *
 * Provides a comprehensive filter panel for billing data with options for:
 * - Status filtering (draft, sent, paid, overdue, cancelled, refunded)
 * - Priority filtering (low, medium, high, urgent)
 * - Payment method filtering (cash, check, credit card, etc.)
 * - Date range filtering
 * - Amount range filtering
 *
 * @param props - BillingHeaderFilters component props
 * @returns JSX element containing filter controls
 */
const BillingHeaderFilters: React.FC<BillingHeaderFiltersProps> = ({
  filters,
  showFilters,
  activeFilterCount,
  onFilterChange,
  onToggleFilters,
  onClearFilters
}) => {
  /**
   * Handles status filter toggle
   */
  const handleStatusFilter = (status: string): void => {
    const newStatusFilters = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];

    onFilterChange({
      ...filters,
      status: newStatusFilters
    });
  };

  /**
   * Handles priority filter toggle
   */
  const handlePriorityFilter = (priority: string): void => {
    const newPriorityFilters = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];

    onFilterChange({
      ...filters,
      priority: newPriorityFilters
    });
  };

  /**
   * Handles payment method filter toggle
   */
  const handlePaymentMethodFilter = (method: string): void => {
    const newMethodFilters = filters.paymentMethod.includes(method)
      ? filters.paymentMethod.filter((m) => m !== method)
      : [...filters.paymentMethod, method];

    onFilterChange({
      ...filters,
      paymentMethod: newMethodFilters
    });
  };

  /**
   * Formats payment method label for display
   */
  const formatPaymentMethodLabel = (method: string): string => {
    return method.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={onToggleFilters}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md
                 hover:bg-gray-50 ${
                   activeFilterCount > 0
                     ? 'text-green-700 bg-green-50 border-green-200'
                     : 'text-gray-700 bg-white border-gray-300'
                 }`}
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

      {/* Filter Dropdown Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Filters</h3>
              <div className="flex items-center space-x-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs text-green-600 hover:text-green-800"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onToggleFilters}
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
                  {['cash', 'check', 'credit-card', 'debit-card', 'bank-transfer', 'insurance'].map(
                    (method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.paymentMethod.includes(method)}
                          onChange={() => handlePaymentMethodFilter(method)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {formatPaymentMethodLabel(method)}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label htmlFor="dateRange" className="block text-xs font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  id="dateRange"
                  value={filters.dateRange}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    onFilterChange({ ...filters, dateRange: e.target.value })
                  }
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
                      onFilterChange({
                        ...filters,
                        amountRange: { ...filters.amountRange, min: Number(e.target.value) || 0 }
                      })
                    }
                    className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm
                             focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.amountRange.max || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onFilterChange({
                        ...filters,
                        amountRange: { ...filters.amountRange, max: Number(e.target.value) || 10000 }
                      })
                    }
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
  );
};

export default BillingHeaderFilters;
