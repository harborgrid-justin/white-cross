/**
 * @fileoverview VendorsContent Component - Comprehensive Vendor Management
 *
 * Main content component for vendor management system providing comprehensive
 * vendor list, performance tracking, compliance monitoring, and quick actions.
 * Designed for healthcare platform vendor management with robust filtering,
 * search capabilities, and performance analytics.
 *
 * @module app/(dashboard)/vendors/_components/VendorsContent
 * @category Components
 * @subcategory Dashboard
 *
 * **Features:**
 * - Vendor list with performance metrics and ratings
 * - Advanced filtering by status, rating, and category
 * - Comprehensive vendor analytics and statistics
 * - Quick actions for vendor management
 * - Performance tracking and compliance indicators
 * - Responsive design with mobile optimization
 *
 * **Healthcare Context:**
 * - Medical supply vendor management
 * - Pharmaceutical distributor tracking
 * - Compliance documentation management
 * - Cost analysis and budget tracking
 * - Emergency supplier coordination
 *
 * **Refactored Architecture:**
 * This component has been refactored from a 1013-line monolithic component
 * into a composition of focused sub-components:
 * - VendorsHeader: Page header with actions
 * - VendorStatsCards: Statistics display
 * - VendorFilters: Search and filter controls
 * - VendorsList: Grid of vendor cards
 * - VendorCard: Individual vendor display
 * - Custom hooks: useVendorData, useVendorFilters
 *
 * @since 2025-10-31
 * @refactored 2025-11-04
 */

'use client'

import React, { useMemo } from 'react'
import VendorsHeader from './VendorsHeader'
import VendorStatsCards from './VendorStatsCards'
import VendorFilters from './VendorFilters'
import VendorsList from './VendorsList'
import { useVendorData } from './useVendorData'
import { useVendorFilters } from './useVendorFilters'
import { mockVendors } from './vendors.mock'
import { extractUniqueCategories } from './vendors.utils'
import type { VendorFilters as VendorFiltersType } from '@/lib/actions/vendors.actions'

/**
 * VendorsContent Props Interface
 */
interface VendorsContentProps {
  className?: string
  searchParams?: {
    page?: string
    limit?: string
    search?: string
    type?: string
    status?: string
    priority?: string
    sortBy?: string
    sortOrder?: string
  }
}

/**
 * VendorsContent Component
 *
 * Comprehensive vendor management interface with filtering, search, performance metrics,
 * and quick actions. Designed for healthcare platform vendor management with focus on
 * compliance, performance tracking, and efficient vendor operations.
 *
 * This refactored version uses component composition to improve maintainability and
 * reduce complexity. Each sub-component has a single responsibility and can be
 * tested and modified independently.
 *
 * @param {VendorsContentProps} props - Component properties
 * @returns {JSX.Element} Complete vendors management interface
 *
 * @example
 * ```tsx
 * <VendorsContent className="min-h-screen" />
 * ```
 */
export default function VendorsContent({ className = '', searchParams }: VendorsContentProps): React.JSX.Element {
  // Build server-side filters from search params
  const serverFilters = useMemo(() => {
    const filters: VendorFiltersType = {}
    if (searchParams?.search) filters.name = searchParams.search
    if (searchParams?.status) filters.status = searchParams.status as any
    if (searchParams?.type) filters.type = searchParams.type as any
    if (searchParams?.priority) filters.priority = searchParams.priority as any
    return filters
  }, [searchParams])

  // Fetch vendor data and analytics
  const { vendors, analytics, stats, loading, error } = useVendorData(serverFilters)

  // Use mock data for client-side filtering (can be replaced with server data)
  const vendorsForFiltering = mockVendors

  // Client-side filtering
  const {
    filters,
    filteredVendors,
    setSearchQuery,
    setStatusFilter,
    setRatingFilter,
    setCategoryFilter,
  } = useVendorFilters(vendorsForFiltering)

  // Extract unique categories for filter dropdown
  const allCategories = useMemo(() => extractUniqueCategories(mockVendors), [])

  // Determine if any filters are active
  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.statusFilter !== 'ALL' ||
    filters.ratingFilter !== 'ALL' ||
    filters.categoryFilter !== 'ALL'

  // Show loading state
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <VendorsHeader />

      {/* Statistics Cards */}
      <VendorStatsCards stats={stats} />

      {/* Search and Filters */}
      <VendorFilters
        searchQuery={filters.searchQuery}
        statusFilter={filters.statusFilter}
        ratingFilter={filters.ratingFilter}
        categoryFilter={filters.categoryFilter}
        categories={allCategories}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onRatingChange={setRatingFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* Vendors Grid */}
      <VendorsList
        vendors={filteredVendors}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  )
}
