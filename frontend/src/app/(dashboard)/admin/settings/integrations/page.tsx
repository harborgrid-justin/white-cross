/**
 * Integrations Management Page - Third-party integrations configuration
 * Enhanced with Next.js v16 Server Components, server-side data fetching, and caching
 *
 * @module app/admin/settings/integrations/page
 * @since 2025-11-05
 */

import { Suspense } from 'react'
import { Plug } from 'lucide-react'
import { getIntegrations, getIntegrationCategories } from '@/lib/actions/admin.integrations'
import { AdminPageHeader } from '@/app/(dashboard)/admin/_components/AdminPageHeader'
import IntegrationsManagementContent from './_components/IntegrationsManagementContent'

/**
 * Integrations Management Skeleton - Loading state
 */
function IntegrationsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Category Filter Skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Integrations Grid Skeleton */}
      <div>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center space-y-1">
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mx-auto" />
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Integrations Page Content - Server Component with data fetching
 */
async function IntegrationsPageContent() {
  // Parallel data fetching for better performance
  const [integrations, categories] = await Promise.all([
    getIntegrations(),
    getIntegrationCategories(),
  ])

  const enabledCount = integrations.filter(integration => integration.enabled).length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Integrations"
        description="Connect third-party services to extend functionality"
        count={enabledCount}
        countLabel="active integrations"
      />
      
      <IntegrationsManagementContent 
        initialIntegrations={integrations}
        categories={categories}
      />
    </div>
  )
}

/**
 * Integrations Page - Server Component with Suspense boundary
 */
export default function IntegrationsPage() {
  return (
    <Suspense fallback={<IntegrationsSkeleton />}>
      <IntegrationsPageContent />
    </Suspense>
  )
}
