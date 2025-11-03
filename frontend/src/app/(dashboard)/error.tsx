'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, LogOut } from 'lucide-react';
import Link from 'next/link';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Dashboard Error
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Something went wrong with the dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Error Details */}
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Application Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {process.env.NODE_ENV === 'development' ? (
                    <div>
                      <p className="font-medium">Error: {error.name}</p>
                      <p className="mt-1">{error.message}</p>
                      {error.stack && (
                        <pre className="mt-2 text-xs overflow-x-auto">
                          {error.stack.substring(0, 500)}...
                        </pre>
                      )}
                    </div>
                  ) : (
                    <p>
                      We&apos;re experiencing technical difficulties. Our team has been notified.
                    </p>
                  )}
                  {error.digest && (
                    <p className="mt-2 text-xs text-red-600 font-mono">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Try Again
            </button>

            <Link
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Dashboard Home
            </Link>

            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
              Return to Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                If this problem persists, please contact support with the error ID above.
              </p>
              <div className="flex flex-col space-y-2 text-xs text-gray-500">
                <span>White Cross Healthcare Platform</span>
                <span>Technical Support: support@whitecross.healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}