/**
 * @fileoverview Document Detail Loading UI
 * 
 * Loading skeleton for individual document detail pages. Provides immediate
 * visual feedback while document data is being fetched from the server.
 * 
 * This loading UI is shown during:
 * - Initial navigation to document detail page
 * - Server-side data fetching for document information
 * - Document content loading and preview generation
 * - Slow network conditions
 * 
 * @module app/(dashboard)/documents/[id]/loading
 */

export default function DocumentDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        {/* Back navigation skeleton */}
        <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
        
        {/* Document ID skeleton */}
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 bg-blue-200 rounded w-36 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-28 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Document viewer */}
        <div className="lg:col-span-3">
          {/* Document viewer card */}
          <div className="bg-white rounded-lg shadow">
            {/* Document viewer header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Document content skeleton */}
            <div className="p-6">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-12 w-12 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Document viewer footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Document metadata and actions */}
        <div className="space-y-6">
          {/* Document info card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-18 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-16 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>

          {/* Security & Compliance card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Related documents card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-36 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 border border-gray-200 rounded">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Document history card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-20 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-3 w-3 bg-gray-200 rounded-full mt-1 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
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
