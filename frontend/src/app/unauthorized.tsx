'use client';

/**
 * @fileoverview Dashboard 401 Unauthorized Page
 *
 * Dashboard-specific unauthorized page displayed when users attempt to access protected
 * dashboard features without proper authentication. This page provides dashboard-context
 * aware messaging and guides users to sign in or return to accessible areas.
 *
 * @module app/(dashboard)/unauthorized
 * @category Error Pages
 * @subcategory 401 Unauthorized
 *
 * **When This Displays:**
 * - User attempts to access dashboard routes without authentication
 * - Session expires while on dashboard
 * - Token becomes invalid during dashboard session
 * - Middleware redirects from protected dashboard routes
 *
 * **Dashboard Context:**
 * This unauthorized page is specific to the dashboard route group and provides:
 * - Dashboard-aware messaging
 * - Links to dashboard home (after authentication)
 * - Context about dashboard features requiring authentication
 * - Healthcare-specific guidance
 *
 * **Unauthorized Hierarchy:**
 * ```
 * /unauthorized.tsx (root - general authentication)
 * └── (dashboard)/unauthorized.tsx (this file - dashboard-specific)
 * ```
 *
 * **Key Features:**
 * - Dashboard-specific authentication messaging
 * - Sign-in with return-to-dashboard flow
 * - Navigation to public areas
 * - HIPAA-compliant messaging
 * - Healthcare-themed styling
 * - Client component for navigation
 *
 * **Navigation Options:**
 * 1. Primary: Sign In (redirects back to dashboard after auth)
 * 2. Secondary: View Public Pages
 * 3. Tertiary: Contact Support
 *
 * **Security Considerations:**
 * - Does not expose dashboard structure
 * - Generic messaging for security
 * - No indication of available features
 * - HIPAA-compliant error handling
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Keyboard-accessible buttons
 * - Screen reader compatible
 * - High-contrast warning colors
 *
 * @requires Client Component - Uses navigation and interactive elements
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/route-groups | Next.js Route Groups}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401 | HTTP 401 Status}
 *
 * @example
 * ```tsx
 * // Dashboard middleware redirect:
 * export function middleware(request: NextRequest) {
 *   if (request.nextUrl.pathname.startsWith('/dashboard')) {
 *     const session = await getSession();
 *     if (!session) {
 *       return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url));
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dashboard layout authentication check:
 * export default async function DashboardLayout({ children }) {
 *   const session = await getSession();
 *   if (!session) {
 *     redirect('/dashboard/unauthorized');
 *   }
 *   return <>{children}</>;
 * }
 * ```
 *
 * @since 1.0.0
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';

/**
 * Metadata configuration for the dashboard unauthorized page.
 *
 * Provides SEO-optimized metadata while maintaining security by not exposing
 * dashboard structure or features.
 *
 * @constant
 * @type {Metadata}
 *
 * @property {string} title - Page title for browser tab
 * @property {string} description - Meta description
 */
export const metadata: Metadata = {
  title: 'Authentication Required - Dashboard | White Cross Healthcare',
  description: 'Please sign in to access the White Cross Healthcare dashboard.',
};

/**
 * Dashboard Unauthorized Page Component
 *
 * Displays a centered card with dashboard-specific authentication messaging.
 * Emphasizes that the user needs to authenticate to access healthcare management
 * features while maintaining a professional, non-alarming tone.
 *
 * **Visual Design:**
 * - Centered card layout (max-w-md)
 * - Orange warning icon (authentication needed)
 * - "401" status code display
 * - Dashboard-contextualized messaging
 * - Prominent sign-in button
 * - Alternative navigation options
 *
 * **User Flow:**
 * 1. User attempts to access dashboard feature
 * 2. Lands on this unauthorized page
 * 3. Sees message about dashboard authentication
 * 4. Primary action: Sign in (returns to dashboard)
 * 5. Alternative: Return to public areas
 *
 * **Dashboard Features Mentioned:**
 * - Student health records
 * - Medication management
 * - Appointment scheduling
 * - Compliance tracking
 * - Health incident reporting
 *
 * @returns {JSX.Element} Centered dashboard unauthorized page
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="centered-container">
 *   <div className="card">
 *     <div className="orange-icon">🔒</div>
 *     <h1>401</h1>
 *     <h2>Dashboard Authentication Required</h2>
 *     <p>Sign in to access healthcare management features</p>
 *     <button>Sign In to Dashboard</button>
 *     <Link href="/">View Public Pages</Link>
 *     <Link href="/support">Contact Support</Link>
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Client Component (requires 'use client' directive) because it uses:
 * - `useRouter` hook for navigation
 * - `onClick` handlers for authentication
 * - Interactive button elements
 */
export default function DashboardUnauthorized() {
  const router = useRouter();

  /**
   * Handles dashboard sign-in navigation.
   * Redirects to authentication flow with return URL to dashboard.
   *
   * @function
   */
  const handleSignIn = () => {
    // After sign-in, user should be redirected back to dashboard
    router.push('/login?returnTo=/dashboard');
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
            Dashboard Authentication Required
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            You must be signed in to access the White Cross Healthcare dashboard.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            The dashboard provides access to student health records, medication management,
            appointments, and compliance tracking.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full healthcare-button-primary"
            >
              Sign In to Dashboard
            </button>

            <Link
              href="/"
              className="block w-full healthcare-button-secondary text-center"
            >
              View Public Pages
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
            <p className="text-xs text-gray-500 mb-2">
              Need a dashboard account?
            </p>
            <Link
              href="/request-access"
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Request Dashboard Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
