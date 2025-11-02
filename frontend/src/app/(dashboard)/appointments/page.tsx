/**
 * Appointments Page - White Cross Healthcare Platform
 *
 * Features:
 * - View scheduled appointments with modern component architecture
 * - Leverage server actions for data management
 * - Healthcare-specific appointment management
 * - Integration with parallel routes and modern patterns
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { PageBreadcrumbs } from '@/components/common/PageBreadcrumbs';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Dynamic imports for heavy components to optimize bundle size
const AppointmentsContent = dynamic(() => import('./_components/AppointmentsContent'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: true
});

const AppointmentsSidebar = dynamic(() => import('./_components/AppointmentsSidebar'), {
  loading: () => <Skeleton className="h-64 w-full" />,
  ssr: true
});

/**
 * Metadata for appointments page
 * Optimized for SEO and social sharing
 */
export const metadata: Metadata = {
  title: 'Appointments',
  description: 'Manage and schedule student healthcare appointments with comprehensive calendar views and real-time availability tracking.',
  keywords: [
    'appointments',
    'scheduling',
    'healthcare appointments',
    'student appointments',
    'medical scheduling',
    'appointment calendar'
  ],
  openGraph: {
    title: 'Appointments | White Cross Healthcare',
    description: 'Comprehensive appointment scheduling and management for student healthcare services.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBreadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments' },
        ]}
        className="mb-4"
      />

      <PageHeader
        title="Appointments"
        description="Manage student healthcare appointments and schedules"
        actions={
          <Button variant="default" size="sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            <span className="hidden xs:inline">Schedule </span>Appointment
          </Button>
        }
      />

      <div className="p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Main Appointments Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <AppointmentsContent />
            </Suspense>
          </div>

          {/* Appointments Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <AppointmentsSidebar />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
