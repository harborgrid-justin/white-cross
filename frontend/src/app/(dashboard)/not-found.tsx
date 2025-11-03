import { Search, Home, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header for Context */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              White Cross Healthcare
            </h1>
          </div>
        </div>
      </div>

      {/* Main 404 Content */}
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <Search className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
            <h1 className="text-6xl font-extrabold text-gray-900 mb-2">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              The dashboard page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
          </div>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Helpful Information */}
            <div className="rounded-md bg-blue-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Available Dashboard Sections
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Students Management</li>
                      <li>Health Records</li>
                      <li>Medications</li>
                      <li>Appointments</li>
                      <li>Incidents</li>
                      <li>Reports & Analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Go to Dashboard Home
              </Link>

              <Link
                href="/students"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                Students Management
              </Link>

              <Link
                href="/health-records"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                Health Records
              </Link>

              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Back
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-6 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm text-gray-600">
                If you believe this page should exist, please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}