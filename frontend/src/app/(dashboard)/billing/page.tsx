/**
 * Billing Page - White Cross Healthcare Platform
 *
 * Features:
 * - Healthcare billing and invoice management
 * - Insurance claims processing
 * - Financial reporting and analytics
 * - HIPAA-compliant billing operations
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy components to optimize bundle size
const BillingContent = dynamic(() => import('./_components/BillingContent'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: true
});

const BillingSidebar = dynamic(() => import('./_components/BillingSidebar'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: true
});

/**
 * Metadata for billing page
 */
export const metadata: Metadata = {
  title: 'Billing & Invoices',
  description: 'Comprehensive healthcare billing and invoice management with insurance claims processing, payment tracking, and HIPAA-compliant financial operations.',
  keywords: [
    'healthcare billing',
    'medical invoices',
    'insurance claims',
    'payment processing',
    'financial management',
    'billing analytics',
    'claims management',
    'HIPAA compliant billing'
  ],
  openGraph: {
    title: 'Billing & Invoices | White Cross Healthcare',
    description: 'Professional healthcare billing system with comprehensive invoice management, insurance claims processing, and financial reporting.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Billing & Invoices"
        description="Manage healthcare billing, insurance claims, and financial operations"
        actions={
          <div className="flex space-x-3">
            <Button variant="secondary">
              <DollarSign className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
            <Button variant="default">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Billing Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <BillingContent />
            </Suspense>
          </div>

          {/* Billing Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <BillingSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}



