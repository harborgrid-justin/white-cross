import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MedicationsSidebar } from '../_components/MedicationsSidebar';

interface MedicationsSidebarDefaultProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    search?: string;
    studentId?: string;
    category?: string;
    dueDate?: string;
  };
}

export default function MedicationsSidebarDefault({ searchParams }: MedicationsSidebarDefaultProps) {
  return (
    <Suspense fallback={
      <div className="p-6 space-y-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-32 w-full" />
          </Card>
        ))}
      </div>
    }>
      <MedicationsSidebar searchParams={searchParams} />
    </Suspense>
  );
}


