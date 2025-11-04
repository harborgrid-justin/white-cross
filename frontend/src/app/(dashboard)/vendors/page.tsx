/**
 * Vendors & Suppliers Page
 *
 * Route: /vendors
 * Manage healthcare vendors, suppliers, and procurement
 */

import { Metadata } from 'next';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Vendors & Suppliers',
  description: 'Manage healthcare vendors, suppliers, and procurement relationships for medical supplies and services.',
  keywords: [
    'vendors',
    'suppliers',
    'procurement',
    'healthcare vendors',
    'medical supplies',
    'vendor management'
  ],
  openGraph: {
    title: 'Vendors & Suppliers | White Cross Healthcare',
    description: 'Comprehensive vendor and supplier management for healthcare procurement.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Vendors & Suppliers"
        description="Manage healthcare vendors, suppliers, and procurement"
        actions={
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        }
      />
      <div className="p-6">
        <div>Vendors content coming soon</div>
      </div>
    </div>
  );
}



