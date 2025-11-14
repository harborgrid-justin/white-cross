/**
 * Empty State Component
 *
 * Displays empty state message when no reports are found
 */

import React from 'react'
import { FileText } from 'lucide-react'

export interface EmptyStateProps {
  /** Whether filters are active */
  hasActiveFilters: boolean
  /** Callback when creating a new report */
  onCreateReport?: () => void
}

/**
 * Empty state component
 *
 * Shows appropriate message when no reports match the current filters
 * or when no reports exist at all
 *
 * @param props - Component props
 * @returns JSX element
 */
export function EmptyState({ hasActiveFilters, onCreateReport }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {hasActiveFilters
          ? 'Try adjusting your search or filters'
          : 'Get started by creating your first compliance report'}
      </p>
      {!hasActiveFilters && (
        <div className="mt-6">
          <button
            onClick={onCreateReport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Report
          </button>
        </div>
      )}
    </div>
  )
}
