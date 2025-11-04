/**
 * OrderEmptyState Component
 *
 * Display when no purchase orders match filters or when list is empty
 */

'use client';

import { Plus, FileText } from 'lucide-react';

export interface OrderEmptyStateProps {
  hasFilters: boolean;
  onCreateNew?: () => void;
  className?: string;
}

/**
 * Empty state component for purchase orders
 */
export function OrderEmptyState({
  hasFilters,
  onCreateNew,
  className = '',
}: OrderEmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No purchase orders found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasFilters
          ? 'Try adjusting your filters'
          : 'Get started by creating a new purchase order'}
      </p>
      {!hasFilters && onCreateNew && (
        <div className="mt-6">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Purchase Order
          </button>
        </div>
      )}
    </div>
  );
}
