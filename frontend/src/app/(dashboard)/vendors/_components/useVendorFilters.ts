/**
 * @fileoverview Custom Hook for Vendor Filtering
 * @module app/(dashboard)/vendors/_components/useVendorFilters
 *
 * Custom React hook for managing vendor filter state and filtering logic.
 */

'use client'

import { useState, useMemo } from 'react'
import type { Vendor, VendorFilterState, VendorStatus, VendorRating } from './vendors.types'

/**
 * Hook return type
 */
interface UseVendorFiltersReturn {
  filters: VendorFilterState
  filteredVendors: Vendor[]
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: VendorStatus | 'ALL') => void
  setRatingFilter: (rating: VendorRating | 'ALL') => void
  setCategoryFilter: (category: string) => void
  resetFilters: () => void
}

/**
 * Custom hook for managing vendor filters
 *
 * @param vendors - Array of vendors to filter
 * @returns Filter state, filtered vendors, and filter setter functions
 *
 * @example
 * ```tsx
 * const { filters, filteredVendors, setSearchQuery } = useVendorFilters(vendors)
 * ```
 */
export function useVendorFilters(vendors: Vendor[]): UseVendorFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<VendorStatus | 'ALL'>('ALL')
  const [ratingFilter, setRatingFilter] = useState<VendorRating | 'ALL'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  // Filter vendors based on all criteria
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.vendorNumber.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus =
        statusFilter === 'ALL' || vendor.status === statusFilter
      const matchesRating =
        ratingFilter === 'ALL' || vendor.rating === ratingFilter
      const matchesCategory =
        categoryFilter === 'ALL' || vendor.categories.includes(categoryFilter)
      return matchesSearch && matchesStatus && matchesRating && matchesCategory
    })
  }, [vendors, searchQuery, statusFilter, ratingFilter, categoryFilter])

  // Reset all filters to default
  const resetFilters = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
    setRatingFilter('ALL')
    setCategoryFilter('ALL')
  }

  return {
    filters: {
      searchQuery,
      statusFilter,
      ratingFilter,
      categoryFilter,
    },
    filteredVendors,
    setSearchQuery,
    setStatusFilter,
    setRatingFilter,
    setCategoryFilter,
    resetFilters,
  }
}
