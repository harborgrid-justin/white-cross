/**
 * @fileoverview Districts Management Skeleton Component
 * @module app/(dashboard)/admin/settings/districts/_components/DistrictsManagementSkeleton
 * @category Admin - Components
 */

import { AdminPageHeader } from '../../../_components/AdminPageHeader';

/**
 * Skeleton loading component for districts management page
 * Provides consistent loading state while data is being fetched
 */
export function DistrictsManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <AdminPageHeader
        title="Districts Management"
        description="Manage school districts and their information"
        actions={
          <div className="flex gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
        }
      />

      {/* Action buttons skeleton */}
      <div className="flex justify-end gap-2">
        <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-28 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Search and filters skeleton */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-full lg:w-48 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            <div className="px-6 py-3 flex-1">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="px-6 py-3 flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="px-6 py-3 flex-1">
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="px-6 py-3 w-24">
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="px-6 py-3 w-24">
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Table rows */}
        <div className="divide-y divide-gray-200">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="px-6 py-4 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 flex-1">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="px-6 py-4 flex-1">
                <div className="space-y-1">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-36 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="px-6 py-4 w-24">
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="px-6 py-4 w-24">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary skeleton */}
      <div className="text-center">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mx-auto" />
      </div>
    </div>
  );
}
