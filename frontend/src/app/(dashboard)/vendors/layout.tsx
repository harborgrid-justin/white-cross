/**
 * @fileoverview Vendors Layout - Parallel Routes for Vendor Management
 *
 * Layout component implementing Next.js parallel routes pattern for vendor management
 * system. Provides comprehensive vendor management interface with sidebar navigation,
 * content area, and modal support for healthcare platform vendor operations.
 *
 * @module app/(dashboard)/vendors/layout
 * @category Layouts
 * @subcategory Dashboard
 *
 * **Parallel Routes Structure:**
 * - `@sidebar`: VendorsSidebar with navigation and metrics
 * - `@modal`: Modal overlays for vendor forms and actions
 * - `children`: Main vendor content pages
 *
 * **Features:**
 * - Responsive layout with vendor sidebar
 * - Loading states with skeleton components
 * - Error boundaries for vendor operations
 * - Accessibility compliance for healthcare use
 * - Healthcare-specific vendor management patterns
 *
 * **Healthcare Context:**
 * - Medical supply vendor management
 * - Pharmaceutical compliance tracking
 * - Emergency supplier coordination
 * - Regulatory compliance monitoring
 * - Cost analysis and budget tracking
 *
 * @since 2025-10-31
 */

import React, { Suspense } from 'react'
import { Metadata } from 'next'
import VendorsSidebar from './_components/VendorsSidebar'

/**
 * Metadata configuration for vendor pages
 */
export const metadata: Metadata = {
  title: 'Vendor Management | White Cross Healthcare',
  description: 'Comprehensive healthcare vendor management system with performance tracking, compliance monitoring, and purchase order management',
  keywords: [
    'healthcare vendors',
    'medical suppliers',
    'vendor management',
    'compliance tracking',
    'purchase orders',
    'vendor performance',
  ],
  robots: {
    index: false,
    follow: false,
  },
}

/**
 * Vendors Layout Props Interface
 */
interface VendorsLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  modal: React.ReactNode
}

/**
 * VendorsContentSkeleton Component
 *
 * Loading skeleton for vendor content area with realistic placeholder elements
 * matching the vendor management interface structure.
 */
function VendorsContentSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Statistics Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Search and Filters Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Vendors Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 pb-4 border-b border-gray-100">
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }, (_, j) => (
                  <div key={j} className="text-center space-y-1">
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                  </div>
                ))}
              </div>

              {/* Categories */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * VendorsSidebarSkeleton Component
 *
 * Loading skeleton for vendor sidebar with navigation sections, metrics,
 * and quick actions placeholders.
 */
function VendorsSidebarSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white border-r border-gray-200 w-80">
      <div className="p-6 space-y-6">
        {/* Header Skeleton */}
        <div>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Key Metrics Skeleton */}
        <div>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse mr-3" />
                  <div className="space-y-1">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div>
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Skeleton */}
        <div>
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-3" />
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="w-6 h-4 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div>
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Vendors Layout Component
 *
 * Implements parallel routes pattern for comprehensive vendor management system.
 * Provides responsive layout with sidebar navigation, main content area, and modal
 * support for healthcare vendor operations with loading states and error boundaries.
 *
 * @param {VendorsLayoutProps} props - Component properties
 * @param {React.ReactNode} props.children - Main vendor content pages
 * @param {React.ReactNode} props.sidebar - Sidebar navigation component
 * @param {React.ReactNode} props.modal - Modal overlay components
 *
 * @returns {React.JSX.Element} Complete vendor management layout
 *
 * @example
 * ```tsx
 * // Automatic usage by Next.js App Router
 * <VendorsLayout sidebar={<VendorsSidebar />} modal={<VendorModal />}>
 *   <VendorsPage />
 * </VendorsLayout>
 * ```
 */
export default function VendorsLayout({
  children,
  sidebar,
  modal,
}: VendorsLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar with Navigation and Metrics */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Suspense fallback={<VendorsSidebarSkeleton />}>
          {sidebar || <VendorsSidebar className="w-80" />}
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Suspense fallback={<VendorsContentSkeleton />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>

      {/* Modal Overlays */}
      <Suspense fallback={null}>
        {modal}
      </Suspense>
    </div>
  )
}