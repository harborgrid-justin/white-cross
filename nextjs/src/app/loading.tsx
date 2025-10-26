/**
 * Global Loading UI
 *
 * Displays a loading spinner while pages are loading.
 * This is shown automatically by Next.js during navigation and data fetching.
 *
 * This is a Server Component by default.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
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
