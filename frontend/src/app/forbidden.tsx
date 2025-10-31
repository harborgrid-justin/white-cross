'use client';

/**
 * @fileoverview Root 403 Forbidden Page
 *
 * Custom forbidden page displayed when authenticated users attempt to access resources
 * they don't have permission to view. This page provides clear messaging about access
 * restrictions and guides users to request permissions or navigate to accessible areas.
 *
 * @module app/forbidden
 * @category Error Pages
 * @subcategory 403 Forbidden
 *
 * **When This Displays:**
 * - Authenticated user lacks required role/permissions
 * - User attempts to access restricted resources
 * - Programmatic redirect to /forbidden route
 * - API returns 403 status and redirects
 *
 * **Forbidden vs Unauthorized:**
 * - **401 Unauthorized**: User is not authenticated (not logged in)
 * - **403 Forbidden (this page)**: User is authenticated but lacks permissions
 *
 * **Key Features:**
 * - Clear permission/access messaging
 * - Request access call-to-action
 * - Navigation to accessible areas
 * - HIPAA-compliant (no sensitive data exposure)
 * - Healthcare-themed styling
 * - Client component for navigation
 *
 * **Navigation Options:**
 * 1. Primary: Request Access (contact admin)
 * 2. Secondary: Go to Dashboard (accessible area)
 * 3. Tertiary: Return to Home
 *
 * **Security Considerations:**
 * - Does not expose system architecture
 * - Does not reveal which features exist
 * - Generic messaging for security
 * - Maintains HIPAA compliance
 * - No indication of permission levels
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Keyboard-accessible buttons and links
 * - Screen reader compatible
 * - High-contrast restriction indicator
 *
 * @requires Client Component - Uses navigation and interactive elements
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling | Next.js Error Handling}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 | HTTP 403 Status}
 *
 * @example
 * ```tsx
 * // Redirect to forbidden page:
 * import { redirect } from 'next/navigation';
 *
 * export default async function AdminPage() {
 *   const user = await getUser();
 *   if (!user.isAdmin) {
 *     redirect('/forbidden');
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Middleware permission check:
 * export function middleware(request: NextRequest) {
 *   const user = await getUser(request);
 *   if (!hasPermission(user, 'admin')) {
 *     return NextResponse.redirect(new URL('/forbidden', request.url));
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

/**
 * Metadata configuration for the 403 Forbidden page.
 *
 * Provides SEO-optimized metadata while maintaining security by not exposing
 * permission structure or restricted features.
 *
 * @constant
 * @type {Metadata}
 *
 * @property {string} title - Page title for browser tab and SEO
 * @property {string} description - Meta description for search engines
 */
export const metadata: Metadata = {
  title: '403 - Forbidden | White Cross Healthcare',
  description: 'You do not have permission to access this resource.',
};

/**
 * Forbidden Page Component
 *
 * Displays a centered card with clear permission/access messaging. Uses red colors
 * to indicate restriction while maintaining a professional, helpful tone that
 * encourages users to request proper access if needed.
 *
 * **Visual Design:**
 * - Centered card layout (max-w-md)
 * - Red restriction icon (access denied)
 * - "403" status code display
 * - Clear heading and description
 * - Request access button
 * - Secondary navigation options
 *
 * **User Flow:**
 * 1. Authenticated user attempts to access restricted resource
 * 2. Lands on this forbidden page
 * 3. Sees clear message about permission requirement
 * 4. Primary action: Request access from admin
 * 5. Alternative: Navigate to accessible areas
 *
 * **Permission Context:**
 * - User IS authenticated (logged in)
 * - User LACKS required permissions/role
 * - Suggests contacting administrator
 * - Provides escape routes to accessible areas
 *
 * @returns {JSX.Element} Centered forbidden page with request access CTA
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="centered-container">
 *   <div className="card">
 *     <div className="red-icon">🚫</div>
 *     <h1>403</h1>
 *     <h2>Access Forbidden</h2>
 *     <p>You don't have permission to access this resource</p>
 *     <button>Request Access</button>
 *     <Link href="/dashboard">Go to Dashboard</Link>
 *     <Link href="/">Return to Home</Link>
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Client Component (requires 'use client' directive) because it uses:
 * - `useRouter` hook for navigation
 * - `onClick` handlers for request access action
 * - Interactive button elements
 */
export default function Forbidden() {
  const router = useRouter();

  /**
   * Handles request access navigation.
   * Redirects user to access request form or support page.
   *
   * @function
   */
  const handleRequestAccess = () => {
    router.push('/request-access');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Forbidden Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>

          {/* Status Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Access Forbidden
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            You don't have permission to access this resource.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            If you believe you should have access, please contact your administrator or request the necessary permissions.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRequestAccess}
              className="w-full healthcare-button-primary"
            >
              Request Access
            </button>

            <Link
              href="/dashboard"
              className="block w-full healthcare-button-secondary text-center"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="block w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Common reasons for access restrictions:
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Insufficient role or permission level</li>
              <li>• Feature requires specific credentials</li>
              <li>• HIPAA compliance restrictions</li>
              <li>• Administrative privileges needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
