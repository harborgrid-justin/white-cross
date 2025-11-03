import { Loader2, Shield } from 'lucide-react';

export default function AuthExampleLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Page Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="h-8 w-8 bg-gray-200 rounded mr-3"></div>
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 w-96 bg-gray-200 rounded"></div>
      </div>

      {/* Loading Content */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex items-center mb-6">
          <Shield className="h-8 w-8 text-blue-600 mr-3" aria-hidden="true" />
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Loading Authentication Example
        </h2>
        <p className="text-sm text-gray-600 text-center max-w-md" role="status" aria-live="polite">
          Preparing authentication demonstration and server action examples...
        </p>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}