/**
 * @fileoverview Chart Loading Skeleton
 * @module components/ui/charts/ChartSkeleton
 *
 * Loading skeleton for Recharts components to improve perceived performance.
 */

interface ChartSkeletonProps {
  /** Chart type for customized skeleton */
  type?: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'stacked';
  /** Height of the skeleton */
  height?: number;
  /** Show title skeleton */
  showTitle?: boolean;
  /** Show legend skeleton */
  showLegend?: boolean;
}

export default function ChartSkeleton({
  type = 'line',
  height = 300,
  showTitle = true,
  showLegend = true,
}: ChartSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {/* Title */}
      {showTitle && (
        <div className="mb-4">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
        </div>
      )}

      {/* Chart Area */}
      <div
        className="flex items-end justify-between rounded-lg border border-gray-200 bg-white p-6"
        style={{ height: `${height}px` }}
      >
        {type === 'pie' || type === 'donut' ? (
          /* Pie/Donut Chart Skeleton */
          <div className="mx-auto flex h-full w-full items-center justify-center">
            <div className="h-48 w-48 rounded-full bg-gray-200"></div>
          </div>
        ) : (
          /* Bar/Line/Area Chart Skeleton */
          <>
            {/* Y-axis */}
            <div className="flex h-full flex-col justify-between py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 w-8 rounded bg-gray-200"></div>
              ))}
            </div>

            {/* Chart bars/lines */}
            <div className="flex h-full flex-1 items-end justify-around gap-4 px-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-full rounded-t bg-gray-200 ${
                    type === 'line' || type === 'area'
                      ? 'h-full'
                      : `h-${Math.floor(Math.random() * 80) + 20}%`
                  }`}
                  style={{
                    height:
                      type === 'line' || type === 'area'
                        ? '100%'
                        : `${Math.floor(Math.random() * 60) + 40}%`,
                  }}
                ></div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* X-axis labels */}
      {(type === 'line' || type === 'bar' || type === 'area' || type === 'stacked') && (
        <div className="mt-2 flex justify-around px-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 w-12 rounded bg-gray-200"></div>
          ))}
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex justify-center gap-6">
          {Array.from({ length: type === 'pie' || type === 'donut' ? 4 : 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-200"></div>
              <div className="h-4 w-16 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      )}

      {/* Loading hint */}
      <div className="mt-2 text-center text-xs text-gray-400">Loading chart data...</div>
    </div>
  );
}
