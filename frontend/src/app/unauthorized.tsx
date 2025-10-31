'use client';

/**
 * @fileoverview Root 401 Unauthorized Page
 *
 * Custom unauthorized page displayed when users attempt to access protected resources
 * without proper authentication. This page provides clear messaging about authentication
 * requirements and guides users to sign in or return to accessible areas.
 *
 * @module app/unauthorized
 * @category Error Pages
 * @subcategory 401 Unauthorized
 *
 * **When This Displays:**
 * - User attempts to access protected route without authentication
 * - Session token has expired or is invalid
 * - Programmatic redirect to /unauthorized route
 * - API returns 401 status and redirects
 *
 * **Unauthorized vs Forbidden:**
 * - **401 Unauthorized (this page)**: User is not authenticated (not logged in)
 * - **403 Forbidden**: User is authenticated but lacks required permissions
 *
 * **Key Features:**
 * - Clear authentication status messaging
 * - Sign-in call-to-action button
 * - Navigation options to public areas
 * - HIPAA-compliant (no sensitive data exposure)
 * - Healthcare-themed styling
 * - Client component for navigation handling
 *
 * **Navigation Options:**
 * 1. Primary: Sign In (authentication flow)
 * 2. Secondary: Return to Home (public homepage)
 * 3. Tertiary: Contact Support
 *
 * **Security Considerations:**
 * - Does not expose system architecture
 * - Does not reveal which resources exist
 * - Provides generic messaging for security
 * - Maintains HIPAA compliance
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Keyboard-accessible buttons and links
 * - Screen reader compatible
 * - High-contrast warning indicator
 *
 * @requires Client Component - Uses navigation and interactive elements
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling | Next.js Error Handling}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401 | HTTP 401 Status}
 *
 * @example
 * ```tsx
 * // Redirect to unauthorized page:
 * import { redirect } from 'next/navigation';
 *
 * export default async function ProtectedPage() {
 *   const session = await getSession();
 *   if (!session) {
 *     redirect('/unauthorized');
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Middleware redirect:
 * export function middleware(request: NextRequest) {
 *   const token = request.cookies.get('auth-token');
 *   if (!token) {
 *     return NextResponse.redirect(new URL('/unauthorized', request.url));
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
 * Metadata configuration for the 401 Unauthorized page.
 *
 * Provides SEO-optimized metadata while maintaining security by not exposing
 * sensitive system information.
 *
 * @constant
 * @type {Metadata}
 *
 * @property {string} title - Page title for browser tab and SEO
 * @property {string} description - Meta description for search engines
 */
export const metadata: Metadata = {
  title: '401 - Unauthorized | White Cross Healthcare',
  description: 'Authentication required to access this resource.',
};

/**
 * Unauthorized Page Component
 *
 * Displays a centered card with clear authentication messaging and sign-in call-to-action.
 * Uses warning colors (orange) to indicate authentication requirement without being
 * alarming like error red.
 *
 * **Visual Design:**
 * - Centered card layout (max-w-md)
 * - Orange warning icon (not threatening red)
 * - "401" status code display
 * - Clear heading and description
 * - Prominent sign-in button
 * - Secondary navigation options
 *
 * **User Flow:**
 * 1. User attempts to access protected resource
 * 2. Lands on this unauthorized page
 * 3. Sees clear message about authentication need
 * 4. Primary action: Sign in
 * 5. Alternative: Return to public areas
 *
 * **Security Features:**
 * - Generic messaging (doesn't reveal system details)
 * - No indication of valid/invalid resources
 * - HIPAA-compliant error handling
 * - No sensitive data in UI
 *
 * @returns {JSX.Element} Centered unauthorized page with authentication CTA
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="centered-container">
 *   <div className="card">
 *     <div className="orange-icon">🔒</div>
 *     <h1>401</h1>
 *     <h2>Authentication Required</h2>
 *     <p>You must be signed in to access this resource</p>
 *     <button>Sign In</button>
 *     <Link href="/">Return to Home</Link>
 *     <Link href="/support">Contact Support</Link>
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Client Component (requires 'use client' directive) because it uses:
 * - `useRouter` hook for navigation
 * - `onClick` handlers for sign-in action
 * - Interactive button elements
 */
export default function Unauthorized() {
  const router = useRouter();

  /**
   * Handles sign-in navigation.
   * Redirects user to authentication flow (sign-in page).
   *
   * @function
   */
  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Unauthorized Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
            <svg
              className="h-8 w-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Status Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-2">401</h1>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Authentication Required
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            You must be signed in to access this resource. Please authenticate to continue.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full healthcare-button-primary"
            >
              Sign In
            </button>

            <Link
              href="/"
              className="block w-full healthcare-button-secondary text-center"
            >
              Return to Home
            </Link>

            <Link
              href="/support"
              className="block w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              If you believe you should have access to this resource, please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
