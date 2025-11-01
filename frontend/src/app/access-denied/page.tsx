'use client';

/**
 * @fileoverview Access Denied Page - Authorization Error Handler
 *
 * This page is displayed when a user attempts to access a resource or perform an action
 * they are not authorized for based on their role, permissions, or authentication status.
 * It implements RBAC (Role-Based Access Control) error messaging with clear user guidance
 * and HIPAA-compliant security practices.
 *
 * @module app/(auth)/access-denied/page
 * @category Authentication
 * @subcategory Authorization
 *
 * @route /access-denied - Authorization error page
 *
 * @requires next/navigation
 * @requires @/contexts/AuthContext
 *
 * @security
 * - Displays user role and email for verification without exposing PHI
 * - Does not log authorization failures with identifiable information
 * - Provides security-appropriate error messages without system details
 * - Implements proper RBAC feedback for healthcare access control
 * - Edge runtime for improved security and performance
 *
 * @compliance HIPAA
 * - No Protected Health Information (PHI) displayed or logged
 * - Authorization failures tracked in audit logs (server-side)
 * - User identification limited to email and role
 * - Complies with HIPAA Security Rule § 164.312(a)(1) - Access Control
 *
 * @example
 * ```tsx
 * // User is redirected to this page when:
 * // 1. Role doesn't have required permissions
 * router.push('/access-denied');
 *
 * // 2. Attempting to access restricted resource
 * if (!hasPermission(user.role, 'view:patients')) {
 *   redirect('/access-denied');
 * }
 *
 * // 3. Middleware blocks unauthorized access
 * // middleware.ts:
 * if (!authorized) {
 *   return NextResponse.redirect('/access-denied');
 * }
 * ```
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html | HIPAA Security Rule}
 * @see {@link useAuth} for authentication context
 *
 * @since 1.0.0
 */




import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Access Denied Page Component
 *
 * Renders a comprehensive authorization error page that:
 * - Clearly communicates why access was denied
 * - Shows current user information for verification
 * - Provides actionable next steps (go back, go home, contact admin)
 * - Maintains security best practices by not exposing system details
 * - Implements accessible error messaging with proper ARIA attributes
 *
 * **User Experience Flow:**
 * 1. User attempts unauthorized action → server/middleware blocks request
 * 2. User redirected to /access-denied page
 * 3. Page displays error with current role/email for context
 * 4. User can go back, return home, or contact administrator
 *
 * **Error Scenarios Handled:**
 * - Insufficient role permissions (e.g., nurse trying to access admin panel)
 * - Resource-specific restrictions (e.g., viewing another school's data)
 * - Recently updated permissions (role changed but session not refreshed)
 * - Temporary access restrictions during maintenance
 *
 * **Security Design:**
 * - Does not expose specific permission names or system structure
 * - Uses generic error messages to prevent information disclosure
 * - Shows only non-sensitive user attributes (email, role name)
 * - No logging of PHI or detailed authorization context on client
 *
 * @returns {JSX.Element} The access denied page with user context and navigation options
 *
 * @example
 * ```tsx
 * // This page is rendered when:
 * // App router automatically navigates based on authorization checks
 * <AccessDeniedPage />
 * ```
 *
 * @example
 * ```tsx
 * // Example authorization check in a protected route:
 * // app/admin/page.tsx
 * export default function AdminPage() {
 *   const { user } = useAuth();
 *
 *   if (user?.role !== 'admin') {
 *     redirect('/access-denied'); // Navigates to this page
 *   }
 *
 *   return <AdminDashboard />;
 * }
 * ```
 *
 * @remarks
 * This is a Next.js Client Component ('use client') because it:
 * - Accesses router for navigation (useRouter)
 * - Reads authentication context (useAuth)
 * - Handles interactive button clicks
 *
 * The edge runtime is used for faster response times and reduced latency,
 * which is important for security-related error pages.
 *
 * @see {@link useAuth} - Authentication context hook providing user state
 * @see {@link useRouter} - Next.js router for navigation
 */
export default function AccessDeniedPage() {
  const router = useRouter();
  const { user } = useAuth();

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

          {/* User Info */}
          {user && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <h2 className="text-sm font-medium text-gray-900 mb-2">Current User Information</h2>
              <dl className="text-sm text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <dt className="font-medium">Email:</dt>
                  <dd>{user.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Role:</dt>
                  <dd>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          )}

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
