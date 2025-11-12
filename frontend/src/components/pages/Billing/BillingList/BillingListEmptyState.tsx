'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';
import { BillingListEmptyStateProps } from './types';

/**
 * BillingListEmptyState Component
 *
 * Displays an empty state message when no invoices are found.
 * Shows different messages based on whether filters/search are active.
 *
 * @param props - BillingListEmptyState component props
 * @returns JSX element representing the empty state
 */
const BillingListEmptyState: React.FC<BillingListEmptyStateProps> = ({
  searchTerm,
  activeFilters,
  onClearFilters
}) => {
  // Check if any filters are active
  const hasActiveFilters = searchTerm || Object.values(activeFilters).some(arr =>
    Array.isArray(arr) ? arr.length > 0 : !!arr
  );

  return (
    <div className="text-center py-12">
      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Invoices Found</h3>
      <p className="text-gray-600 mb-4">
        {hasActiveFilters
          ? 'No invoices match your current search or filters.'
          : 'No invoices have been created yet.'
        }
      </p>
      {hasActiveFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600
                   bg-green-50 border border-green-200 rounded-md hover:bg-green-100"
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default BillingListEmptyState;
