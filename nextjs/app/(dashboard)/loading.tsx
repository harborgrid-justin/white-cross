/**
 * Dashboard Loading State
 *
 * Displayed while dashboard pages are loading.
 * This provides instant feedback during page transitions.
 */

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>

        {/* Content skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
