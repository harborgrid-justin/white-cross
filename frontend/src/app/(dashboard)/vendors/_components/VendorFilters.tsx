/**
 * @fileoverview VendorFilters Component
 * @module app/(dashboard)/vendors/_components/VendorFilters
 *
 * Search and filter controls for vendor management interface.
 */

'use client'

import React from 'react'
import { Search } from 'lucide-react'
import type { VendorStatus, VendorRating } from './vendors.types'

/**
 * VendorFilters Props Interface
 */
interface VendorFiltersProps {
  searchQuery: string
  statusFilter: VendorStatus | 'ALL'
  ratingFilter: VendorRating | 'ALL'
  categoryFilter: string
  categories: string[]
  onSearchChange: (query: string) => void
  onStatusChange: (status: VendorStatus | 'ALL') => void
  onRatingChange: (rating: VendorRating | 'ALL') => void
  onCategoryChange: (category: string) => void
  className?: string
}

/**
 * VendorFilters Component
 *
 * Provides search input and filter dropdowns for vendor list.
 * Includes search by name/number, status filter, rating filter, and category filter.
 *
 * @param {VendorFiltersProps} props - Component properties
 * @returns {JSX.Element} Search and filter controls
 *
 * @example
 * ```tsx
 * <VendorFilters
 *   searchQuery={query}
 *   statusFilter="ACTIVE"
 *   onSearchChange={setQuery}
 *   categories={['Medical Supplies', 'Equipment']}
 * />
 * ```
 */
export default function VendorFilters({
  searchQuery,
  statusFilter,
  ratingFilter,
  categoryFilter,
  categories,
  onSearchChange,
  onStatusChange,
  onRatingChange,
  onCategoryChange,
  className = '',
}: VendorFiltersProps): React.JSX.Element {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors by name or number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search vendors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as VendorStatus | 'ALL')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by status"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>

        {/* Rating Filter */}
        <select
          value={ratingFilter}
          onChange={(e) => onRatingChange(e.target.value as VendorRating | 'ALL')}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by rating"
        >
          <option value="ALL">All Ratings</option>
          <option value="EXCELLENT">Excellent</option>
          <option value="GOOD">Good</option>
          <option value="AVERAGE">Average</option>
          <option value="POOR">Poor</option>
          <option value="UNRATED">Unrated</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filter by category"
        >
          <option value="ALL">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
