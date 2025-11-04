/**
 * @fileoverview VendorStatsCards Component
 * @module app/(dashboard)/vendors/_components/VendorStatsCards
 *
 * Displays vendor statistics in a grid of cards with key metrics.
 */

'use client'

import React from 'react'
import {
  Building2,
  DollarSign,
  Award,
  Clock,
} from 'lucide-react'
import type { VendorStats } from './vendors.types'
import { formatCurrency } from './vendors.utils'

/**
 * VendorStatsCards Props Interface
 */
interface VendorStatsCardsProps {
  stats: VendorStats
  className?: string
}

/**
 * VendorStatsCards Component
 *
 * Displays a grid of cards showing vendor statistics including total vendors,
 * total spend, compliance rate, and average delivery time.
 *
 * @param {VendorStatsCardsProps} props - Component properties
 * @returns {JSX.Element} Statistics cards grid
 *
 * @example
 * ```tsx
 * <VendorStatsCards stats={vendorStats} />
 * ```
 */
export default function VendorStatsCards({ stats, className = '' }: VendorStatsCardsProps): React.JSX.Element {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {/* Total Vendors Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Vendors</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">
            {stats.activeVendors} active
          </span>
          <span className="text-gray-500 ml-1">vendors registered</span>
        </div>
      </div>

      {/* Total Spend Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Spend</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalSpend)}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">
            {stats.onTimeDeliveryRate}%
          </span>
          <span className="text-gray-500 ml-1">on-time delivery</span>
        </div>
      </div>

      {/* Compliance Rate Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
            <p className="text-3xl font-bold text-gray-900">{stats.complianceRate}%</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-blue-600 font-medium">
            {stats.totalCertifications}
          </span>
          <span className="text-gray-500 ml-1">certifications active</span>
        </div>
      </div>

      {/* Average Delivery Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Delivery</p>
            <p className="text-3xl font-bold text-gray-900">{stats.avgDeliveryTime}d</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 font-medium">
            {stats.excellentRated}
          </span>
          <span className="text-gray-500 ml-1">excellent ratings</span>
        </div>
      </div>
    </div>
  )
}
