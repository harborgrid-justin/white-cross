/**
 * System Configuration Page - Manage system settings and parameters
 * Enhanced with Next.js v16 Server Components, server-side data fetching, and caching
 *
 * @module app/admin/settings/configuration/page
 * @since 2025-11-05
 */

import { Suspense } from 'react'
import { Settings } from 'lucide-react'
import { getSystemConfiguration } from '@/lib/actions/admin.configuration'
import { AdminPageHeader } from '@/app/(dashboard)/admin/_components/AdminPageHeader'
import ConfigurationManagementContent from './_components/ConfigurationManagementContent'

/**
 * Configuration Management Skeleton - Loading state
 */
function ConfigurationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Configuration Cards Skeleton */}
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Configuration Page Content - Server Component with data fetching
 */
async function ConfigurationPageContent() {
  const configuration = await getSystemConfiguration()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Configuration"
        description="Manage system-wide settings and parameters"
      />
      
      <ConfigurationManagementContent initialConfiguration={configuration} />
    </div>
  )
}

/**
 * Configuration Page - Server Component with Suspense boundary
 */
export default function ConfigurationPage() {
  return (
    <Suspense fallback={<ConfigurationSkeleton />}>
      <ConfigurationPageContent />
    </Suspense>
  )
}
