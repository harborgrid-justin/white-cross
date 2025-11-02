'use client';

import React from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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



