/**
 * @fileoverview Custom Hook for Vendor Data Management
 * @module app/(dashboard)/vendors/_components/useVendorData
 *
 * Custom React hook for fetching and managing vendor data from server actions.
 * Handles loading states, error handling, and data transformation.
 */

'use client'

import { useState, useEffect } from 'react'
import {
  getVendors,
  getVendorAnalytics,
  type Vendor as ServerVendor,
  type VendorAnalytics,
  type VendorFilters
} from '@/lib/actions/vendors.actions'
import type { VendorStats } from './vendors.types'
import { calculateVendorStats } from './vendors.utils'
import { mockVendors } from './vendors.mock'

/**
 * Hook return type
 */
interface UseVendorDataReturn {
  vendors: ServerVendor[]
  analytics: VendorAnalytics | null
  stats: VendorStats
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching and managing vendor data
 *
 * @param filters - Optional filters for vendor query
 * @returns Vendor data, analytics, loading state, and error state
 *
 * @example
 * ```tsx
 * const { vendors, stats, loading, error } = useVendorData({ status: 'active' })
 * ```
 */
export function useVendorData(filters?: VendorFilters): UseVendorDataReturn {
  const [vendors, setVendors] = useState<ServerVendor[]>([])
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch vendors and analytics
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch data in parallel
      const [vendorsData, analyticsData] = await Promise.all([
        getVendors(filters || {}),
        getVendorAnalytics()
      ])

      setVendors(vendorsData)
      setAnalytics(analyticsData)
    } catch (err) {
      console.error('Failed to fetch vendor data:', err)
      setError('Failed to load vendor data. Please try again.')
      // Fallback to empty data
      setVendors([])
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [JSON.stringify(filters)])

  // Calculate statistics from analytics or fallback to mock data
  const stats: VendorStats = analytics ? {
    totalVendors: analytics.totalVendors,
    activeVendors: analytics.activeVendors,
    excellentRated: analytics.preferredVendors,
    totalCertifications: 0, // Not available in analytics
    totalSpend: analytics.totalSpend,
    avgDeliveryTime: Math.round(analytics.performanceMetrics.averageDeliveryRate || 7),
    complianceRate: Math.round(analytics.complianceMetrics.fullyCompliant / Math.max(analytics.totalVendors, 1) * 100),
    onTimeDeliveryRate: Math.round(analytics.performanceMetrics.averageDeliveryRate || 85),
  } : calculateVendorStats(mockVendors)

  return {
    vendors,
    analytics,
    stats,
    loading,
    error,
    refetch: fetchData,
  }
}
