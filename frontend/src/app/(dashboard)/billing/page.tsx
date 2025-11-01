/**
 * Billing Page - White Cross Healthcare Platform
 *
 * Features:
 * - Healthcare billing and invoice management
 * - Insurance claims processing
 * - Financial reporting and analytics
 * - HIPAA-compliant billing operations
 */

'use client';

/**
 * Force dynamic rendering for real-time billing data
 */


import React from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import BillingContent from './_components/BillingContent';
import BillingSidebar from './_components/BillingSidebar';

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
            <Button variant="primary">
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
            <BillingContent />
          </div>
          
          {/* Billing Sidebar */}
          <div className="lg:col-span-1">
            <BillingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}