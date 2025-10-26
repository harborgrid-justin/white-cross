/**
 * Dashboard Loading State - Next.js
 * Displayed while dashboard page is loading
 */

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded"></div>
              <div className="ml-4 flex-1 space-y-2">
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="ml-4 flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status Skeleton */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-5 w-5 bg-gray-200 rounded"></div>
          <div className="ml-3 flex-1 space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
            <div className="h-3 w-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
