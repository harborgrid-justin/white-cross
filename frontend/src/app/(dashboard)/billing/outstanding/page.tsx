'use client';

/**
 * Force dynamic rendering for outstanding balances - financial data changes frequently
 */


import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';

export default function OutstandingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Outstanding Invoices"
        description="View overdue and pending invoices"
        backLink="/billing"
        backLabel="Back to Billing"
      />

      <Card>
        <div className="p-6 text-center text-gray-500">
          <p>No outstanding invoices.</p>
          <p className="text-sm mt-2">Overdue and pending invoices will appear here.</p>
        </div>
      </Card>
    </div>
  );
}


