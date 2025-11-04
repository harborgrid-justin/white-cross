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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
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
            <Button variant="secondary" aria-label="Process payment for billing">
              <DollarSign className="h-4 w-4 mr-2" aria-hidden="true" />
              Process Payment
            </Button>
            <Button variant="default" aria-label="Create new invoice">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Create Invoice
            </Button>
          </div>
        }
      />

      <div className="p-6 h-[calc(100vh-12rem)]">
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-full rounded-lg border"
        >
          {/* Main Billing Content */}
          <ResizablePanel 
            defaultSize={75} 
            minSize={50}
            className="p-6"
          >
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <BillingContent />
            </Suspense>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Billing Sidebar */}
          <ResizablePanel 
            defaultSize={25} 
            minSize={20}
            className="p-6"
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <BillingSidebar />
            </Suspense>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
