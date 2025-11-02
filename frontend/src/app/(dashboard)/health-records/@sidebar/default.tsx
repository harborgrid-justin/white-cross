/**
 * @fileoverview Health Records Sidebar Default - Parallel route slot for sidebar navigation
 * @module app/(dashboard)/health-records/@sidebar/default
 * @category Health Records - Parallel Routes
 */

import { Suspense } from 'react';
import { HealthRecordsSidebar } from '../_components/HealthRecordsSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HealthRecordsSidebarDefaultProps {
  searchParams?: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    priority?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    studentId?: string;
    recordedBy?: string;
  };
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            <Skeleton className="h-4 w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function HealthRecordsSidebarDefault({ searchParams = {} }: HealthRecordsSidebarDefaultProps) {
  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <HealthRecordsSidebar searchParams={searchParams} />
    </Suspense>
  );
}


