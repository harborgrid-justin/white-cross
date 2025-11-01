'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

/**
 * New Health Record Loading State
 * 
 * Displays skeleton loading animation while new health record form is being prepared.
 * Matches the form layout for creating a new health record.
 */
export default function LoadingNewHealthRecord() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Student Selection Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>

        {/* Record Details Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </Card>

        {/* Medical Information Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-28 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </Card>

        {/* Provider Information Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>

        {/* Follow-up Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex items-center space-x-3 pt-6">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </Card>

        {/* Additional Settings Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-44" />
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
