/**
 * @fileoverview Students Sidebar Default - Parallel route slot for sidebar navigation
 * @module app/(dashboard)/students/@sidebar/default
 * @category Students - Parallel Routes
 */

import { Suspense } from 'react';
import { StudentsSidebar } from '../_components/StudentsSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface StudentsSidebarDefaultProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    grade?: string;
    status?: string;
    hasHealthAlerts?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-24" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function StudentsSidebarDefault({ searchParams }: StudentsSidebarDefaultProps) {
  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <StudentsSidebar searchParams={searchParams} />
    </Suspense>
  );
}


