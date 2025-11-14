'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { PaymentMethod } from '../BillingCard';
import { PaymentStatus, PaymentType, PaymentFilterOptions } from './types';

/**
 * Props for the PaymentFilters component
 */
interface PaymentFiltersProps {
  /** Current search term */
  searchTerm: string;
  /** Current filters */
  filters: PaymentFilterOptions;
  /** Active filter count */
  activeFilterCount: number;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: PaymentFilterOptions) => void;
}

/**
 * PaymentFilters Component
 *
 * Provides search and filtering functionality for payments.
 *
 * @param props - PaymentFilters component props
 * @returns JSX element representing the filters interface
 */
const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchTerm,
  filters,
  activeFilterCount,
  onSearchChange,
  onFilterChange
}) => {
  const [showFilters, setShowFilters] = useState(false);

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

  return (
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
  );
};

export default PaymentFilters;
