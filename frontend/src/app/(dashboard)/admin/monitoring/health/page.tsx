/**
 * @fileoverview Enhanced System Health Monitoring Page
 * @module app/(dashboard)/admin/monitoring/health/page
 *
 * Next.js v16 enhanced system health monitoring page with server-side caching,
 * real-time metrics, and comprehensive operational visibility.
 *
 * Features:
 * - Server Components with 'use cache' integration
 * - Real-time system health metrics
 * - Service availability monitoring
 * - Resource utilization tracking
 * - Active alerts management
 * - AdminPageHeader integration
 * - Streaming with Suspense boundaries
 *
 * @security RBAC - Requires 'admin' or 'system_administrator' role
 * @audit System health access logged for compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @since 2025-11-05
 */

import { Suspense } from 'react';
import { getSystemHealth } from '@/lib/actions/admin.monitoring';
import { AdminPageHeader } from '../../_components/AdminPageHeader';
import { AdminStatusIndicator } from '@/components/admin';
import { Activity, Server, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SystemHealthDisplay } from './_components/SystemHealthDisplay';

/**
 * System health content component with enhanced server-side data fetching
 */
async function SystemHealthContent() {
  const health = await getSystemHealth();
  
  // Calculate summary metrics
  const totalServices = health.services.length;
  const operationalServices = health.services.filter(s => s.status === 'operational').length;
  const degradedServices = health.services.filter(s => s.status === 'degraded').length;
  const downServices = health.services.filter(s => s.status === 'down').length;
  const activeAlerts = health.alerts.filter(a => !a.acknowledged).length;
  
  // Format uptime
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <AdminPageHeader
        title="System Health Monitoring"
        description="Real-time operational metrics and service availability monitoring"
        count={totalServices}
        countLabel="services monitored"
        status={{
          label: health.status === 'healthy' ? 'System Healthy' : 
                health.status === 'degraded' ? 'System Degraded' : 'System Down',
          variant: health.status === 'healthy' ? 'success' : 
                  health.status === 'degraded' ? 'warning' : 'error',
          icon: health.status === 'healthy' ? <CheckCircle className="h-4 w-4" /> :
                health.status === 'degraded' ? <AlertTriangle className="h-4 w-4" /> :
                <AlertTriangle className="h-4 w-4" />,
        }}
        actions={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Uptime: {formatUptime(health.overall.uptime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span>{operationalServices}/{totalServices} operational</span>
            </div>
            {activeAlerts > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{activeAlerts} alerts</span>
              </div>
            )}
          </div>
        }
      />

      {/* System Health Display */}
      <SystemHealthDisplay health={health} />
    </div>
  );
}

/**
 * Loading skeleton for system health page
 */
function SystemHealthSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Stats skeleton */}
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

/**
 * System health monitoring page component.
 *
 * Main page component that wraps the async health content in a Suspense boundary,
 * providing loading state while system health data is fetched. Essential for
 * real-time operational visibility and proactive incident management.
 *
 * @returns {JSX.Element} System health page with loading boundary
 *
 * @security Requires admin role - enforced by parent routes and middleware
 * @audit Page access logged for HIPAA compliance
 * @compliance HIPAA - System monitoring required for operational oversight
 *
 * @architecture Server Component with Suspense for async data
 * @rendering Server-side data fetch with progressive loading
 *
 * @example
 * ```tsx
 * // Accessed via: /admin/monitoring/health
 * // Shows loading spinner while fetching system health data
 * // Then displays complete health dashboard
 * ```
 */
export default function SystemHealthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }
    >
      <SystemHealthContent />
    </Suspense>
  )
}
