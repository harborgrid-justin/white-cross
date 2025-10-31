'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  Calendar, 
  DollarSign,
  X,
  ChevronDown
} from 'lucide-react';

interface TransactionsFiltersProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: string;
    maxAmount?: string;
    studentId?: string;
    paymentMethod?: string;
  };
}

export function TransactionsFilters({ searchParams }: TransactionsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');

  const updateSearchParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to first page when filtering
    params.set('page', '1');
    window.location.search = params.toString();
  };

  const clearAllFilters = () => {
    window.location.href = '/dashboard/transactions';
  };

  const hasActiveFilters = () => {
    return !!(
      searchParams.type ||
      searchParams.status ||
      searchParams.search ||
      searchParams.dateFrom ||
      searchParams.dateTo ||
      searchParams.minAmount ||
      searchParams.maxAmount ||
      searchParams.studentId ||
      searchParams.paymentMethod
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams('search', searchQuery || null);
  };

  return (
    <Card className="p-4">
      {/* Basic Filters Row */}
      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-64 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search transactions, descriptions, or transaction numbers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <select 
          value={searchParams.type || ''}
          onChange={(e) => updateSearchParams('type', e.target.value || null)}
          className="h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
          aria-label="Filter by transaction type"
        >
          <option value="">All Types</option>
          <option value="payment">Payment</option>
          <option value="refund">Refund</option>
          <option value="fee">Fee</option>
          <option value="insurance">Insurance</option>
          <option value="copay">Copay</option>
          <option value="adjustment">Adjustment</option>
          <option value="discount">Discount</option>
          <option value="write_off">Write Off</option>
        </select>

        <select 
          value={searchParams.status || ''}
          onChange={(e) => updateSearchParams('status', e.target.value || null)}
          className="h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
          aria-label="Filter by transaction status"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
          <option value="disputed">Disputed</option>
          <option value="under_review">Under Review</option>
        </select>

        <select 
          value={searchParams.paymentMethod || ''}
          onChange={(e) => updateSearchParams('paymentMethod', e.target.value || null)}
          className="h-10 px-3 border border-gray-300 rounded-md bg-white text-sm"
          aria-label="Filter by payment method"
        >
          <option value="">All Methods</option>
          <option value="cash">Cash</option>
          <option value="check">Check</option>
          <option value="credit_card">Credit Card</option>
          <option value="debit_card">Debit Card</option>
          <option value="insurance">Insurance</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="other">Other</option>
        </select>

        {/* Expand/Collapse Advanced Filters */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
      </form>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={searchParams.dateFrom || ''}
                  onChange={(e) => updateSearchParams('dateFrom', e.target.value || null)}
                  className="text-sm"
                />
                <Input
                  type="date"
                  placeholder="To"
                  value={searchParams.dateTo || ''}
                  onChange={(e) => updateSearchParams('dateTo', e.target.value || null)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Amount Range
              </label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min ($)"
                  value={searchParams.minAmount || ''}
                  onChange={(e) => updateSearchParams('minAmount', e.target.value || null)}
                  className="text-sm"
                  min="0"
                  step="0.01"
                />
                <Input
                  type="number"
                  placeholder="Max ($)"
                  value={searchParams.maxAmount || ''}
                  onChange={(e) => updateSearchParams('maxAmount', e.target.value || null)}
                  className="text-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Student Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Student
              </label>
              <Input
                type="text"
                placeholder="Student ID or Name"
                value={searchParams.studentId || ''}
                onChange={(e) => updateSearchParams('studentId', e.target.value || null)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              {hasActiveFilters() && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-sm flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear All Filters
                </Button>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              {hasActiveFilters() ? 'Filters applied' : 'No filters applied'}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            
            {searchParams.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: {searchParams.search}
                <button 
                  onClick={() => updateSearchParams('search', null)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                  aria-label="Remove search filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchParams.type && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Type: {searchParams.type.replace('_', ' ')}
                <button 
                  onClick={() => updateSearchParams('type', null)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                  aria-label="Remove type filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchParams.status && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Status: {searchParams.status.replace('_', ' ')}
                <button 
                  onClick={() => updateSearchParams('status', null)}
                  className="hover:bg-yellow-200 rounded-full p-0.5"
                  aria-label="Remove status filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchParams.paymentMethod && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Method: {searchParams.paymentMethod.replace('_', ' ')}
                <button 
                  onClick={() => updateSearchParams('paymentMethod', null)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                  aria-label="Remove payment method filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(searchParams.dateFrom || searchParams.dateTo) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                Date: {searchParams.dateFrom || '...'} to {searchParams.dateTo || '...'}
                <button 
                  onClick={() => {
                    updateSearchParams('dateFrom', null);
                    updateSearchParams('dateTo', null);
                  }}
                  className="hover:bg-indigo-200 rounded-full p-0.5"
                  aria-label="Remove date range filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(searchParams.minAmount || searchParams.maxAmount) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Amount: ${searchParams.minAmount || '0'} - ${searchParams.maxAmount || '∞'}
                <button 
                  onClick={() => {
                    updateSearchParams('minAmount', null);
                    updateSearchParams('maxAmount', null);
                  }}
                  className="hover:bg-red-200 rounded-full p-0.5"
                  aria-label="Remove amount range filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchParams.studentId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                Student: {searchParams.studentId}
                <button 
                  onClick={() => updateSearchParams('studentId', null)}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                  aria-label="Remove student filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}