/**
 * UserManagementSkeleton Component - Loading skeleton for user management
 *
 * Provides a skeleton loading state that matches the structure of the
 * UserManagementContent component for better perceived performance.
 *
 * @component UserManagementSkeleton
 */

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserManagementSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Actions Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="border-b">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-6 gap-4 px-6 py-4 items-center">
                {/* Checkbox */}
                <Skeleton className="h-4 w-4" />
                
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                
                {/* Role */}
                <Skeleton className="h-6 w-16 rounded-full" />
                
                {/* Status */}
                <Skeleton className="h-6 w-16 rounded-full" />
                
                {/* Last Login */}
                <Skeleton className="h-4 w-20" />
                
                {/* Actions */}
                <div className="flex items-center justify-end space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
