/**
 * Invoice List Loading State
 * 
 * Provides a skeleton UI while invoice data is being fetched.
 * Mimics the structure of the invoice list for better UX.
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function InvoicesLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header Skeleton */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 min-h-0">
        <div className="h-full rounded-lg border">
          <div className="p-6 h-full flex flex-col">
            <div className="space-y-4 flex-1">
              {/* Invoice Card Skeletons */}
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <Skeleton className="h-6 w-20 mb-2" />
                        <div className="flex flex-col gap-2">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
