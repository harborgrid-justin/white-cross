/**
 * @fileoverview VendorsList Component
 * @module app/(dashboard)/vendors/_components/VendorsList
 *
 * Grid display of vendor cards with empty state handling.
 */

'use client'

import React from 'react'
import VendorCard from './VendorCard'
import VendorsEmptyState from './VendorsEmptyState'
import type { Vendor } from './vendors.types'

/**
 * VendorsList Props Interface
 */
interface VendorsListProps {
  vendors: Vendor[]
  hasActiveFilters: boolean
  className?: string
}

/**
 * VendorsList Component
 *
 * Displays vendors in a responsive grid layout. Shows empty state
 * when no vendors match the current filters.
 *
 * @param {VendorsListProps} props - Component properties
 * @returns {JSX.Element} Vendors grid or empty state
 *
 * @example
 * ```tsx
 * <VendorsList
 *   vendors={filteredVendors}
 *   hasActiveFilters={searchQuery !== ''}
 * />
 * ```
 */
export default function VendorsList({
  vendors,
  hasActiveFilters,
  className = '',
}: VendorsListProps): React.JSX.Element {
  if (vendors.length === 0) {
    return <VendorsEmptyState hasActiveFilters={hasActiveFilters} />
  }

  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${className}`}>
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}
