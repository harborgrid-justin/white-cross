'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/layout/Card';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Track payments and transactions"
        backLink="/billing"
        backLabel="Back to Billing"
      />

      <Card>
        <div className="p-6 text-center text-gray-500">
          <p>No payments found.</p>
          <p className="text-sm mt-2">Payment records will appear here once transactions are processed.</p>
        </div>
      </Card>
    </div>
  );
}
