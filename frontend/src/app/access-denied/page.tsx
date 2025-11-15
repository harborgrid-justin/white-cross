/**
 * @fileoverview Access Denied Page - Authorization Error Handler
 *
 * This page is displayed when a user attempts to access a resource or perform an action
 * they are not authorized for based on their role, permissions, or authentication status.
 * It implements RBAC (Role-Based Access Control) error messaging with clear user guidance
 * and HIPAA-compliant security practices.
 *
 * @module app/access-denied/page
 * @category Authentication
 * @subcategory Authorization
 *
 * @route /access-denied - Authorization error page
 *
 * @requires next/navigation
 *
 * @security
 * - Displays generic error messaging without exposing system details
 * - Does not log authorization failures with identifiable information
 * - Provides security-appropriate error messages without PHI exposure
 * - Implements proper RBAC feedback for healthcare access control
 *
 * @compliance HIPAA
 * - No Protected Health Information (PHI) displayed or logged
 * - Authorization failures tracked in audit logs (server-side via middleware)
 * - Complies with HIPAA Security Rule § 164.312(a)(1) - Access Control
 *
 * @example
 * ```tsx
 * // User is redirected to this page when:
 * // 1. Middleware blocks unauthorized access
 * // middleware.ts:
 * if (!authorized) {
 *   return NextResponse.redirect('/access-denied');
 * }
 * ```
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html | HIPAA Security Rule}
 *
 * @since 1.0.0
 */

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Access Denied Page Component
 *
 * Renders a comprehensive authorization error page that:
 * - Clearly communicates why access was denied
 * - Provides actionable next steps (go back, go home, contact admin)
 * - Maintains security best practices by not exposing system details
 * - Implements accessible error messaging with proper ARIA attributes
 *
 * **User Experience Flow:**
 * 1. User attempts unauthorized action → middleware blocks request
 * 2. User redirected to /access-denied page
 * 3. Page displays generic error message
 * 4. User can go back, return home, or contact administrator
 *
 * **Error Scenarios Handled:**
 * - Insufficient role permissions (handled by middleware)
 * - Resource-specific restrictions (handled by middleware)
 * - Authentication failures (handled by middleware)
 *
 * **Security Design:**
 * - Does not expose specific permission names or system structure
 * - Uses generic error messages to prevent information disclosure
 * - No client-side user context to prevent information leakage
 * - No logging of PHI or detailed authorization context on client
 *
 * @returns {JSX.Element} The access denied page with navigation options
 *
 * @remarks
 * This is a Next.js Client Component ('use client') because it:
 * - Accesses router for navigation (useRouter)
 * - Handles interactive button clicks
 *
 * @see {@link useRouter} - Next.js router for navigation
 */
export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white shadow-lg rounded-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="w-16 h-16 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Access Denied
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-6">
            You don't have permission to access this resource. This may be because:
          </p>

          {/* Reasons List */}
          <ul className="text-sm text-gray-600 mb-6 space-y-2" role="list">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Your role doesn't have the required permissions</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>The resource is restricted to specific user groups</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Your account privileges have been updated</span>
            </li>
          </ul>



          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="button"
            >
              Go Back
            </button>

            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Homepage
            </Link>
          </div>

          {/* Help */}
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400" role="note">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Need Access?</strong> Contact your school or district administrator to request additional permissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
