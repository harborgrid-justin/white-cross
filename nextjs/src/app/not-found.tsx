/**
 * Global 404 Not Found Page
 *
 * Displayed when a user navigates to a route that doesn't exist.
 * Provides helpful links to get back to the application.
 *
 * This is a Server Component by default.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */

import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | White Cross Healthcare',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* 404 Title */}
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>

          {/* Navigation Links */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full healthcare-button-primary text-center"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="block w-full healthcare-button-secondary text-center"
            >
              Return to Home
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/students"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Students
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/medications"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Medications
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/appointments"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Appointments
              </Link>
              <span className="text-gray-400">•</span>
              <Link
                href="/health-records"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Health Records
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
