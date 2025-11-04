/**
 * @fileoverview VendorsEmptyState Component
 * @module app/(dashboard)/vendors/_components/VendorsEmptyState
 *
 * Empty state display when no vendors are found.
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Plus } from 'lucide-react'

/**
 * VendorsEmptyState Props Interface
 */
interface VendorsEmptyStateProps {
  hasActiveFilters: boolean
  className?: string
}

/**
 * VendorsEmptyState Component
 *
 * Displays appropriate empty state message and call-to-action
 * based on whether filters are active or not.
 *
 * @param {VendorsEmptyStateProps} props - Component properties
 * @returns {JSX.Element} Empty state display
 *
 * @example
 * ```tsx
 * <VendorsEmptyState hasActiveFilters={true} />
 * ```
 */
export default function VendorsEmptyState({
  hasActiveFilters,
  className = '',
}: VendorsEmptyStateProps): React.JSX.Element {
  const router = useRouter()

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center ${className}`}>
      <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No vendors found
      </h3>
      <p className="text-gray-500 mb-6">
        {hasActiveFilters
          ? 'Try adjusting your search criteria or filters'
          : 'Get started by adding your first healthcare vendor'}
      </p>
      {!hasActiveFilters && (
        <button
          onClick={() => router.push('/vendors/new')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Vendor
        </button>
      )}
    </div>
  )
}
