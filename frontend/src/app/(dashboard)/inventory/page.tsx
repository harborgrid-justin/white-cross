/**
 * @fileoverview Inventory Management Page - Medical Supply Tracking System
 * @module app/(dashboard)/inventory/page
 * @category Inventory - Pages
 *
 * Comprehensive medical inventory management system with real-time stock tracking,
 * expiration monitoring, and automated alerts for healthcare facilities.
 *
 * **Key Features:**
 * - Medical supplies, medications, equipment, and consumables tracking
 * - Stock level monitoring with visual indicators and thresholds
 * - Expiration date tracking with automated alerts
 * - Controlled substance management with compliance logging
 * - Multi-location inventory visibility across facility departments
 * - Supplier management and purchase order integration
 * 
 * **Healthcare Compliance:**
 * - HIPAA-compliant inventory data handling
 * - FDA medication tracking requirements
 * - Controlled substance monitoring and audit trails
 * - Emergency medication availability verification
 *
 * **Integration Points:**
 * - Student health records for medication administration
 * - Incident reporting for supply usage tracking
 * - Appointment scheduling for preventive care supplies
 * - Emergency response protocols for critical medication access
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import { InventoryContent } from './_components/InventoryContent';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Inventory Management | White Cross Healthcare',
  description: 'Medical supply and medication inventory management with stock tracking, expiration monitoring, and automated alerts',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Inventory Management | White Cross Healthcare',
    description: 'Healthcare inventory tracking system with real-time stock levels, expiration alerts, and supply management',
    type: 'website',
  },
};



interface InventoryPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function InventoryPage({ searchParams }: InventoryPageProps) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Medical supplies, medications, and equipment tracking
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Skeleton className="h-96 col-span-4" />
              <Skeleton className="h-96 col-span-3" />
            </div>
          </div>
        }
      >
        <InventoryContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}


