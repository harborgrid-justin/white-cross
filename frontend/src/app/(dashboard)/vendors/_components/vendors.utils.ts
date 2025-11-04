/**
 * @fileoverview Vendor Utility Functions
 * @module app/(dashboard)/vendors/_components/vendors.utils
 *
 * Utility functions for vendor management UI including formatting,
 * calculations, and style helpers.
 */

import type { VendorRating, VendorStatus, Vendor, VendorStats } from './vendors.types'

/**
 * Format currency values with proper locale formatting
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get styling class for vendor rating badges
 */
export const getRatingBadge = (rating: VendorRating): string => {
  const styles = {
    EXCELLENT: 'bg-green-100 text-green-800',
    GOOD: 'bg-blue-100 text-blue-800',
    AVERAGE: 'bg-yellow-100 text-yellow-800',
    POOR: 'bg-red-100 text-red-800',
    UNRATED: 'bg-gray-100 text-gray-800',
  }
  return styles[rating] || 'bg-gray-100 text-gray-800'
}

/**
 * Get styling class for vendor status badges
 */
export const getStatusBadge = (status: VendorStatus): string => {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    BLACKLISTED: 'bg-red-100 text-red-800',
  }
  return styles[status]
}

/**
 * Calculate vendor statistics from vendor array
 */
export const calculateVendorStats = (vendors: Vendor[]): VendorStats => {
  const totalVendors = vendors.length
  const activeVendors = vendors.filter(v => v.status === 'ACTIVE').length
  const excellentRated = vendors.filter(v => v.rating === 'EXCELLENT').length
  const totalCertifications = vendors.reduce((sum, v) => sum + v.certifications.length, 0)
  const totalSpend = vendors.reduce((sum, v) => sum + (v.performance?.totalSpend || 0), 0)
  const avgDeliveryTime = vendors.reduce((sum, v) => sum + (v.performance?.averageDeliveryDays || 0), 0) / vendors.length
  const complianceRate = vendors.reduce((sum, v) => sum + (v.performance?.complianceRate || 0), 0) / vendors.length
  const onTimeDeliveryRate = vendors.reduce((sum, v) => sum + (v.performance?.onTimeDeliveryRate || 0), 0) / vendors.length

  return {
    totalVendors,
    activeVendors,
    excellentRated,
    totalCertifications,
    totalSpend,
    avgDeliveryTime: Math.round(avgDeliveryTime),
    complianceRate: Math.round(complianceRate),
    onTimeDeliveryRate: Math.round(onTimeDeliveryRate),
  }
}

/**
 * Extract unique categories from vendor array
 */
export const extractUniqueCategories = (vendors: Vendor[]): string[] => {
  return Array.from(new Set(vendors.flatMap(v => v.categories)))
}

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}
