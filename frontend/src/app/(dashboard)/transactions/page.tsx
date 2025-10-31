import { Suspense } from 'react';
import { TransactionsContent } from './_components/TransactionsContent';
import { TransactionsFilters } from './_components/TransactionsFilters';
import { TransactionsSidebar } from './_components/TransactionsSidebar';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface TransactionsPageProps {
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

export default function TransactionsPage({ searchParams }: TransactionsPageProps) {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Financial Transactions</h1>
            <p className="text-gray-600">
              Manage payments, refunds, insurance claims, and financial records
            </p>
          </div>

          {/* Filters */}
          <Suspense fallback={
            <Card className="p-4">
              <Skeleton className="h-16 w-full" />
            </Card>
          }>
            <TransactionsFilters searchParams={searchParams} />
          </Suspense>

          {/* Transactions Content */}
          <Suspense fallback={
            <Card>
              <div className="p-6 space-y-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </Card>
          }>
            <TransactionsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-gray-200 overflow-auto">
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
      </div>
    </div>
  );
}