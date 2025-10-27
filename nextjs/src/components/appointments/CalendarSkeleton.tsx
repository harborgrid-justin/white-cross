/**
 * @fileoverview Calendar Loading Skeleton
 * @module components/appointments/CalendarSkeleton
 *
 * Loading skeleton for FullCalendar component to improve perceived performance.
 */

export default function CalendarSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-4 shadow">
        <div className="h-8 w-32 rounded bg-gray-200"></div>
        <div className="flex gap-2">
          <div className="h-8 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-24 rounded bg-gray-200"></div>
          <div className="h-8 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="h-8 w-32 rounded bg-gray-200"></div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-lg bg-white p-4 shadow">
        {/* Day headers */}
        <div className="mb-2 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-gray-200"></div>
          ))}
        </div>

        {/* Time slots / Events */}
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-24 rounded border border-gray-100 bg-gray-50 p-2"
                >
                  {/* Random "events" */}
                  {Math.random() > 0.7 && (
                    <div
                      className={`h-16 rounded ${
                        Math.random() > 0.5 ? 'bg-blue-200' : 'bg-green-200'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Loading calendar...
      </div>
    </div>
  );
}
