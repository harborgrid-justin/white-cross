import { Search, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

export default function LoginNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
            <Search className="h-6 w-6 text-yellow-600" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-center text-6xl font-extrabold text-gray-900">
            404
          </h1>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-700">
            Page Not Found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            The login page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>

        {/* Information */}
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Search className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Login Page Not Found
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You may have followed an invalid link or the page may have been moved.
                  Please use the main login page to access your account.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Go to Login
          </Link>

          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="h-4 w-4 mr-2" aria-hidden="true" />
            Go Home
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}