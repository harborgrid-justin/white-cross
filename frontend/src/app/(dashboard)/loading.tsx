import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo Skeleton */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="ml-2 h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* User Menu Skeleton */}
            <div className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 bg-white border-r border-gray-200">
            {/* Navigation Skeleton */}
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="px-3 space-y-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center px-2 py-2 animate-pulse">
                    <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Page Title Skeleton */}
            <div className="mb-6 animate-pulse">
              <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded"></div>
            </div>

            {/* Content Loading */}
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" aria-hidden="true" />
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Loading Dashboard
              </h2>
              <p className="text-sm text-gray-600 text-center max-w-md" role="status" aria-live="polite">
                Please wait while we load your healthcare management dashboard...
              </p>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Table/List Skeleton */}
            <div className="bg-white rounded-lg shadow animate-pulse">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="p-6 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-gray-200 rounded"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}