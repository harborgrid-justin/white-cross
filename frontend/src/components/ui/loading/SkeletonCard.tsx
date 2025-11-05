/**
 * Skeleton Loading Card Component
 *
 * Provides skeleton loading states for cards
 *
 * @module components/ui/loading/SkeletonCard
 * @version 1.0.0
 */

"use client"

interface SkeletonCardProps {
  className?: string;
  rows?: number;
}

export function SkeletonCard({ className = '', rows = 3 }: SkeletonCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="mb-4 last:mb-0">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[1, 2, 3, 4].map((col) => (
                <th key={col} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {[1, 2, 3, 4].map((col) => (
                  <td key={col} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SkeletonList({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="ml-4 flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
