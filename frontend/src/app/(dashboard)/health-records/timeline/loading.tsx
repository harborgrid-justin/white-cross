'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

/**
 * Health Records Timeline Loading State
 * 
 * Displays skeleton loading animation while timeline view is being loaded.
 * Matches the timeline layout with chronological health record entries.
 */
export default function LoadingHealthRecordsTimeline() {
  return (
    <div className="container mx-auto py-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Timeline Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Student Filter */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          {/* Date Range Filter */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-9 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-12 mb-2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Record Type Filter */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Stats */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-6" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-18" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline Content */}
        <div className="lg:col-span-3">
          {/* Timeline Controls */}
          <Card className="mb-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-9 w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Entries */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="relative flex items-start space-x-6">
                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>

                  {/* Timeline Entry Card */}
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-20 rounded-full" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4 mb-3" />
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>

                      {/* Additional Details (for some entries) */}
                      {i % 3 === 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Skeleton className="h-3 w-16 mb-1" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                            <div>
                              <Skeleton className="h-3 w-20 mb-1" />
                              <Skeleton className="h-4 w-28" />
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
