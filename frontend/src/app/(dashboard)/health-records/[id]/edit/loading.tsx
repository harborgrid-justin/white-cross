'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

/**
 * Health Record Edit Loading State
 * 
 * Displays skeleton loading animation while health record edit form is being prepared.
 * Matches the form layout with sections and input fields.
 */
export default function LoadingHealthRecordEdit() {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-16" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Information Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-48" />
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
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </Card>

        {/* Medical Details Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
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

        {/* Additional Notes Section */}
        <Card className="p-6">
          <div className="mb-4">
            <Skeleton className="h-6 w-36" />
          </div>
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
