/**
 * @fileoverview VendorCard Component
 * @module app/(dashboard)/vendors/_components/VendorCard
 *
 * Individual vendor card displaying vendor information, performance metrics,
 * and quick action buttons.
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Calendar,
  Award,
  Star,
  Eye,
  Package,
} from 'lucide-react'
import type { Vendor } from './vendors.types'
import { getRatingBadge, getStatusBadge, formatCurrency, formatDate } from './vendors.utils'

/**
 * VendorCard Props Interface
 */
interface VendorCardProps {
  vendor: Vendor
  className?: string
}

/**
 * Generate star rating display based on score
 */
const getRatingStars = (score: number): React.JSX.Element[] => {
  const stars = Math.round((score / 100) * 5)
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${
        i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
      }`}
    />
  ))
}

/**
 * VendorCard Component
 *
 * Displays detailed vendor information in a card format including:
 * - Vendor name, status, and rating
 * - Contact information
 * - Performance metrics
 * - Categories and compliance indicators
 * - Quick action buttons
 *
 * @param {VendorCardProps} props - Component properties
 * @returns {JSX.Element} Vendor card component
 *
 * @example
 * ```tsx
 * <VendorCard vendor={vendorData} />
 * ```
 */
export default function VendorCard({ vendor, className = '' }: VendorCardProps): React.JSX.Element {
  const router = useRouter()
  const primaryContact = vendor.contacts.find((c) => c.isPrimary)
  const primaryAddress = vendor.addresses.find((a) => a.isPrimary)

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => router.push(`/vendors/${vendor.id}`)}
    >
      <div className="p-6">
        {/* Vendor Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {vendor.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                  vendor.status
                )}`}
              >
                {vendor.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{vendor.vendorNumber}</span>
              {vendor.lastOrderDate && (
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Last order: {formatDate(vendor.lastOrderDate)}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full mb-2 ${getRatingBadge(
                vendor.rating
              )}`}
            >
              {vendor.rating}
            </span>
            {vendor.performance && (
              <div className="flex items-center gap-1">
                {getRatingStars(vendor.performance.ratingScore)}
                <span className="ml-1 text-xs text-gray-500">
                  {vendor.performance.ratingScore}/100
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        {primaryContact && (
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {primaryContact.phone}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              {primaryContact.email}
            </div>
            {primaryAddress && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {primaryAddress.city}, {primaryAddress.state}
              </div>
            )}
          </div>
        )}

        {/* Performance Metrics */}
        {vendor.performance && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {vendor.performance.onTimeDeliveryRate}%
              </div>
              <div className="text-xs text-gray-500">On-Time Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {vendor.performance.totalOrders}
              </div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(vendor.performance.totalSpend)}
              </div>
              <div className="text-xs text-gray-500">Total Spend</div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {vendor.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {category}
              </span>
            ))}
            {vendor.categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">
                +{vendor.categories.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Compliance Indicators */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {vendor.w9OnFile && (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                W-9
              </div>
            )}
            {vendor.insuranceCertOnFile && (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Insurance
              </div>
            )}
            {vendor.contractOnFile && (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Contract
              </div>
            )}
          </div>
          {vendor.certifications.length > 0 && (
            <div className="flex items-center text-xs text-blue-600">
              <Award className="w-3 h-3 mr-1" />
              {vendor.certifications.length} Certification{vendor.certifications.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/vendors/${vendor.id}`)
            }}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/purchase-orders/new?vendor=${vendor.id}`)
            }}
            className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            Create PO
          </button>
        </div>
      </div>
    </div>
  )
}
