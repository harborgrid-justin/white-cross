/**
 * Audit Logs Page - View system audit trail for compliance
 * Enhanced with Next.js v16 Server Components, server-side data fetching, and caching
 *
 * @module app/admin/settings/audit-logs/page
 * @since 2025-11-05
 */

import { Suspense } from 'react'
import { FileText } from 'lucide-react'
import { getAuditLogs, getAuditLogFilterOptions } from '@/lib/actions/admin.audit-logs'
import { AdminPageHeader } from '@/app/(dashboard)/admin/_components/AdminPageHeader'
import AuditLogsManagementContent from './_components/AuditLogsManagementContent'

interface AuditLogsPageProps {
  searchParams: {
    search?: string
    action?: string
    resource?: string
    range?: string
    page?: string
  }
}

/**
 * Audit Logs Management Skeleton - Loading state
 */
function AuditLogsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="grid grid-cols-5 gap-4">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-1">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Audit Logs Page Content - Server Component with data fetching
 */
async function AuditLogsPageContent({ searchParams }: AuditLogsPageProps) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1
  
  // Parallel data fetching for better performance
  const [auditLogsData, filterOptions] = await Promise.all([
    getAuditLogs({
      search: searchParams.search,
      action: searchParams.action,
      resource: searchParams.resource,
      range: searchParams.range,
      page,
      limit: 50,
    }),
    getAuditLogFilterOptions(),
  ])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Audit Logs"
        description="View system audit trail for compliance"
        count={auditLogsData.total}
        countLabel="log entries"
      />
      
      <AuditLogsManagementContent 
        initialLogs={auditLogsData.logs}
        totalCount={auditLogsData.total}
        filterOptions={{
          actions: filterOptions.actions,
          resources: filterOptions.resources,
        }}
      />
    </div>
  )
}

/**
 * Audit Logs Page - Server Component with Suspense boundary
 */
export default function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  return (
    <Suspense fallback={<AuditLogsSkeleton />}>
      <AuditLogsPageContent searchParams={searchParams} />
    </Suspense>
  )
}
