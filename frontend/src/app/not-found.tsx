/**
 * @fileoverview Global 404 Not Found Page
 *
 * Custom 404 error page displayed when users navigate to non-existent routes in the
 * White Cross Healthcare Platform. Provides a user-friendly fallback UI with helpful
 * navigation options and quick links to main application sections.
 *
 * @module app/not-found
 * @category Error Pages
 * @subcategory 404 Not Found
 *
 * **When This Displays:**
 * - User navigates to undefined route (e.g., /nonexistent-page)
 * - Programmatic call to `notFound()` function
 * - No matching page.tsx in route segments
 * - Dynamic route segment doesn't match any data
 *
 * **Not Found Hierarchy:**
 * ```
 * not-found.tsx (this file - catches all undefined routes)
 * └── students/not-found.tsx (student-specific 404)
 * ```
 *
 * **Key Features:**
 * - Custom 404 page (not browser default)
 * - Friendly error icon and messaging
 * - Multiple navigation recovery options
 * - Quick links to common sections
 * - SEO-optimized metadata
 * - Maintains application styling
 *
 * **Navigation Options:**
 * 1. Primary: Go to Dashboard (main app entry)
 * 2. Secondary: Return to Home (public homepage)
 * 3. Quick Links: Students, Medications, Appointments, Health Records
 *
 * **SEO Considerations:**
 * - Returns 404 HTTP status code
 * - Includes proper metadata (title, description)
 * - Helps search engines understand missing pages
 * - Provides sitemap-like navigation
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear visual hierarchy
 * - Keyboard-accessible links
 * - Screen reader compatible
 * - High-contrast error indicator
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/not-found | Next.js Not Found}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/not-found | notFound() Function}
 *
 * @example
 * ```tsx
 * // Automatically displayed for undefined routes:
 * // User navigates to: /some-invalid-route
 * // Next.js renders: <NotFound />
 * ```
 *
 * @example
 * ```tsx
 * // Programmatic usage:
 * import { notFound } from 'next/navigation';
 *
 * export default async function StudentPage({ params }) {
 *   const student = await getStudent(params.id);
 *   if (!student) {
 *     notFound(); // Triggers this not-found.tsx component
 *   }
 * }
 * ```
 *
 * @returns {JSX.Element} 404 page with recovery navigation
 *
 * @since 1.0.0
 */

import Link from 'next/link';
import { Metadata } from 'next';

/**
 * Metadata configuration for the 404 Not Found page.
 *
 * Provides SEO-optimized metadata to help search engines understand that this is
 * a legitimate 404 page, not broken content.
 *
 * @constant
 * @type {Metadata}
 *
 * @property {string} title - Page title for browser tab and SEO
 * @property {string} description - Meta description for search engines
 */
export const metadata: Metadata = {
  title: '404 - Page Not Found | White Cross Healthcare',
  description: 'The page you are looking for could not be found.',
};

/**
 * Not Found Page Component
 *
 * Displays a centered card with a friendly 404 error message and multiple navigation
 * options to help users recover and return to the application. Uses a playful icon
 * and clear calls-to-action.
 *
 * **Visual Design:**
 * - Centered card layout (max-w-md)
 * - Blue circular icon (not threatening red)
 * - Large "404" display
 * - Clear heading and description
 * - Stacked action buttons
 * - Horizontal quick links with separators
 *
 * **Recovery Flow:**
 * 1. User lands on 404 page
 * 2. Sees friendly message (not alarming)
 * 3. Chooses primary action (Dashboard) or secondary (Home)
 * 4. Or uses quick links to common sections
 *
 * **User Experience:**
 * - Non-threatening blue color (not red)
 * - Friendly icon (smiling face)
 * - Multiple escape routes
 * - Quick links to likely destinations
 * - Maintains app branding and style
 *
 * @returns {JSX.Element} Centered 404 error page
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="centered-container">
 *   <div className="card">
 *     <div className="icon">😊</div>
 *     <h1>404</h1>
 *     <h2>Page Not Found</h2>
 *     <p>Page doesn't exist or has been moved</p>
 *     <Link href="/dashboard">Go to Dashboard</Link>
 *     <Link href="/">Return to Home</Link>
 *     <div className="quick-links">
 *       <Link>Students</Link>
 *       <Link>Medications</Link>
 *       // etc.
 *     </div>
 *   </div>
 * </div>
 * ```
 *
 * @remarks
 * This is a Server Component. It renders synchronously without client-side JavaScript.
 * All navigation is handled by Next.js Link components with standard navigation.
 */
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
