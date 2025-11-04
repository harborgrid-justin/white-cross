/**
 * @fileoverview VendorsHeader Component
 * @module app/(dashboard)/vendors/_components/VendorsHeader
 *
 * Header section for vendor management page with title and action buttons.
 */

'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Download, BarChart3 } from 'lucide-react'

/**
 * VendorsHeader Props Interface
 */
interface VendorsHeaderProps {
  className?: string
}

/**
 * VendorsHeader Component
 *
 * Displays the page header with title, description, and action buttons
 * for performance analytics, data export, and adding new vendors.
 *
 * @param {VendorsHeaderProps} props - Component properties
 * @returns {JSX.Element} Header section with actions
 *
 * @example
 * ```tsx
 * <VendorsHeader />
 * ```
 */
export default function VendorsHeader({ className = '' }: VendorsHeaderProps): React.JSX.Element {
  const router = useRouter()

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Vendor Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage healthcare vendors, track performance, and monitor compliance
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => router.push('/vendors/performance')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Performance Analytics
        </button>
        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
        <button
          onClick={() => router.push('/vendors/new')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </button>
      </div>
    </div>
  )
}
