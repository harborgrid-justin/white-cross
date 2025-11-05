/**
 * @fileoverview Health Monitoring Layout - Layout for health monitoring pages
 * @module app/(dashboard)/admin/monitoring/health/layout
 * @category Admin - Health Monitoring
 */

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface HealthMonitoringLayoutProps {
  children: React.ReactNode;
}

export default function HealthMonitoringLayout({ children }: HealthMonitoringLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Health Monitoring</h1>
        <p className="text-gray-600 mt-1">Monitor system health, uptime, and service dependencies</p>
      </div>
      
      <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>}>
        {children}
      </Suspense>
    </div>
  );
}
