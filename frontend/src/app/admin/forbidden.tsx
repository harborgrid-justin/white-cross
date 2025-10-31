'use client';

/**
 * @fileoverview Admin 403 Forbidden Page
 *
 * Admin-specific forbidden page displayed when users attempt to access administrative
 * features without proper admin-level permissions. This page provides admin-context
 * aware messaging and emphasizes the high-security nature of admin resources.
 *
 * @module app/admin/forbidden
 * @category Error Pages
 * @subcategory 403 Forbidden
 *
 * **When This Displays:**
 * - Non-admin user attempts to access admin routes
 * - User has insufficient admin privileges
 * - Admin role verification fails
 * - Middleware redirects from protected admin routes
 *
 * **Admin Context:**
 * This forbidden page is specific to the admin section and provides:
 * - Admin-specific messaging
 * - Security-focused language
 * - Links to request admin access
 * - Emphasis on privilege requirements
 * - HIPAA compliance messaging
 *
 * **Forbidden Hierarchy:**
 * ```
 * /forbidden.tsx (root - general permission denial)
 * └── admin/forbidden.tsx (this file - admin-specific)
 * ```
 *
 * **Key Features:**
 * - Admin-specific permission messaging
 * - Request admin access flow
 * - Security and compliance emphasis
 * - HIPAA-compliant messaging
 * - Healthcare-themed styling
 * - Client component for navigation
 *
 * **Navigation Options:**
 * 1. Primary: Request Admin Access
 * 2. Secondary: Go to Dashboard (non-admin area)
 * 3. Tertiary: Contact Administrator
 *
 * **Security Considerations:**
 * - Does not expose admin feature structure
 * - Emphasizes security and compliance
 * - Generic messaging for security
 * - No indication of admin capabilities
 * - HIPAA-compliant error handling
 *
 * **Admin Features Protected:**
 * - System configuration
 * - User management
 * - Security settings
 * - Compliance monitoring
 * - Audit logs and reporting
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Keyboard-accessible buttons
 * - Screen reader compatible
 * - High-contrast restriction colors
 *
 * @requires Client Component - Uses navigation and interactive elements
 *
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/error-handling | Next.js Error Handling}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 | HTTP 403 Status}
 *
 * @example
 * ```tsx
 * // Admin middleware check:
 * export function middleware(request: NextRequest) {
 *   if (request.nextUrl.pathname.startsWith('/admin')) {
 *     const user = await getUser();
 *     if (!user.isAdmin) {
 *       return NextResponse.redirect(new URL('/admin/forbidden', request.url));
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Admin layout permission check:
 * export default async function AdminLayout({ children }) {
 *   const user = await getUser();
 *   if (!user.hasRole('admin')) {
 *     redirect('/admin/forbidden');
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
 * Metadata configuration for the admin forbidden page.
 *
 * Provides SEO-optimized metadata while maintaining security by not exposing
 * admin structure or capabilities.
 *
 * @constant
 * @type {Metadata}
 *
 * @property {string} title - Page title for browser tab
 * @property {string} description - Meta description
 */
export const metadata: Metadata = {
  title: 'Admin Access Required | White Cross Healthcare',
  description: 'Administrative privileges required to access this resource.',
};

/**
 * Admin Forbidden Page Component
 *
 * Displays a centered card with admin-specific permission messaging. Emphasizes
 * the high-security nature of admin features and provides clear guidance on
 * requesting admin access through proper channels.
 *
 * **Visual Design:**
 * - Centered card layout (max-w-md)
 * - Red restriction icon (admin access required)
 * - "403" status code display
 * - Admin-contextualized messaging
 * - Security badge/indicator
 * - Request admin access button
 * - Alternative navigation options
 *
 * **User Flow:**
 * 1. User attempts to access admin feature
 * 2. Lands on this forbidden page
 * 3. Sees message about admin privilege requirement
 * 4. Primary action: Request admin access
 * 5. Alternative: Return to non-admin areas
 *
 * **Admin Privileges Context:**
 * - User IS authenticated (logged in)
 * - User LACKS admin role/permissions
 * - Emphasizes security and compliance
 * - Provides formal request process
 *
 * @returns {JSX.Element} Centered admin forbidden page
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="centered-container">
 *   <div className="card">
 *     <div className="red-icon">🔐</div>
 *     <div className="security-badge">ADMIN ACCESS REQUIRED</div>
 *     <h1>403</h1>
 *     <h2>Administrative Privileges Required</h2>
 *     <p>Admin access needed for this resource</p>
 *     <button>Request Admin Access</button>
 *     <Link href="/dashboard">Go to Dashboard</Link>
 *     <Link href="/support">Contact Administrator</Link>
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Client Component (requires 'use client' directive) because it uses:
 * - `useRouter` hook for navigation
 * - `onClick` handlers for access request
 * - Interactive button elements
 */
export default function AdminForbidden() {
  const router = useRouter();

  /**
   * Handles admin access request navigation.
   * Redirects to admin access request form or escalation flow.
   *
   * @function
   */
  const handleRequestAdminAccess = () => {
    router.push('/request-admin-access');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          {/* Admin Security Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              ADMIN ACCESS REQUIRED
            </span>
          </div>

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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          {/* Status Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Administrative Privileges Required
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            You need administrative privileges to access this section of White Cross Healthcare.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Admin access includes system configuration, user management, security settings,
            and compliance monitoring.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRequestAdminAccess}
              className="w-full healthcare-button-primary"
            >
              Request Admin Access
            </button>

            <Link
              href="/dashboard"
              className="block w-full healthcare-button-secondary text-center"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/support"
              className="block w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Administrator
            </Link>
          </div>

          {/* Security Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2 font-semibold">
              Security & Compliance
            </p>
            <p className="text-xs text-gray-500">
              Administrative access is restricted to authorized personnel only.
              All admin actions are logged for HIPAA compliance and audit purposes.
            </p>
          </div>

          {/* Admin Privileges Info */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">
              Admin privileges typically include:
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• System configuration and settings</li>
              <li>• User and role management</li>
              <li>• Security and access controls</li>
              <li>• Compliance monitoring and reporting</li>
              <li>• Audit log access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
