import { Suspense } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { TransactionsSidebar } from '../_components/TransactionsSidebar';

interface TransactionsSidebarDefaultProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: string;
    maxAmount?: string;
    studentId?: string;
    paymentMethod?: string;
  };
}

export default function TransactionsSidebarDefault({ searchParams }: TransactionsSidebarDefaultProps) {
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
      <TransactionsSidebar searchParams={searchParams} />
    </Suspense>
  );
}