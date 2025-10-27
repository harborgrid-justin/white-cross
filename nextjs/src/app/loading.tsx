/**
 * @fileoverview Root Loading State Component
 *
 * Global loading UI that displays while pages are loading during navigation or data fetching.
 * Next.js automatically shows this component inside a Suspense boundary when pages are
 * streaming. Provides a consistent loading experience across the entire application.
 *
 * @module app/loading
 * @category Loading States
 * @subcategory Global
 *
 * **Loading Hierarchy:**
 * ```
 * loading.tsx (this file - shown for all routes without specific loading states)
 * ├── (dashboard)/medications/loading.tsx (medications-specific skeleton)
 * ├── (dashboard)/students/loading.tsx (students-specific skeleton)
 * └── [Other feature loading states...]
 * ```
 *
 * **When This Displays:**
 * - Navigation to a new route
 * - Initial page load with async data
 * - Streaming SSR content
 * - Any Suspense boundary without a closer loading.tsx file
 *
 * **Next.js Streaming:**
 * - Automatically wrapped in React Suspense boundary
 * - Shows while page component is rendering
 * - Replaced by actual page content once ready
 * - Enables streaming Server Side Rendering (SSR)
 *
 * **Accessibility:**
 * - Spinning animation indicates loading state
 * - Text label announces loading to screen readers
 * - High contrast for visibility
 * - Centered for focus
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/loading | Next.js Loading UI}
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming | Loading and Streaming}
 *
 * @example
 * ```tsx
 * // Next.js automatically uses this loading state:
 * // When user navigates to a route:
 * router.push('/medications');
 * // Displays: <Loading /> until MedicationsPage is ready
 * ```
 *
 * @returns {JSX.Element} Centered loading spinner with text
 *
 * @since 1.0.0
 */

/**
 * Root Loading Component
 *
 * Displays a centered loading spinner with descriptive text. Uses Tailwind CSS
 * animations for smooth spinner rotation. This is a Server Component that renders
 * synchronously with no client-side JavaScript required.
 *
 * **Visual Design:**
 * - Full-screen light gray background
 * - Centered content (flexbox)
 * - Animated spinner (4px border, 64px size)
 * - Primary brand color (border-t-primary-600)
 * - Smooth spin animation (CSS)
 * - Loading text below spinner
 * - Descriptive subtext
 *
 * **Performance:**
 * - Lightweight, no JS required
 * - CSS-only animation
 * - Fast render time
 * - Minimal layout shift
 *
 * @returns {JSX.Element} Full-screen loading UI
 *
 * @example
 * ```tsx
 * // The rendered structure:
 * <div className="min-h-screen">
 *   <div className="text-center">
 *     <div className="spinner" />
 *     <h2>Loading...</h2>
 *     <p>Please wait while we load your content</p>
 *   </div>
 * </div>
 * ```
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-primary-600 mb-4"></div>

        {/* Loading Text */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Loading...
        </h2>
        <p className="text-sm text-gray-600">
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
}
