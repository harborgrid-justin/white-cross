'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/layout/Card';

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="View and manage all invoices"
        backLink="/billing"
        backLabel="Back to Billing"
      />

      <Card>
        <div className="p-6 text-center text-gray-500">
          <p>No invoices found.</p>
          <p className="text-sm mt-2">Invoices will appear here once they are created.</p>
        </div>
      </Card>
    </div>
  );
}
