/**
 * @fileoverview Medication Detail Loading UI
 * 
 * Loading skeleton for individual medication detail pages. Provides immediate
 * visual feedback while medication data is being fetched from the server.
 * 
 * This loading UI is shown during:
 * - Initial navigation to medication detail page
 * - Server-side data fetching for medication information
 * - Slow network conditions
 * 
 * @module app/(dashboard)/medications/[id]/loading
 */

export default function MedicationDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        {/* Back navigation skeleton */}
        <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
        
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        
        {/* Subtitle skeleton */}
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Medication details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic information card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>

          {/* Dosage information card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-18 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-28 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Administration schedule card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-52 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - Status and quick actions */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>

          {/* Student information card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-28 animate-pulse"></div>
            </div>
          </div>

          {/* Recent activity card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-gray-200 rounded-full mt-2 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
