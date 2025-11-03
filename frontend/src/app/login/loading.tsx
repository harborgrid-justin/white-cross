import { Loader2 } from 'lucide-react';

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Skeleton */}
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" aria-hidden="true" />
          <p className="text-sm text-gray-600" role="status" aria-live="polite">
            Loading login page...
          </p>
        </div>

        {/* Form Skeleton */}
        <div className="mt-8 space-y-6 animate-pulse">
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Field Skeleton */}
            <div className="h-10 bg-gray-200 rounded-t-md"></div>
            {/* Password Field Skeleton */}
            <div className="h-10 bg-gray-200 rounded-b-md"></div>
          </div>

          {/* Remember Me and Forgot Password Skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="ml-2 h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="h-10 bg-gray-200 rounded-md"></div>

          {/* OAuth Buttons Skeleton */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-gray-200 rounded-md"></div>
            <div className="h-10 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Help Text Skeleton */}
        <div className="text-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}