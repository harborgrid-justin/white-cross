'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

interface AuthExampleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthExampleError({ error, reset }: AuthExampleErrorProps) {
  useEffect(() => {
    console.error('Auth example error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <Shield className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Example Error
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Something went wrong with the authentication demonstration
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Demo Page Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {process.env.NODE_ENV === 'development' ? (
                    <p>{error.message}</p>
                  ) : (
                    <p>The authentication example page encountered an error.</p>
                  )}
                  {error.digest && (
                    <p className="mt-1 text-xs text-red-600">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Retry Demo
            </button>

            <Link
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}